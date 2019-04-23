import React, { useState, useEffect } from 'react';

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
      .then(res => setChallenge(res.results[0]));
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
      <select class="difficulty-selector" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="difficult">Difficult</option>
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
          && <div className="question"><h2>Question:</h2><div dangerouslySetInnerHTML={challenge && { __html: challenge.question }} /></div>
        )}
      {
        Object.keys(challenge).length
          ?
          <>
            <button className="button button--false" onClick={() => handleAnswer('False')}>False</button>
            <button className="button button--true" onClick={() => handleAnswer('True')}>True</button>
          </>
          :
          <button class="button button--start" onClick={newChallenge}>Start</button>
      }

      {didWin !== null && (didWin
        ? <div class="result result--correct">Last answer was correct! 🙌</div>
        : <div class="result result--incorrect">Last answer was incorrect 🤔</div>
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