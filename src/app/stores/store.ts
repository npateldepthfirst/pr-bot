import { configureStore } from '@reduxjs/toolkit';
import githubInfoReducer from './githubInfoStore';

export const store = configureStore({
  reducer: {
    githubInfo: githubInfoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
