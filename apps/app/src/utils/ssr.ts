import { apiSSR } from '@logbook/api/client';
import { ROUTES } from '@logbook/api/routes';
import { User } from '@logbook/database';
import { AUTH_COOKIE_NAME } from '@logbook/common/constants';
import { IS_NATIVE_APP } from '@logbook/common/environment';
import { GetServerSideProps, PreviewData } from 'next';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Optional } from '@logbook/common/types';

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
