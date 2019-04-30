import useLocalStorage from './useLocalStorage';
import { useEffect } from 'react';

// https://usehooks.com/useDarkMode/
export default () => {
  // persist state through page refresh
  const [enabled, setEnabled] = useLocalStorage('dark-mode-enabled');

  useEffect(() => {
    const className = 'dark-mode';
    const element = window.document.body;
    if (enabled) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  },
    [enabled]
  );

  return [enabled, setEnabled];
}