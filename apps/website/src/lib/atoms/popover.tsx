import {
  createContext,
  HTMLAttributes,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { animated, AnimatedProps, easings, useTransition } from "react-spring";

interface PopoverContextProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
}

interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClickOutside?(): void;
}

interface PopoverTriggerProps {
  children?: ReactNode;
}

interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {}

const PopoverContext = createContext<PopoverContextProps>(
  {} as PopoverContextProps,
);

function Popover({ open, onClickOutside, children, ...props }: PopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleMouseDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        onClickOutside?.();
      }
    }

    window.addEventListener("mousedown", handleMouseDown);

    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [open, onClickOutside]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleTouchStart(event: TouchEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        onClickOutside?.();
      }
    }

    window.addEventListener("touchstart", handleTouchStart);

    return () => window.removeEventListener("touchstart", handleTouchStart);
  });

  return (
    <PopoverContext.Provider value={{ open }}>
      <div ref={containerRef} {...props}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

Popover.Trigger = function PopoverTrigger({ children }: PopoverTriggerProps) {
  return children;
};

Popover.Content = function PopoverContent({
  children,
  ...props
}: PopoverContentProps) {
  const { open } = useContext(PopoverContext);

  const [offsetTop, setOffsetTop] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);

  const [triggerWidth, setTriggerWidth] = useState(0);
  const [triggerHeight, setTriggerHeight] = useState(0);

  const [availableHeight, setAvailableHeight] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (open) {
      const wrapperRect = wrapperRef.current?.getBoundingClientRect();

      const wrapperWidth = wrapperRect?.width ?? 0;
      const wrapperHeight = wrapperRect?.height ?? 0;

      setTriggerWidth(wrapperWidth);
      setTriggerHeight(wrapperHeight);
    }
  }, [open]);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    let frame: number;

    function loop() {
      if (wrapperRef.current && contentRef.current) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect();

        const offsetTop = wrapperRect.top;
        const offsetLeft = Math.max(
          Math.min(wrapperRect.left, window.innerWidth - contentRect.width),
          0,
        );

        const availableHeight = window.innerHeight - offsetTop;

        setOffsetTop(offsetTop);
        setOffsetLeft(offsetLeft);
        setAvailableHeight(availableHeight);
      }

      frame = requestAnimationFrame(loop);
    }

    loop();

    return () => cancelAnimationFrame(frame);
  }, [open]);

  const transitions = useTransition(open, {
    from: { opacity: 0, scale: 0.9 },
    enter: { opacity: 1, scale: 1.0 },
    leave: { opacity: 0, scale: 0.9 },
    config: {
      duration: 100,
      easing: easings.easeInOutQuad,
    },
  });

  return (
    <div ref={wrapperRef}>
      {transitions(
        (style, item) =>
          item && (
            <animated.div
              className="fixed z-50"
              style={
                {
                  ...style,
                  top: offsetTop,
                  left: offsetLeft,
                  "--popover-trigger-width": `${triggerWidth}px`,
                  "--popover-trigger-height": `${triggerHeight}px`,
                  "--popover-available-height": `${availableHeight}px`,
                } as AnimatedProps<HTMLAttributes<"div">>["style"]
              }
            >
              <div ref={contentRef} {...props}>
                {children}
              </div>
            </animated.div>
          ),
      )}
    </div>
  );
};

export { Popover };
