import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import agents from './agents'
import assistants from './assistants'
import knowledge from './knowledge'
import llm from './llm'
import migrate from './migrate'
import minapps from './minapps'
import paintings from './paintings'
import runtime from './runtime'
import settings from './settings'
import shortcuts from './shortcuts'
import tabs from './tabs'
import type { TabsState } from './tabs'

export interface RootState {
  assistants: any
  agents: any
  paintings: any
  llm: any
  settings: any
  runtime: any
  shortcuts: any
  knowledge: any
  minapps: any
  tabs: TabsState
}

const rootReducer = combineReducers({
  assistants,
  agents,
  paintings,
  llm,
  settings,
  runtime,
  shortcuts,
  knowledge,
  minapps,
  tabs
})

const persistedReducer = persistReducer(
  {
    key: 'cherry-studio',
    storage,
    version: 61,
    blacklist: ['runtime'],
    migrate
  },
  rootReducer
)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
  },
  devTools: true
})

export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store)
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<typeof store>()

window.store = store

export default store
