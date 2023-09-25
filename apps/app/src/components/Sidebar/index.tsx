import { Books, IconProps, Pen } from "@phosphor-icons/react";
import { FC, FunctionComponent, createElement } from "react";
import { Button } from "../Button";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

export type SidebarItem = {
  icon: FunctionComponent<IconProps>;
  href: string;
};

type SidebarProps = {
  items: SidebarItem[];
};

export const Sidebar: FC<SidebarProps> = ({ items }) => {
  const router = useRouter();
  const activeHref = router.asPath;

  return (
    <nav className="flex flex-col">
      {items.map((item) => (
        <div
          key={item.href}
          className={clsx(
            "flex",
            activeHref !== item.href &&
              "opacity-20 hover:opacity-50 transition-opacity duration-200 ease-in-out"
          )}
        >
          <Button
            as={Link}
            href={item.href}
            pressScale={0.95}
            className={clsx("p-[8px]")}
          >
            {createElement(item.icon, { size: 24 })}
          </Button>
        </div>
      ))}
    </nav>
  );
};
