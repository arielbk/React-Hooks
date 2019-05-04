import React, { useState, useReducer } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { FaPlay, FaRedoAlt, FaCheck, FaTimes, FaThermometerEmpty, FaThermometerHalf, FaThermometerFull } from 'react-icons/fa';

import { useDarkMode, AnimatedButton } from './hooks';
import ProgressBar from './ProgressBar';

const API = 'https://opentdb.com/api.php';
const NUMBER_QUESTIONS = 20;

const initialState = {
  challenge: {},
  challengeHistory: [],
  numberCorrect: 0,
  didWin: null,
  inProgress: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_GAME': return {
      ...state,
      challenge: action.payload,
      inProgress: true,
    };
    case 'CORRECT_ANSWER': return {
      ...state,
      challenge: action.payload,
      challengeHistory: [...state.challengeHistory, state.challenge],
      numberCorrect: state.numberCorrect + 1,
      didWin: true,
    }
    case 'WRONG_ANSWER': return {
      ...state,
      challenge: action.payload,
      challengeHistory: [...state.challengeHistory, state.challenge],
      didWin: false,
    }
    case 'END_GAME': return {
      ...state,
      challenge: null,
      challengeHistory: [...state.challengeHistory, state.challenge],
      inProgress: false
    }
    case 'RESET': return {
      ...state,
      ...initialState,
    }
    default: throw new Error();
  }
};

export default function App() {
  const [darkMode, setDarkMode] = useDarkMode();
  const [isLoading, setIsLoading] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [state, dispatch] = useReducer(reducer, initialState);

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

  const handleAnswer = async (answer) => {
    if (state.challenge.correct_answer === answer) {
      dispatch({ type: 'CORRECT_ANSWER', payload: await newChallenge() });
    } else {
      dispatch({ type: 'WRONG_ANSWER', payload: await newChallenge() });
    }
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
  if (state.numberCorrect < NUMBER_QUESTIONS / 2) {
    finishRemark = 'Abysmal!';
  } else if (state.numberCorrect < NUMBER_QUESTIONS / 2 + NUMBER_QUESTIONS / 3) {
    finishRemark = 'Could be better...';
  } else if (state.numberCorrect < NUMBER_QUESTIONS - NUMBER_QUESTIONS / 10) {
    finishRemark = 'Pretty good!';
  } else if (state.numberCorrect < NUMBER_QUESTIONS - 1) {
    finishRemark = 'Very good!';
  } else if (state.numberCorrect === NUMBER_QUESTIONS) {
    finishRemark = 'Perfect!';
  } else {
    finishRemark = 'It\'s over!';
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
              || (!!Object.keys(state.challenge).length
                && <div className="question-area">
                  <div className="question-text" dangerouslySetInnerHTML={{ __html: state.challenge.question }} />
                  <AnimatedButton cssClass="button button--true" clickHandler={() => handleAnswer('True')}><FaCheck /> True</AnimatedButton>
                  <AnimatedButton cssClass="button button--false" clickHandler={() => handleAnswer('False')}><FaTimes />False</AnimatedButton>
                </div>
              )}
            {/* Gameplay buttons */}
            {
              Object.keys(state.challenge).length
                ?
                <>
                  <div className="difficulty-display">{difficulty} Mode {difficultyIcon}</div>
                  <button className="reset-button" onClick={() => dispatch({ type: 'RESET' })}><FaRedoAlt /></button>
                </>
                :
                <>
                  <h2>Select a difficulty:</h2>
                  <Dropdown className="difficulty-selector" options={['easy', 'medium', 'hard']} value="easy" onChange={e => setDifficulty(e.value)} />
                  <AnimatedButton cssClass="button button--start" clickHandler={async () => dispatch({ type: 'START_GAME', payload: await newChallenge() })}><FaPlay /> Start</AnimatedButton>
                </>
            }
            {/* didWin indicator */}
            {state.didWin !== null && (state.didWin
              ? <div className="result result--correct">Last answer was correct! {' '}<span role="img" aria-label="congrats emoji">🙌</span></div>
              : <div className="result result--incorrect">Last answer was incorrect {' '}<span role="img" aria-label="thinking emoji">🤔</span></div>
            )}
          </>
        ) :
        <div className="game-finish">
          <h2>{finishRemark}</h2>
          <p>You got {state.numberCorrect} out of {NUMBER_QUESTIONS} correct</p>
          <button className="reset-button" onClick={() => dispatch({ type: 'RESET' })}><FaRedoAlt /></button>
        </div>
      }
    </div>
  );
}
