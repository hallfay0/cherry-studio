import '@renderer/databases'

import store, { persistor } from '@renderer/store'
import { useEffect } from 'react'
import { FC } from 'react'
import { Provider } from 'react-redux'
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'

import Sidebar from './components/app/Sidebar'
import KeepAlive from './components/KeepAlive'
import TopViewContainer from './components/TopView'
import WebviewContainer from './components/WebviewContainer'
import AntdProvider from './context/AntdProvider'
import { SyntaxHighlighterProvider } from './context/SyntaxHighlighterProvider'
import { ThemeProvider } from './context/ThemeProvider'
import AgentsPage from './pages/agents/AgentsPage'
import AppsPage from './pages/apps/AppsPage'
import FilesPage from './pages/files/FilesPage'
import HomePage from './pages/home/HomePage'
import KnowledgePage from './pages/knowledge/KnowledgePage'
import PaintingsPage from './pages/paintings/PaintingsPage'
import SettingsPage from './pages/settings/SettingsPage'
import TabsPage from './pages/tabs/TabsPage'
import TranslatePage from './pages/translate/TranslatePage'
import NavigationService from './services/NavigationService'

const AppRoutes: FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    NavigationService.setNavigate(navigate)
  }, [navigate])

  return (
    <>
      <Sidebar />
      <Routes>
        <Route
          path="/"
          element={
            <KeepAlive>
              <HomePage />
            </KeepAlive>
          }
        />
        <Route
          path="/agents"
          element={
            <KeepAlive>
              <AgentsPage />
            </KeepAlive>
          }
        />
        <Route path="/paintings" element={<PaintingsPage />} />
        <Route path="/translate" element={<TranslatePage />} />
        <Route
          path="/files"
          element={
            <KeepAlive>
              <FilesPage />
            </KeepAlive>
          }
        />
        <Route path="/knowledge" element={<KnowledgePage />} />
        <Route path="/apps" element={<AppsPage />} />
        <Route path="/settings/*" element={<SettingsPage />} />
        <Route path="/tabs" element={<TabsPage />} />
      </Routes>
      <WebviewContainer />
    </>
  )
}

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AntdProvider>
          <SyntaxHighlighterProvider>
            <PersistGate loading={null} persistor={persistor}>
              <TopViewContainer>
                <HashRouter>
                  <AppRoutes />
                </HashRouter>
              </TopViewContainer>
            </PersistGate>
          </SyntaxHighlighterProvider>
        </AntdProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App
