import { apiSSR } from '@forge/api/client';
import { ROUTES } from '@forge/api/routes';
import { User } from '@forge/database';
import { AUTH_COOKIE_NAME } from '@forge/common/constants';
import { IS_NATIVE_APP } from '@forge/common/environment';
import { GetServerSideProps, PreviewData } from 'next';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Optional } from '@forge/common/types';

export function withSSRSession(fn: GetServerSideProps) {
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
export function ifWeb(fn: GetServerSideProps): Optional<GetServerSideProps> {
  return IS_NATIVE_APP ? undefined : undefined;
}
