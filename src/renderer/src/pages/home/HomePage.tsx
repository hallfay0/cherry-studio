import AddAssistantPopup from '@renderer/components/Popups/AddAssistantPopup'
import { useAssistants } from '@renderer/hooks/useAssistant'
import { useSettings } from '@renderer/hooks/useSettings'
import { useActiveTopic } from '@renderer/hooks/useTopic'
import NavigationService from '@renderer/services/NavigationService'
import { Assistant } from '@renderer/types'
import { FC, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import Chat from './Chat'
import Navbar from './Navbar'
import HomeTabs from './Tabs'

// 使用全局变量来保存状态
let _activeAssistant: Assistant | null = null
let _activeTopic: any = null

const HomePage: FC = () => {
  const { assistants } = useAssistants()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state
  const { assistant, topic } = location?.state || {}

  // 使用 ref 来跟踪组件是否已经初始化
  const isInitialized = useRef(false)

  const [activeAssistant, setActiveAssistant] = useState<Assistant>(() => {
    return _activeAssistant || assistant || assistants[0]
  })

  const { activeTopic, setActiveTopic } = useActiveTopic(activeAssistant, _activeTopic || topic)
  const { showAssistants, showRightSidebar } = useSettings()

  // 保存状态到全局变量
  useEffect(() => {
    _activeAssistant = activeAssistant
  }, [activeAssistant])

  useEffect(() => {
    _activeTopic = activeTopic
  }, [activeTopic])

  useEffect(() => {
    NavigationService.setNavigate(navigate)
  }, [navigate])

  useEffect(() => {
    // 只在组件第一次挂载时处理 state
    if (!isInitialized.current && state) {
      state?.assistant && setActiveAssistant(state?.assistant)
      state?.topic && setActiveTopic(state?.topic)
      isInitialized.current = true
    }
  }, [state])

  useEffect(() => {
    const canMinimize = !showAssistants && !showRightSidebar
    window.api.window.setMinimumSize(canMinimize ? 520 : 1080, 600)

    return () => {
      window.api.window.resetMinimumSize()
    }
  }, [showAssistants, showRightSidebar])

  const onCreateAssistant = async () => {
    const assistant = await AddAssistantPopup.show()
    if (assistant) {
      setActiveAssistant(assistant)
    }
  }

  return (
    <Container id="home-page">
      <Navbar activeAssistant={activeAssistant} onCreateAssistant={onCreateAssistant} />
      <ContentContainer id="content-container">
        {showAssistants && (
          <HomeTabs
            activeAssistant={activeAssistant}
            activeTopic={activeTopic}
            setActiveAssistant={setActiveAssistant}
            setActiveTopic={setActiveTopic}
            position="left"
          />
        )}
        <Chat
          assistant={activeAssistant}
          activeTopic={activeTopic}
          setActiveTopic={setActiveTopic}
          setActiveAssistant={setActiveAssistant}
        />
      </ContentContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  max-width: calc(100vw - var(--sidebar-width));
`

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  overflow: hidden;
`

export default HomePage
