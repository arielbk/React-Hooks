import React from 'react';

export default ({ didWin }) => (
  didWin
    ? <div className="result result--correct">Last answer was correct! {' '}<span role="img" aria-label="congrats emoji">🙌</span></div>
    : <div className="result result--incorrect">Last answer was incorrect {' '}<span role="img" aria-label="thinking emoji">🤔</span></div>
);
