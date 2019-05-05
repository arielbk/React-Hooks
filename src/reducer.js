export const initialState = {
  challenge: {},
  challengeHistory: [],
  numberCorrect: 0,
  didWin: null,
  inProgress: false,
}

export default function reducer(state, action) {
  switch (action.type) {
    case 'SET_CHALLENGE': return {
      ...state,
      challenge: action.payload,
    }
    case 'START_GAME': return {
      ...state,
      inProgress: true,
    };
    case 'CORRECT_ANSWER': return {
      ...state,
      challengeHistory: [...state.challengeHistory, state.challenge],
      numberCorrect: state.numberCorrect + 1,
      didWin: true,
    }
    case 'WRONG_ANSWER': return {
      ...state,
      challengeHistory: [...state.challengeHistory, state.challenge],
      didWin: false,
    }
    case 'END_GAME': return {
      ...state,
      inProgress: false
    }
    case 'RESET': return {
      ...state,
      ...initialState,
    }
    default: throw new Error();
  }
};