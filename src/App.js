import React, { useState } from 'react';

export default function App() {
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
      <h1>Hooks Trivia Game</h1>
      {(isLoading && <div>Loading...</div>) || (!!Object.keys(challenge).length && <div>Question: <div dangerouslySetInnerHTML={challenge && { __html: challenge.question }} /></div>)}
      {
        Object.keys(challenge).length
          ?
          <>
            <button onClick={() => handleAnswer('False')}>False</button>
            <button onClick={() => handleAnswer('True')}>True</button>
          </>
          :
          <button onClick={newChallenge}>Start</button>
      }
      {didWin !== null && (didWin
        ? <div style={{ color: '#1b1' }}>Correct</div>
        : <div style={{ color: '#b11' }}>Incorrect</div>
      )}
    </div>
  );
}
