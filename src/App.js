import React, { useState } from 'react';

import { useDarkMode, AnimatedButton, Message } from './hooks';

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

  const handleReset = () => {
    setChallenge({});
    setDidWin(null);
    setIsLoading(false);
  }

  return (
    <div className="container">
      <h1 className="title">Hooks Trivia Game</h1>
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
          && <div className="question"><div dangerouslySetInnerHTML={{ __html: challenge.question }} /></div>
        )}

      {
        Object.keys(challenge).length
          ?
          <>
            <AnimatedButton cssClass="button button--true" clickHandler={() => handleAnswer('True')}>True</AnimatedButton>
            <AnimatedButton cssClass="button button--false" clickHandler={() => handleAnswer('False')}>False</AnimatedButton>
            <div className="difficulty-display">{difficulty} Mode</div>
            <div className="reset-button" onClick={handleReset}>Reset</div>
          </>
          :
          <>
            <h3>Choose a difficulty: </h3>
            <select className="difficulty-selector" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <AnimatedButton cssClass="button button--start" clickHandler={newChallenge}>Start</AnimatedButton>
          </>
      }

      {didWin !== null && (didWin
        ? <Message cssClass="result result--correct">Last answer was correct! <span role="img" aria-label="congrats emoji">🙌</span></Message>
        : <Message cssClass="result result--incorrect">Last answer was incorrect <span role="img" aria-label="thinking emoji">🤔</span></Message>
      )}
    </div>
  );
}
