import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DEFAULT_MIN_APPS } from '@renderer/config/minapps'
import { MinAppType, SidebarIcon } from '@renderer/types'

export const DEFAULT_SIDEBAR_ICONS: SidebarIcon[] = [
  'assistants',
  'agents',
  'paintings',
  'translate',
  'minapp',
  'knowledge',
  'files'
]

export interface MinAppsState {
  enabled: MinAppType[]
  disabled: MinAppType[]
  pinned: MinAppType[]
}

const initialState: MinAppsState = {
  enabled: DEFAULT_MIN_APPS,
  disabled: [],
  pinned: []
}

const minAppsSlice = createSlice({
  name: 'minApps',
  initialState,
  reducers: {
    setMinApps: (state, action: PayloadAction<MinAppType[]>) => {
      state.enabled = action.payload.map((app) => {
        if (app.id?.toString().startsWith('custom_')) {
          return app
        }
        const defaultApp = DEFAULT_MIN_APPS.find((item) => item.id === app.id)
        return defaultApp || app
      })
    },
    addMinApp: (state, action: PayloadAction<MinAppType>) => {
      state.enabled.push(action.payload)
    },
    setDisabledMinApps: (state, action: PayloadAction<MinAppType[]>) => {
      state.disabled = action.payload.map((app) => {
        if (app.id?.toString().startsWith('custom_')) {
          return app
        }
        const defaultApp = DEFAULT_MIN_APPS.find((item) => item.id === app.id)
        return defaultApp || app
      })
    },
    setPinnedMinApps: (state, action: PayloadAction<MinAppType[]>) => {
      state.pinned = action.payload.map((app) => {
        if (app.id?.toString().startsWith('custom_')) {
          return app
        }
        const defaultApp = DEFAULT_MIN_APPS.find((item) => item.id === app.id)
        return defaultApp || app
      })
    }
  }
})

export const { setMinApps, addMinApp, setDisabledMinApps, setPinnedMinApps } = minAppsSlice.actions

export default minAppsSlice.reducer
