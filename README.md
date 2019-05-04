# React Hooks Playground

It's about time I learnt about React hooks.

- [React Hooks Playground](#react-hooks-playground)
- [Resources](#resources)
- [Built-in hooks](#built-in-hooks)
  - [State Hook](#state-hook)
  - [Effect Hook](#effect-hook)
    - [Passing a second argument to the `useEffect` hook](#passing-a-second-argument-to-the-useeffect-hook)
- [Rules for hooks](#rules-for-hooks)
- [Creating your own hook](#creating-your-own-hook)
- [Other hooks](#other-hooks)
- [Hooks examples](#hooks-examples)
- [Hooks Practice](#hooks-practice)

# Resources

[React Hooks Docs](https://reactjs.org/docs/hooks-intro.html)

Watch the [React Conf video on React Hooks with Sophie Alpert and Dan Abramov](https://www.youtube.com/watch?time_continue=131&v=dpw9EHDh2bM).

# Built-in hooks
## State Hook
```js
// Declare a new state variable, which we'll call "count"
const [count, setCount] = useState(0);
```
So this seems to be the starting point of hooks. This is the *state hook*. This expression would be found inside a function that represents a component.

`count`, and `setCount` are the getter and setter of the state of this component, initialised by `useState` which is passed an argument of `0` to define the *initial state*.

You can set as many of these as you'd like.

## Effect Hook
Effects is short for side-effects. These are the things that you would have normally put into `componentDidMount`, `componentDidUpdate` and `componentWillUnmount`.

```js
useEffect(() => {
  // This will happen on mount
  document.title = `You clicked ${count} times`;
  document.addEventListener('click', () => console.log('click!'));

  // A returned function will happen on unmount (cleanup)
  return () => document.removeEventListener('click', () => console.log('click'));
});
```
So by default the effect will run after every render (including the first render).

To clean up after an effect, you can return a callback function from within the effect that will run before every rerender or unmounting.

### Passing a second argument to the `useEffect` hook
Pass an array to `useEffect` as a second argument to define what should be checked on every update before running the effect again (i.e. cleaning up and starting over).

# Rules for hooks
There are two basic rules, essential to hooks running properly:
1. Hooks should only be called at the top level (not inside loops or anything)
2. Only call hooks from within a React function component

# Creating your own hook

Creating your own hook really just means extracting the logic into it's own function and then calling that function when you want it.

It's important to note that it is just the *logic* that you are reusing, and not state itself.

# Other hooks

There are some other useful built-in hooks, too. Some of them are `useContext` to access context without wrapping your component, and `useReducer` to 'manage local state of complex components with a reducer'.

# Hooks examples

[Use Hooks](https://usehooks.com) has some great examples of hooks uses.

# Hooks Practice

I think the best way to learn about something new is to get a general idea about it, then dive in and start tinkering and learning the nuances along the way.

I'll continue to add notes above as I go.

To practice hooks, I'll be fetching data from the [Open Trivia Database API](https://opentdb.com/) and creating a true/false quiz game.