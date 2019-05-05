import { useState } from 'react';

// https://usehooks.com/useLocalStorage/
export default (key, initialValue) => {
  // checks if there is already localStorage, otherwise defaults to initialValue
  const [storedValue, setStoredValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  // wrapped version of useState's setter function
  const setValue = value => {
    // allow value to be a function so we have the same api as useState's setter
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    // save state
    setStoredValue(valueToStore);
    // save to localStorage
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  }

  return [storedValue, setValue];
}