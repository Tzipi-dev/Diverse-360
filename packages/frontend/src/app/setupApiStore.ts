import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import React, { type ReactNode } from 'react';
import type { Api } from '@reduxjs/toolkit/query/react';
import type { Provider } from 'react-redux';
interface SetupApiStoreResult {
  store: EnhancedStore;
  wrapper: React.FC<{ children: ReactNode }>;
}

export function setupApiStore(apiSlice: Api<any, any, any, any>): SetupApiStoreResult {
  const store = configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

  const wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
    //<Provider store={store}>{children}</Provider>
    null
  );

  return { store, wrapper };
}
