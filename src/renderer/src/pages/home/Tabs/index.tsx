import { SettingOutlined } from '@ant-design/icons'
import AddAssistantPopup from '@renderer/components/Popups/AddAssistantPopup'
import { useAssistants, useDefaultAssistant } from '@renderer/hooks/useAssistant'
import { useSettings } from '@renderer/hooks/useSettings'
import { useShowTopics } from '@renderer/hooks/useStore'
import { EVENT_NAMES, EventEmitter } from '@renderer/services/EventService'
import { Assistant, Topic } from '@renderer/types'
import { uuid } from '@renderer/utils'
import { Segmented as AntSegmented } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Assistants from './AssistantsTab'
import Settings from './SettingsTab'

interface Props {
  activeAssistant: Assistant
  activeTopic: Topic
  setActiveAssistant: (assistant: Assistant) => void
  setActiveTopic: (topic: Topic) => void
  position: 'left' | 'right'
}

type Tab = 'assistants' | 'settings'

let _tab: any = ''

const HomeTabs: FC<Props> = ({ activeAssistant, activeTopic, setActiveAssistant, setActiveTopic, position }) => {
  const { addAssistant } = useAssistants()
  const [tab, setTab] = useState<Tab>(position === 'left' ? _tab || 'assistants' : 'settings')
  const { defaultAssistant } = useDefaultAssistant()
  const { toggleShowTopics } = useShowTopics()
  const { enableRightSidebar } = useSettings()

  const { t } = useTranslation()

  const borderStyle = '0.5px solid var(--color-border)'
  const border =
    position === 'left' ? { borderRight: borderStyle } : { borderLeft: borderStyle, borderTopLeftRadius: 0 }

  if (position === 'left') {
    _tab = tab
  }

  // 在开启侧边栏时：
  // - 左侧固定显示助手列表
  // - 右侧固定显示设置页面
  // 在关闭侧边栏时：
  // - 显示标签页切换组件
  const showTabGroup = !enableRightSidebar
  const forcedTab = position === 'right' ? 'settings' : enableRightSidebar ? 'assistants' : tab

  // 添加调试日志
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     console.log(
  //       JSON.stringify(
  //         {
  //           position,
  //           showAssistants,
  //           showTabGroup,
  //           forcedTab,
  //           tab,
  //           enableRightSidebar
  //         },
  //         null,
  //         2
  //       )
  //     )
  //   }, 1000)

  //   return () => clearInterval(timer)
  // }, [position, showAssistants, showTabGroup, forcedTab, tab, enableRightSidebar])

  const assistantTab = {
    label: t('assistants.abbr'),
    value: 'assistants',
    icon: <i className="iconfont icon-business-smart-assistant" />
  }

  const onCreateAssistant = async () => {
    const assistant = await AddAssistantPopup.show()
    assistant && setActiveAssistant(assistant)
  }

  const onCreateDefaultAssistant = () => {
    const assistant = { ...defaultAssistant, id: uuid() }
    addAssistant(assistant)
    setActiveAssistant(assistant)
  }

  useEffect(() => {
    const unsubscribes = [
      EventEmitter.on(EVENT_NAMES.SHOW_ASSISTANTS, (): any => {
        !enableRightSidebar && setTab('assistants')
      }),
      EventEmitter.on(EVENT_NAMES.SHOW_CHAT_SETTINGS, (): any => {
        !enableRightSidebar && setTab('settings')
      })
    ]
    return () => unsubscribes.forEach((unsub) => unsub())
  }, [position, enableRightSidebar, tab, toggleShowTopics])

  return (
    <Container style={border} className="home-tabs">
      {position === 'left' && showTabGroup && (
        <Segmented
          value={tab}
          style={{
            borderRadius: 0,
            padding: '10px 0',
            margin: '0 10px',
            paddingBottom: 10,
            borderBottom: '0.5px solid var(--color-border)',
            gap: 2
          }}
          options={[
            assistantTab,
            {
              label: t('settings.title'),
              value: 'settings',
              icon: <SettingOutlined />
            }
          ]}
          onChange={(value) => setTab(value as 'assistants' | 'settings')}
          block
        />
      )}
      <TabContent className="home-tabs-content">
        <TabPane style={{ display: forcedTab === 'assistants' ? 'flex' : 'none' }}>
          <Assistants
            activeAssistant={activeAssistant}
            activeTopic={activeTopic}
            setActiveAssistant={setActiveAssistant}
            onCreateAssistant={onCreateAssistant}
            onCreateDefaultAssistant={onCreateDefaultAssistant}
            setActiveTopic={setActiveTopic}
          />
        </TabPane>
        <TabPane style={{ display: forcedTab === 'settings' ? 'flex' : 'none' }}>
          <Settings assistant={activeAssistant} />
        </TabPane>
      </TabContent>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: var(--assistants-width);
  min-width: var(--assistants-width);
  height: calc(100vh - var(--navbar-height));
  background-color: var(--color-background);
  overflow: hidden;
  .collapsed {
    width: 0;
    border-left: none;
  }
`

const TabContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`

const TabPane = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const Segmented = styled(AntSegmented)`
  .ant-segmented-item {
    overflow: hidden;
    transition: none !important;
    height: 34px;
    line-height: 34px;
    background-color: transparent;
    user-select: none;
  }
  .ant-segmented-item-selected {
    background-color: var(--color-background-soft);
    border: 0.5px solid var(--color-border);
    transition: none !important;
  }
  .ant-segmented-item-label {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    font-size: 13px;
    height: 100%;
  }
  .iconfont {
    font-size: 13px;
    margin-left: -2px;
  }
  .anticon-setting {
    font-size: 12px;
  }
  .icon-business-smart-assistant {
    margin-right: -2px;
  }
  .ant-segmented-item-icon + * {
    margin-left: 4px;
  }
  .ant-segmented-thumb {
    transition: none !important;
    background-color: var(--color-background-soft);
    border: 0.5px solid var(--color-border);
  }
`

export default HomeTabs
