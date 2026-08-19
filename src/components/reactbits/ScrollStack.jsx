import React, { useLayoutEffect, useRef } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 24,
  stackPosition = '15%',
  scaleEndPosition = '5%',
  baseScale = 0.88,
  useWindowScroll = true
}) => {
  const scrollerRef = useRef(null);

  useLayoutEffect(() => {
    let lenis;
    if (useWindowScroll) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
      });

      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }

    return () => {
      if (lenis) {
        lenis.destroy();
      }
    };
  }, [useWindowScroll]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className="scroll-stack-card-wrapper"
            style={{
              top: `calc(${stackPosition} + ${index * itemStackDistance}px)`,
              zIndex: index + 1
            }}
          >
            {child}
          </div>
        ))}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
