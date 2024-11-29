import { useEffect, useRef, type ReactNode } from "react";

import { Logo } from "./logo";
import { HamburgerMenu } from "./menu";
import { TabBar, Tab } from "./tab-bar";

interface HeaderProps {
  children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function refreshWidth() {
      if (containerRef.current) {
        containerRef.current.style.width = `${document.body.clientWidth}px`;
      }
    }

    refreshWidth();

    window.addEventListener("resize", refreshWidth);

    return () => window.removeEventListener("resize", refreshWidth);
  }, []);

  return (
    <div
      ref={containerRef}
      className="sticky left-0 flex h-14 items-center p-2"
    >
      {children}
    </div>
  );
}

Header.Logo = Logo;
Header.Menu = HamburgerMenu;
Header.TabBar = TabBar;
Header.Tab = Tab;
