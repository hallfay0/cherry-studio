import { MinAppType } from '@renderer/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface TabsState {
  tabs: MinAppType[]
  activeTab: string
}

const initialState: TabsState = {
  tabs: [],
  activeTab: ''
}

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<MinAppType>) => {
      const existingTab = state.tabs.find((tab) => tab.id === action.payload.id)
      if (!existingTab) {
        state.tabs.push(action.payload)
      }
      state.activeTab = action.payload.id!.toString()
    },
    removeTab: (state, action: PayloadAction<string>) => {
      state.tabs = state.tabs.filter((tab) => tab.id !== action.payload)
      if (state.activeTab === action.payload) {
        state.activeTab = state.tabs[state.tabs.length - 1]?.id?.toString() || ''
      }
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload
    }
  }
})

export const { addTab, removeTab, setActiveTab } = tabsSlice.actions
export default tabsSlice.reducer
