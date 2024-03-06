import { NextPage } from 'next';
import { FunctionComponent } from 'react';
import { LayoutProps } from './layout';

export type LogbookPage<P = {}> = NextPage<P> & {
  layout?: FunctionComponent<LayoutProps>;
  layoutProps?: LayoutProps;
};
