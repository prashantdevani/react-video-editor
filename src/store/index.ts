/* eslint-disable @typescript-eslint/no-unused-vars */
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import editorReducer from './editorSlice';

// Load state from sessionStorage
const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem('editorState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Save state to sessionStorage
const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem('editorState', serializedState);
  } catch {
    // ignore write errors
  }
};

const rootReducer = combineReducers({
  editor: editorReducer,
});

const preloadedState = loadState();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
