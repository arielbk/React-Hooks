import React, { useState, useReducer, useEffect } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { FaPlay, FaRedoAlt, FaCheck, FaTimes } from 'react-icons/fa';

import reducer, { initialState } from './reducer';

import DifficultyDisplay from './components/DifficultyDisplay';
import GameFinish from './components/GameFinish';
import Result from './components/Result';
import ProgressBar from './components/ProgressBar';

import { useDarkMode, AnimatedButton } from './hooks';

const API = 'https://opentdb.com/api.php';
const NUMBER_QUESTIONS = 20;

export default function App() {
  const [darkMode, setDarkMode] = useDarkMode();
  const [isLoading, setIsLoading] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const newChallenge = async () => {
      setIsLoading(true);
      const challenge = await fetch(`${API}?amount=1&type=boolean&difficulty=${difficulty}`)
        .then(data => data.json())
        .then(res => {
          if (state.challengeHistory.length === NUMBER_QUESTIONS - 1) return dispatch({ type: 'END_GAME' });
          // check if question has already been asked, if yes, get a new one
          if (state.challengeHistory.some(challenge => challenge.question === res.results[0].question)) {
            return newChallenge();
          }
          return res.results[0];
        });
      setIsLoading(false);
      return challenge;
    }
    newChallenge().then(challenge => dispatch({ type: 'SET_CHALLENGE', payload: challenge }));
  }, [state.challengeHistory])

  const handleAnswer = async (answer) => {
    if (state.challenge.correct_answer === answer) {
      dispatch({ type: 'CORRECT_ANSWER' });
    } else {
      dispatch({ type: 'WRONG_ANSWER' });
    }
  }

  return (
    <div className="container">

      {/* header */}
      <h1 className={`title ${state.inProgress && 'in-progress'}`}>Hooks Trivia Game</h1>
      <div className="darkmode-toggle" onClick={() => darkMode ? setDarkMode(false) : setDarkMode(true)}>
        {darkMode
          ? '☀ Light Theme'
          : '☾ Dark Theme'
        }
      </div>

      <ProgressBar progress={(!state.inProgress || !Object.keys(state.challenge).length) ? 1 : (state.challengeHistory.length - 1) / NUMBER_QUESTIONS} darkMode={darkMode} />


      {(state.inProgress && (Object.keys(state.challengeHistory).length < (NUMBER_QUESTIONS + 1)))
        || (!state.inProgress && Object.keys(state.challengeHistory).length === 0)
        ? (
          <>
            {/* question or loading indicator*/}
            {(isLoading && <div className="loading"><div className="loading--spinner" /></div>)
              || (state.inProgress
                && <div className="question-area">
                  <div className="question-text" dangerouslySetInnerHTML={{ __html: state.challenge.question }} />
                  <AnimatedButton cssClass="button button--true" clickHandler={() => handleAnswer('True')}><FaCheck /> True</AnimatedButton>
                  <AnimatedButton cssClass="button button--false" clickHandler={() => handleAnswer('False')}><FaTimes />False</AnimatedButton>
                </div>
              )}
            {/* Gameplay buttons */}
            {
              state.inProgress
                ? <>
                  <DifficultyDisplay difficulty={difficulty} />
                  <button className="reset-button" onClick={() => dispatch({ type: 'RESET' })}><FaRedoAlt /></button>
                </>
                : <>
                  <h2>Select a difficulty:</h2>
                  <Dropdown className="difficulty-selector" options={['easy', 'medium', 'hard']} value="easy" onChange={e => setDifficulty(e.value)} />
                  <AnimatedButton cssClass="button button--start" clickHandler={() => dispatch({ type: 'START_GAME' })}><FaPlay /> Start</AnimatedButton>
                </>
            }
            {/* didWin indicator */}
            {state.didWin !== null && <Result didWin={state.didWin} />}
          </>
        ) : <>
          <GameFinish numberCorrect={state.numberCorrect} numberQuestions={NUMBER_QUESTIONS} />
          <button className="reset-button" onClick={() => dispatch({ type: 'RESET' })}><FaRedoAlt /></button>
        </>
      }
    </div>
  );
}
