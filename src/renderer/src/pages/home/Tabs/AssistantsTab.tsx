import {
  DeleteOutlined,
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  CaretRightOutlined
} from '@ant-design/icons'
import DragableList from '@renderer/components/DragableList'
import CopyIcon from '@renderer/components/Icons/CopyIcon'
import Scrollbar from '@renderer/components/Scrollbar'
import { useAgents } from '@renderer/hooks/useAgents'
import { useAssistant, useAssistants } from '@renderer/hooks/useAssistant'
import { modelGenerating } from '@renderer/hooks/useRuntime'
import { useSettings } from '@renderer/hooks/useSettings'
import AssistantSettingsPopup from '@renderer/pages/settings/AssistantSettings'
import { getDefaultTopic } from '@renderer/services/AssistantService'
import { EVENT_NAMES, EventEmitter } from '@renderer/services/EventService'
import { Assistant, Topic } from '@renderer/types'
import { uuid } from '@renderer/utils'
import { Dropdown } from 'antd'
import { ItemType } from 'antd/es/menu/interface'
import { last, omit } from 'lodash'
import { FC, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Topics from './TopicsTab'

interface Props {
  activeAssistant: Assistant
  activeTopic: Topic
  setActiveAssistant: (assistant: Assistant) => void
  onCreateDefaultAssistant: () => void
  onCreateAssistant: () => void
  setActiveTopic: (topic: Topic) => void
}

const Assistants: FC<Props> = ({
  activeAssistant,
  activeTopic,
  setActiveAssistant,
  onCreateAssistant,
  onCreateDefaultAssistant,
  setActiveTopic
}) => {
  const { assistants, removeAssistant, addAssistant, updateAssistants } = useAssistants()
  const [dragging, setDragging] = useState(false)
  const [expandedAssistants, setExpandedAssistants] = useState<{ [key: string]: boolean }>({})
  const { removeAllTopics } = useAssistant(activeAssistant.id)
  const { clickAssistantToShowTopic, topicPosition } = useSettings()
  const { t } = useTranslation()
  const { addAgent } = useAgents()

  const onDelete = useCallback(
    (assistant: Assistant) => {
      const _assistant: Assistant | undefined = last(assistants.filter((a) => a.id !== assistant.id))
      _assistant ? setActiveAssistant(_assistant) : onCreateDefaultAssistant()
      removeAssistant(assistant.id)
    },
    [assistants, onCreateDefaultAssistant, removeAssistant, setActiveAssistant]
  )

  const getMenuItems = useCallback(
    (assistant: Assistant) =>
      [
        {
          label: t('assistants.edit.title'),
          key: 'edit',
          icon: <EditOutlined />,
          onClick: () => AssistantSettingsPopup.show({ assistant })
        },
        {
          label: t('assistants.copy.title'),
          key: 'duplicate',
          icon: <CopyIcon />,
          onClick: async () => {
            const _assistant: Assistant = { ...assistant, id: uuid(), topics: [getDefaultTopic(assistant.id)] }
            addAssistant(_assistant)
            setActiveAssistant(_assistant)
          }
        },
        {
          label: t('assistants.clear.title'),
          key: 'clear',
          icon: <MinusCircleOutlined />,
          onClick: () => {
            window.modal.confirm({
              title: t('assistants.clear.title'),
              content: t('assistants.clear.content'),
              centered: true,
              okButtonProps: { danger: true },
              onOk: removeAllTopics
            })
          }
        },
        {
          label: t('assistants.save.title'),
          key: 'save-to-agent',
          icon: <SaveOutlined />,
          onClick: async () => {
            const agent = omit(assistant, ['model', 'emoji'])
            agent.id = uuid()
            agent.type = 'agent'
            addAgent(agent)
            window.message.success({
              content: t('assistants.save.success'),
              key: 'save-to-agent'
            })
          }
        },
        { type: 'divider' },
        {
          label: t('common.delete'),
          key: 'delete',
          icon: <DeleteOutlined />,
          danger: true,
          onClick: () => {
            window.modal.confirm({
              title: t('assistants.delete.title'),
              content: t('assistants.delete.content'),
              centered: true,
              okButtonProps: { danger: true },
              onOk: () => onDelete(assistant)
            })
          }
        }
      ] as ItemType[],
    [addAgent, addAssistant, onDelete, removeAllTopics, setActiveAssistant, t]
  )

  const onSwitchAssistant = useCallback(
    async (assistant: Assistant) => {
      await modelGenerating()

      if (topicPosition === 'left' && clickAssistantToShowTopic) {
        EventEmitter.emit(EVENT_NAMES.SWITCH_TOPIC_SIDEBAR)
      }

      setActiveAssistant(assistant)
      // 默认选中第一个话题
      setActiveTopic(assistant.topics[0])
    },
    [clickAssistantToShowTopic, setActiveAssistant, topicPosition]
  )

  const toggleAssistantExpand = (assistantId: string) => {
    setExpandedAssistants((prev) => ({
      ...prev,
      [assistantId]: !prev[assistantId]
    }))
  }

  return (
    <Container className="assistants-tab">
      <DragableList
        list={assistants}
        onUpdate={updateAssistants}
        style={{ paddingBottom: dragging ? '34px' : 0 }}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => setDragging(false)}>
        {(assistant) => {
          const isExpanded = expandedAssistants[assistant.id]
          const isCurrentAssistant = assistant.id === activeAssistant.id
          const isActive = isCurrentAssistant && !isExpanded
          return (
            <div key={assistant.id}>
              <Dropdown menu={{ items: getMenuItems(assistant) }} trigger={['contextMenu']}>
                <AssistantItem onClick={() => toggleAssistantExpand(assistant.id)} className={isActive ? 'active' : ''}>
                  <AssistantName className="name">{assistant.name || t('chat.default.name')}</AssistantName>
                  <TopicCount className="topics-count">{assistant.topics.length}</TopicCount>
                </AssistantItem>
              </Dropdown>
              {isExpanded && (
                <TopicsContainer>
                  <Topics
                    assistant={assistant}
                    activeTopic={activeAssistant.topics.find((t) => t.id === activeTopic?.id) || assistant.topics[0]}
                    setActiveTopic={(topic) => {
                      if (assistant.id !== activeAssistant.id) {
                        setActiveAssistant(assistant)
                      }
                      setActiveTopic(topic)
                    }}
                    className="in-assistant"
                  />
                </TopicsContainer>
              )}
            </div>
          )
        }}
      </DragableList>
      {!dragging && (
        <AssistantItem onClick={onCreateAssistant}>
          <AssistantName>
            <PlusOutlined style={{ color: 'var(--color-text-2)', marginRight: 4 }} />
            {t('chat.add.assistant.title')}
          </AssistantName>
        </AssistantItem>
      )}
      <div style={{ minHeight: 10 }}></div>
    </Container>
  )
}

//整个助手的容器
const Container = styled(Scrollbar)`
  display: flex;
  flex-direction: column;
  padding-top: 11px;
  user-select: none;
`

//单个助手
const AssistantItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin: 0 10px;
  border-radius: var(--list-item-border-radius);
  font-family: Ubuntu;
  font-size: 13px;
  position: relative;
  cursor: pointer;
  border: 0.5px solid var(--color-border);
  &:hover {
    background-color: var(--color-background-soft);
  }
  &.active {
    background-color: var(--color-background-soft);
    border: 0.5px solid var(--color-border);
  }
`

const AssistantName = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
`

const TopicCount = styled.div`
  color: var(--color-text-3);
  font-size: 11px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: var(--color-background);
  padding: 0 6px;
  border: 0.5px solid var(--color-border);
`

const TopicsContainer = styled.div`
  margin-bottom: -21px;
  margin-top: 0px;
`

export default Assistants
