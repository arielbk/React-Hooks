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
  const [inProgress, setInProgress] = useState(false);

  const API = 'https://opentdb.com/api.php';

  const newChallenge = async () => {
    setIsLoading(true);
    await fetch(`${API}?amount=1&type=boolean&difficulty=${difficulty}`)
      .then(data => data.json())
      .then(res => {
        const newHistory = [...challengeHistory, res.results[0]];
        if (newHistory.length >= numberQuestions + 1) return setInProgress(false);
        // check if question has already been asked, if yes, get a new one
        if (challengeHistory.some(challenge => challenge.question === res.results[0].question)) {
          return newChallenge();
        }
        setChallenge(res.results[0]);
        setChallengeHistory(newHistory);
        setInProgress(true);
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
    setInProgress(false);
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

  let finishRemark;
  if (numberCorrect < numberQuestions / 2) {
    finishRemark = 'Abysmal!';
  } else if (numberCorrect < numberQuestions / 2 + numberQuestions / 3) {
    finishRemark = 'Could be better...';
  } else if (numberCorrect < numberQuestions - numberQuestions / 10) {
    finishRemark = 'Pretty good!';
  } else if (numberCorrect < numberQuestions - 1) {
    finishRemark = 'Very good!';
  } else if (numberCorrect === numberQuestions) {
    finishRemark = 'Perfect!';
  } else {
    finishRemark = 'It\'s over!';
  }

  return (
    <div className="container">

      {/* header */}
      <h1 className={`title ${inProgress && 'in-progress'}`}>Hooks Trivia Game</h1>
      <div className="darkmode-toggle" onClick={() => darkMode ? setDarkMode(false) : setDarkMode(true)}>
        {darkMode
          ? '☀ Light Theme'
          : '☾ Dark Theme'
        }
      </div>

      <ProgressBar progress={(!inProgress || !Object.keys(challenge).length) ? 1 : (challengeHistory.length - 1) / numberQuestions} darkMode={darkMode} />

      {(inProgress && (Object.keys(challengeHistory).length < (numberQuestions + 1)))
        || (!inProgress && Object.keys(challengeHistory).length === 0)
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
          <h2>{finishRemark}</h2>
          <p>You got {numberCorrect} out of {numberQuestions} correct</p>
          <button className="reset-button" onClick={handleReset}><FaRedoAlt /></button>
        </div>
      }
    </div>
  );
}
