import React, { useRef } from 'react';
import { animated, useSpring } from 'react-spring';

// Makes use of React-Springs useSpring hook
// https://usehooks.com/useSpring/ -- although it seems like there is a problem with the code there
// check out https://www.react-spring.io/docs/hooks/use-spring for the latest
export function AnimatedButton({ children, cssClass, clickHandler }) {
  // add ref to get element's offset and dimensions
  const ref = useRef();

  // the useSpring hook
  const [animatedProps, setAnimatedProps] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 10, tension: 900, friction: 20 } }));

  return (
    <animated.button
      ref={ref}
      className={cssClass}
      onClick={({ clientX, clientY }) => {
        clickHandler();
        // get mouse x position within card
        const x = clientX - (ref.current.offsetLeft - (window.scrollX || window.pageXOffset || document.body.scrollLeft));
        // get mouse y position within card
        const y = clientY - (ref.current.offsetTop - (window.scrollY || window.pageYOffset || document.body.scrollTop));

        // set animated vals vased on mouse position and card dimensions
        const dampen = 5;
        const xys = [
          -(y - ref.current.clientHeight / 2) / dampen, // rotateX
          (x - ref.current.clientWidth / 2) / dampen, // rotateY
          1.15 // scale
        ];
        // update values to animate to
        setAnimatedProps({ xys: xys });
      }}
      onMouseMove={({ clientX, clientY }) => {
        // get mouse x position within card
        const x = clientX - (ref.current.offsetLeft - (window.scrollX || window.pageXOffset || document.body.scrollLeft));
        // get mouse y position within card
        const y = clientY - (ref.current.offsetTop - (window.scrollY || window.pageYOffset || document.body.scrollTop));

        // set animated vals vased on mouse position and card dimensions
        const dampen = 5;
        const xys = [
          -(y - ref.current.clientHeight / 2) / dampen, // rotateX
          (x - ref.current.clientWidth / 2) / dampen, // rotateY
          1.15 // scale
        ];

        // update values to animate to
        setAnimatedProps({ xys: xys });
      }}
      onMouseLeave={() => {
        // set xys back to default
        setAnimatedProps({ xys: [0, 0, 1] });
      }}
      style={{
        // interpolate values to handle changes
        transform: animatedProps.xys.interpolate(
          (x, y, s) =>
            `perspective(400px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`
        )
      }}
    >
      {children}
    </animated.button>
  );
}
