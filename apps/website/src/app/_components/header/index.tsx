import { ReactNode } from "react"

import { Logo } from "./logo";
import { HamburgerMenu } from "./menu";
import { TabBar, Tab } from "./tab-bar";

interface HeaderProps {
  children?: ReactNode;
};

export function Header({ children }: HeaderProps) {
  return (
    <div className="flex items-center p-2">
      {children}
    </div>
  );
}

Header.Logo = Logo;
Header.Menu = HamburgerMenu;
Header.TabBar = TabBar;
Header.Tab = Tab;