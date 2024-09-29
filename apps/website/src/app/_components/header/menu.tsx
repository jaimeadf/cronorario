import { type ButtonHTMLAttributes, type ReactNode, useState } from "react";
import Link, { type LinkProps } from "next/link";
import { Icon, Menu, X } from "react-feather";

import { cn } from "@/lib/utils";

interface HamburgerMenuProps {
  children?: ReactNode;
}

interface HamburgerMenuButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: Icon;
}

interface HamburgerMenuItemProps {
  icon: Icon;
  label: string;
}

type HamburgerMenuActionProps = HamburgerMenuItemProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

type HamburgerMenuLinkProps = HamburgerMenuItemProps &
  LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps;

function HamburgerMenuButton({
  icon,
  className,
  ...props
}: HamburgerMenuButtonProps) {
  const Icon = icon;

  return (
    <button
      {...props}
      className={cn(
        "rounded-lg bg-primary p-2 hover:bg-primary-hover",
        className,
      )}
    >
      <Icon className="size-6 text-primary" />
    </button>
  );
}

function HamburgerMenuItem({ icon, label }: HamburgerMenuItemProps) {
  const Icon = icon;

  return (
    <div className="group border-b border-secondary hover:border-transparent hover:outline hover:outline-bg-primary">
      <div className="flex items-center gap-2 rounded-lg bg-primary px-2 py-4 group-hover:bg-primary-hover">
        <Icon className="size-6 text-primary" />
        <div className="text-nowrap font-medium text-primary">{label}</div>
      </div>
    </div>
  );
}

function HamburgerMenuLinkItem({
  icon,
  label,
  ...props
}: HamburgerMenuLinkProps) {
  return (
    <Link {...props}>
      <HamburgerMenuItem icon={icon} label={label} />
    </Link>
  );
}

function HamburgerMenuButtonItem({
  icon,
  label,
  ...props
}: HamburgerMenuActionProps) {
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
      <HamburgerMenuButton icon={Menu} onClick={toggle} />
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-50 h-screen w-screen bg-primary opacity-0 transition-all duration-100",
          { "pointer-events-auto opacity-100": open },
        )}
      >
        <div className="p-2">
          <HamburgerMenuButton icon={X} onClick={toggle} />
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

HamburgerMenu.ButtonItem = HamburgerMenuButtonItem;
HamburgerMenu.LinkItem = HamburgerMenuLinkItem;
