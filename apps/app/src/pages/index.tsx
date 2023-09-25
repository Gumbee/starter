import { Inter } from "next/font/google";
import { LogbookPage } from "@/types/page";
import { DefaultLayout } from "@/layouts/DefaultLayout";

const inter = Inter({ subsets: ["latin"] });

const Page: LogbookPage = ({}) => {
  return <div>Hello</div>;
};

Page.layout = DefaultLayout;

export default Page;
