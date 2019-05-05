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

// get one challenge at a time (this is mostly for hooks practice)
const API = 'https://opentdb.com/api.php?amount=1&type=boolean';
const NUMBER_QUESTIONS = 20;

export default function App() {
  const [darkMode, setDarkMode] = useDarkMode();
  const [isLoading, setIsLoading] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // don't load a question on app load
    if (!state.inProgress) return;

    // check if the game should end
    if (state.challengeHistory.length === NUMBER_QUESTIONS) return dispatch({ type: 'END_GAME' });

    // checks if the effect is the latest (use case: if the user double clicks a button)
    let current = true;

    const newChallenge = async () => {
      setIsLoading(true);
      const challenge = await fetch(`${API}&difficulty=${difficulty}`)
        .then(data => data.json())
        .then(res => {
          // check if question has already been asked, if yes, get a new one
          if (state.challengeHistory.some(challenge => challenge.question === res.results[0].question)) {
            return newChallenge();
          }
          return res.results[0];
        });
      setIsLoading(false);
      return challenge;
    }
    if (current) newChallenge().then(challenge => dispatch({ type: 'SET_CHALLENGE', payload: challenge }));

    // clean up function
    return () => {
      current = false;
    }

    // dependency array
  }, [state.challengeHistory, state.inProgress])

  const handleAnswer = (answer) => {
    if (state.challenge.correct_answer === answer) {
      dispatch({ type: 'CORRECT_ANSWER' });
    } else {
      dispatch({ type: 'WRONG_ANSWER' });
    }
  }

  console.log(state.challengeHistory);

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

      <ProgressBar progress={!state.inProgress ? 1 : (state.challengeHistory.length) / NUMBER_QUESTIONS} darkMode={darkMode} />


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
