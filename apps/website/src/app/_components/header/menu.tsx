import { type ButtonHTMLAttributes, type ReactNode, useState } from "react";
import Link, { type LinkProps } from "next/link";
import { Icon, Menu, X } from "react-feather";


import { cn } from "@/lib/utils";

interface HamburgerMenuProps {
  children?: ReactNode;
}

interface HamburgerMenuItemProps {
  icon: Icon;
  label: string;
}

type HamburgerMenuButtonProps = HamburgerMenuItemProps & ButtonHTMLAttributes<HTMLButtonElement>;
type HamburgerMenuLinkProps = HamburgerMenuItemProps & LinkProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps;

function HamburgerMenuItem({ icon, label }: HamburgerMenuItemProps) {
  const Icon = icon;
  
  return (
    <div className="group border-b border-secondary hover:outline hover:outline-bg-primary hover:border-transparent">
      <div className="flex items-center gap-2 px-2 py-4 rounded-lg bg-primary group-hover:bg-primary-hover">
        <Icon className="size-6 text-primary" />
        <div className="font-medium text-nowrap text-primary">{label}</div>
      </div>
    </div>
  );
}

function HamburgerMenuLink({ icon, label, ...props }: HamburgerMenuLinkProps) {
  return (
    <Link {...props}>
      <HamburgerMenuItem icon={icon} label={label} />
    </Link>
  );
}

function HamburgerMenuButton({ icon, label, ...props }: HamburgerMenuButtonProps) {
  return (
    <button {...props}>
      <HamburgerMenuItem icon={icon} label={label} />
    </button>
  );
}

export function HamburgerMenu({ children }: HamburgerMenuProps) {
  const [open, setOpen] = useState(false);
  
  function toggle() {
    setOpen(!open);
  }

  return (
    <div>
      <button className="p-2 rounded-lg text-primary bg-primary hover:bg-primary-hover" onClick={toggle}>
        <Menu className="size-6" />
      </button>
      <div
        className={cn(
          "fixed inset-0 z-50 w-screen h-screen opacity-0 pointer-events-none transition-all duration-100 bg-primary",
          { "opacity-100 pointer-events-auto": open }
        )}
      >
        <div className="p-2">
          <button className="p-2 rounded-lg text-primary bg-primary hover:bg-primary-hover" onClick={toggle}>
            <X className="size-6" />
          </button>
        </div>
        <div className="p-2">
          <div className="flex flex-col border-t border-secondary">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

HamburgerMenu.Button = HamburgerMenuButton;
HamburgerMenu.Link = HamburgerMenuLink;