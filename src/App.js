import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';

export default function App() {
  // import custom hooks
  const [darkMode, setDarkMode] = useDarkMode();

  const [challenge, setChallenge] = useState({});
  const [didWin, setDidWin] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');

  const API = 'https://opentdb.com/api.php';

  const newChallenge = async () => {
    setIsLoading(true);
    await fetch(`${API}?amount=1&type=boolean&difficulty=${difficulty}`)
      .then(data => data.json())
      .then(res => {
        setChallenge(res.results[0]);
      });
    setIsLoading(false);
  }

  const handleAnswer = (answer) => {
    if (challenge.correct_answer === answer) {
      setDidWin(true);
    } else {
      setDidWin(false);
    }
    newChallenge();
  }

  return (
    <div className="container">
      <h1 className="title">Hooks Trivia Game</h1>
      <select className="difficulty-selector" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">hard</option>
      </select>
      <div className="darkmode-toggle" onClick={() => darkMode ? setDarkMode(false) : setDarkMode(true)}>
        {darkMode
          ? '☀ light mode'
          : '☾ dark mode'
        }
      </div>
      {(isLoading
        && <div className="loading"><div className="loading--spinner" /></div>)
        || (
          !!Object.keys(challenge).length
          && <div className="question"><h2>Question:</h2><div dangerouslySetInnerHTML={{ __html: challenge.question }} /></div>
        )}
      {
        Object.keys(challenge).length
          ?
          <>
            <AnimatedButton cssClass="button button--false" clickHandler={() => handleAnswer('False')}>False</AnimatedButton>
            <AnimatedButton cssClass="button button--true" clickHandler={() => handleAnswer('True')}>True</AnimatedButton>
          </>
          :
          <AnimatedButton cssClass="button button--start" clickHandler={newChallenge}>Start</AnimatedButton>
      }

      {didWin !== null && (didWin
        ? <div className="result result--correct">Last answer was correct! <span role="img" aria-label="congrats emoji">🙌</span></div>
        : <div className="result result--incorrect">Last answer was incorrect <span role="img" aria-label="thinking emoji">🤔</span></div>
      )}
    </div>
  );
}


/**
        CUSTOM HOOKS DOWN HERE
this is a good place to define them, they are not the main function, but because they are regular functions they are still hoisted
*/

// https://usehooks.com/useDarkMode/
function useDarkMode() {
  // persist state through page refresh
  const [enabled, setEnabled] = useLocalStorage('dark-mode-enabled');

  useEffect(() => {
    const className = 'dark-mode';
    const element = window.document.body;
    if (enabled) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  },
    [enabled]
  );

  return [enabled, setEnabled];
}

// https://usehooks.com/useLocalStorage/
function useLocalStorage(key, initialValue) {
  // checks if there is already localStorage, otherwise defaults to initialValue
  const [storedValue, setStoredValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    // parse stored json or default to initialValue
    return item ? JSON.parse(item) : initialValue;
  });

  // wrapped version of useState's setter function
  const setValue = value => {
    // allow value to be a function se we have same api as useState
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    // save state
    setStoredValue(valueToStore);
    // save to localStorage
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  }

  return [storedValue, setValue];
}

// Makes use of React-Springs useSpring hook
// https://usehooks.com/useSpring/ -- although it seems like there is a problem
// check out https://www.react-spring.io/docs/hooks/use-spring for the latest
function AnimatedButton({ children, cssClass, clickHandler }) {
  // add ref to get elements offset and dimensions
  const ref = useRef();

  const [isHovered, setHovered] = useState(false);

  // the useSpring hook
  const [props, set] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 10, tension: 600, friction: 30 } }));

  return (
    <animated.button
      ref={ref}
      className={cssClass}
      onClick={clickHandler}
      onMouseEnter={() => setHovered(true)}
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
          1.1 // scale
        ];

        // update values to animate to
        set({ xys: xys });
      }}
      onMouseLeave={() => {
        setHovered(false);
        // set xys back to default
        set({ xys: [0, 0, 1] });
      }}
      style={{
        // overlap other cards when it scales up
        zIndex: isHovered ? 2 : 1,
        // interpolate values to handle changes
        transform: props.xys.interpolate(
          (x, y, s) =>
            `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`
        )
      }}
    >
      {children}
    </animated.button>
  );
}