export const initialState = {
  challenge: {},
  challengeHistory: [],
  numberCorrect: 0,
  didWin: null,
  inProgress: false,
}

export default function reducer(state, action) {
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