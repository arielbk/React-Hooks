import React from 'react';
import { FaThermometerEmpty, FaThermometerHalf, FaThermometerFull } from 'react-icons/fa';

export default ({ difficulty }) => {
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
      return <FaThermometerFull />
  }

  return (
    <div className="difficulty-display">{difficulty} Mode {difficultyIcon}</div>
  )
}