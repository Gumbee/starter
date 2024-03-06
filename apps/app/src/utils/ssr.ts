import { apiSSR } from '@forge/api/client';
import { ROUTES } from '@forge/api/routes';
import { User } from '@forge/database';
import { AUTH_COOKIE_NAME } from '@forge/common/constants';
import { IS_NATIVE_APP } from '@forge/common/environment';
import { GetServerSideProps, GetServerSidePropsResult, PreviewData } from 'next';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Optional } from '@forge/common/types';

type GetServerSidePropsWithInfo<P extends { [key: string]: any } = { [key: string]: any }> = (
  ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
  hasAuth: boolean,
) => Promise<GetServerSidePropsResult<P>>;

export function withHasAuth<P extends { [key: string]: any } = { [key: string]: any }>(fn: GetServerSidePropsWithInfo<P>) {
  return async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
    const cookie = ctx.req.cookies[AUTH_COOKIE_NAME];

    if (cookie) {
      return fn(ctx, true);
    }

    return fn(ctx, false);
  };
}

export function withSSRSession<P extends { [key: string]: any } = { [key: string]: any }>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
    const cookie = ctx.req.cookies[AUTH_COOKIE_NAME];

    if (cookie) {
      try {
        const me = await apiSSR
          .get<User>(ROUTES.getUsersMe(), {
            headers: {
              cookie: ctx.req.headers.cookie,
            },
          })
          .then((x) => x.data);

        if (!me) throw new Error('Not authenticated');

        ctx.req.user = me;
      } catch (e: any) {}
    }

    return fn(ctx);
  };
}

// we can't use getServerSideProps in native apps
export function ifWeb<P extends { [key: string]: any } = { [key: string]: any }>(
  fn: GetServerSideProps<P>,
): Optional<GetServerSideProps<P>> {
  return IS_NATIVE_APP ? undefined : fn;
}
