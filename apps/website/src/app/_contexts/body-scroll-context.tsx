import { createContext, useContext, useLayoutEffect, useState } from "react";

interface BodyScrollLatchContextProps {
  isBodyScrollBlocked: boolean;
  blockBodyScroll(): void;
  unblockBodyScroll(): void;
}

const BodyScrollLatchContext = createContext<BodyScrollLatchContextProps>(
  {} as BodyScrollLatchContextProps,
);

export function BodyScrollLatchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [count, setCount] = useState(0);

  const isBodyScrollBlocked = count > 0;

  function blockBodyScroll() {
    setCount((prev) => prev + 1);
  }

  function unblockBodyScroll() {
    setCount((prev) => Math.max(prev - 1, 0));
  }

  useLayoutEffect(() => {
    if (isBodyScrollBlocked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // if (isBodyScrollBlocked) {
    //   disableBodyScroll(document.body);
    // } else {
    //   enableBodyScroll(document.body);
    // }
  }, [isBodyScrollBlocked]);

  return (
    <BodyScrollLatchContext.Provider
      value={{ isBodyScrollBlocked, blockBodyScroll, unblockBodyScroll }}
    >
      {children}
    </BodyScrollLatchContext.Provider>
  );
}

export function useBodyScrollLatch() {
  return useContext(BodyScrollLatchContext);
}

export function useBodyScrollBlock(block: boolean) {
  const { blockBodyScroll, unblockBodyScroll } = useBodyScrollLatch();

  useLayoutEffect(() => {
    if (block) {
      blockBodyScroll();
    }

    return () => {
      if (block) {
        unblockBodyScroll();
      }
    };
  }, [block, blockBodyScroll, unblockBodyScroll]);
}
