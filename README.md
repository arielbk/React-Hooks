# React Hooks Playground

It's about time I learnt about React hooks.

[React Hooks Docs](https://reactjs.org/docs/hooks-intro.html)

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
Effects is short for side-effects. These are the things that you would have normally put into `componentDidMount`, `componentWillUpdate` and `componentWillUpdate`.

```js
useEffect(() => {
  // Update the document title using the browser API
  document.title = `You clicked ${count} times`;
});
```
So by default the effect will run after every render (including the first render).

To clean up after an effect, you can return a callback function from within the effect that will run before every rerender or unmounting.

# Rules for hooks
There are two basic rules, essential to hooks running properly:
1. Hooks should only be called at the top level (not inside loops or anything)
2. Only call hooks from within a React function component

# Creating your own hook

Creating your own hook really just means extracting the logic into it's own function and then calling that function when you want it.

It's important to note that it is just the *logic* that you are reusing, and not state itself.

# Other hooks

There are some other useful built-in hooks, too. Some of them are `useContext` to access context without wrapping your component, and `useReducer` to 'manage local state of complex components with a reducer'.

# Hooks Practice

I think the best way to learn about something new is to get an idea of it, then dive in and start tinkering and learning the nuances along the way.

I'll continue to add notes above as I go.

To practice hooks, I'll be fetching data from the [Open Trivia Database API](https://opentdb.com/) and creating a true/false quiz game.