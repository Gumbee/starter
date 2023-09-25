import { NextPage } from "next";
import { FunctionComponent } from "react";
import { LayoutProps } from "./layout";

export type LogbookPage = NextPage & {
  layout?: FunctionComponent<LayoutProps>;
};
