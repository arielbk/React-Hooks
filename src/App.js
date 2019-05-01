import React, { useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { FaPlay, FaRedoAlt, FaCheck, FaTimes, FaThermometerEmpty, FaThermometerHalf, FaThermometerFull } from 'react-icons/fa';

import { useDarkMode, AnimatedButton } from './hooks';
import ProgressBar from './ProgressBar';

export default function App() {
  const numberQuestions = 20;

  const [darkMode, setDarkMode] = useDarkMode();

  const [challenge, setChallenge] = useState({});
  const [challengeHistory, setChallengeHistory] = useState([]);
  const [numberCorrect, setNumberCorrect] = useState(0);
  const [didWin, setDidWin] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [isGameFinished, setIsGameFinished] = useState(false);

  const API = 'https://opentdb.com/api.php';

  const newChallenge = async () => {
    setIsLoading(true);
    await fetch(`${API}?amount=1&type=boolean&difficulty=${difficulty}`)
      .then(data => data.json())
      .then(res => {
        // check if question has already been asked, if yes, get a new one
        if (challengeHistory.some(challenge => challenge.question === res.results[0].question)) {
          return newChallenge();
        }
        setChallenge(res.results[0]);
        const newHistory = [...challengeHistory, res.results[0]];
        if (newHistory.length >= numberQuestions + 1) return setIsGameFinished(true);
        setChallengeHistory(newHistory);
      });
    setIsLoading(false);
  }

  const handleAnswer = (answer) => {
    if (challenge.correct_answer === answer) {
      setNumberCorrect(numberCorrect + 1);
      setDidWin(true);
    } else {
      setDidWin(false);
    }
    newChallenge();
  }

  const handleReset = () => {
    setChallenge({});
    setChallengeHistory([]);
    setNumberCorrect(0);
    setDidWin(null);
    setIsLoading(false);
    setIsGameFinished(false);
  }

  let difficultyIcon;
  switch (difficulty) {
    case ('easy'):
      difficultyIcon = <FaThermometerEmpty />
      break;
    case ('medium'):
      difficultyIcon = <FaThermometerHalf />
      break;
    case ('hard'):
    default:
      difficultyIcon = <FaThermometerFull />
  }

  return (
    <div className="container">

      {/* header */}
      <h1 className="title">Hooks Trivia Game</h1>
      <div className="darkmode-toggle" onClick={() => darkMode ? setDarkMode(false) : setDarkMode(true)}>
        {darkMode
          ? '☀ light mode'
          : '☾ dark mode'
        }
      </div>

      <ProgressBar progress={(!isGameFinished || !Object.keys(challenge).length) ? (challengeHistory.length - 1) / numberQuestions : 1} darkMode={darkMode} />

      {!isGameFinished
        ? (
          <>
            {/* question or loading indicator*/}
            {(isLoading
              && <div className="loading"><div className="loading--spinner" /></div>)
              || (
                !!Object.keys(challenge).length
                && <div className="question-area">
                  <div className="question-text" dangerouslySetInnerHTML={{ __html: challenge.question }} />
                  <AnimatedButton cssClass="button button--true" clickHandler={() => handleAnswer('True')}><FaCheck /> True</AnimatedButton>
                  <AnimatedButton cssClass="button button--false" clickHandler={() => handleAnswer('False')}><FaTimes />False</AnimatedButton>
                </div>
              )}
            {/* Gameplay buttons */}
            {
              Object.keys(challenge).length
                ?
                <>
                  <div className="difficulty-display">{difficulty} Mode {difficultyIcon}</div>
                  <button className="reset-button" onClick={handleReset}><FaRedoAlt /></button>
                </>
                :
                <>
                  <h2>Select a difficulty:</h2>
                  <Dropdown className="difficulty-selector" options={['easy', 'medium', 'hard']} value="easy" onChange={e => setDifficulty(e.value)} />
                  <AnimatedButton cssClass="button button--start" clickHandler={newChallenge}><FaPlay /> Start</AnimatedButton>
                </>
            }

            {/* didWin indicator */}
            {didWin !== null && (didWin
              ? <div className="result result--correct">Last answer was correct! {' '}<span role="img" aria-label="congrats emoji">🙌</span></div>
              : <div className="result result--incorrect">Last answer was incorrect {' '}<span role="img" aria-label="thinking emoji">🤔</span></div>
            )}
          </>
        ) :
        <div className="game-finish">
          <h2>It's Over!</h2>
          <p>You got {numberCorrect} out of {numberQuestions} correct</p>
          <button className="reset-button" onClick={handleReset}><FaRedoAlt /> Try Again</button>
        </div>
      }
    </div>
  );
}
