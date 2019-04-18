import React, { useState } from 'react';

export default function App() {
  // TODO: https://usehooks.com/useDarkMode/
  // const [darkMode, setDarkMode] = useDarkMode();

  const [challenge, setChallenge] = useState({});
  const [didWin, setDidWin] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API = 'https://opentdb.com/api.php';

  const newChallenge = async () => {
    setIsLoading(true);
    await fetch(`${API}?amount=1&type=boolean`)
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
      <div className="darkmode-toggle">☾ dark mode</div>
      {(isLoading && <div className="loading"><div className="loading--spinner" /></div>) || (!!Object.keys(challenge).length && <div className="question"><h2>Question:</h2><div dangerouslySetInnerHTML={challenge && { __html: challenge.question }} /></div>)}
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
        ? <div class="result result--correct">Last answer was correct! :)</div>
        : <div class="result result--incorrect">Last answer was incorrect :(</div>
      )}
    </div>
  );
}
