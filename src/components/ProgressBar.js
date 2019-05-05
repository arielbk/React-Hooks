import React from 'react';

export default ({ progress, darkMode }) => {
  return (
    <div style={{
      position: 'fixed',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      top: 0,
      left: 0,
      width: '100vw',
      height: '6px',
      zIndex: 99,
    }}>
      <div style={{
        height: '100%',
        width: `${progress * 100}%`,
        background: darkMode ? '#48f' : '#cc4',
        transition: 'width 1s',
      }} />
    </div>
  )
}