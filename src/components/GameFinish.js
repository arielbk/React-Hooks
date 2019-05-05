import React from 'react';

export default ({ numberCorrect, numberQuestions }) => {
  let remark;
  if (numberCorrect < numberQuestions / 2) {
    remark = <h2>'Abysmal!'</h2>;
  } else if (numberCorrect < numberQuestions / 2 + numberQuestions / 3) {
    remark = <h2>'Could be better...'</h2>;
  } else if (numberCorrect < numberQuestions - numberQuestions / 10) {
    remark = <h2>'Pretty good!'</h2>;
  } else if (numberCorrect < numberQuestions - 1) {
    remark = <h2>'Very good!'</h2>;
  } else if (numberCorrect === numberQuestions) {
    remark = <h2>'Perfect!'</h2>;
  } else {
    remark = <h2>'It\'s over!'</h2>;
  }
  return (
    <>
      {remark}
      <p>You got {numberCorrect} out of {numberQuestions} correct</p>
    </>
  )
}

