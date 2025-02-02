import {
  DeleteOutlined,
  EditOutlined,
  FormOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons'
import DragableList from '@renderer/components/DragableList'
import CopyIcon from '@renderer/components/Icons/CopyIcon'
import Scrollbar from '@renderer/components/Scrollbar'
import { useAgents } from '@renderer/hooks/useAgents'
import { useAssistants } from '@renderer/hooks/useAssistant'
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

//整个页面最外层容器
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

//按钮容器
const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 11px 10px 8px 10px;
  background: var(--color-background);
`

//整个助手列表最外层容器
const Container = styled(Scrollbar)`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
`

//助手列表内容容器
const ListContent = styled.div`
  display: flex;
  flex-direction: column;
  user-select: none;
  min-height: min-content;
`

const AssistantName = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
`

//单助手容器
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

//对话数量圆圈
const TopicCount = styled.div`
  color: var(--color-text-3);
  font-size: 11px;
  min-width: 18px;
  border-radius: 9px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: var(--color-background);
  padding: 0 6px;
  border: 0.5px solid var(--color-border);
`

//单对话容器
const TopicsContainer = styled.div`
  margin-top: 3px;
  margin-bottom: -18px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-border);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`

const ButtonAssistantItem = styled(AssistantItem)`
  margin: 0;
  justify-content: center;
  padding: 8px;

  ${AssistantName} {
    width: auto;
    white-space: nowrap;
    -webkit-line-clamp: initial;
  }
`

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
  const { t } = useTranslation()
  const { addAgent } = useAgents()

  const clearAssistantTopics = useCallback(
    (assistantId: string) => {
      updateAssistants(
        assistants.map((a) => {
          if (a.id === assistantId) {
            return {
              ...a,
              topics: [getDefaultTopic(a.id)]
            }
          }
          return a
        })
      )
    },
    [assistants, updateAssistants]
  )

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
              onOk: () => clearAssistantTopics(assistant.id)
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
    [addAgent, addAssistant, clearAssistantTopics, onDelete, setActiveAssistant, t]
  )

  const toggleAssistantExpand = (assistantId: string) => {
    setExpandedAssistants((prev) => ({
      ...prev,
      [assistantId]: !prev[assistantId]
    }))
  }

  return (
    <PageWrapper>
      <ButtonContainer>
        <ButtonAssistantItem onClick={() => EventEmitter.emit(EVENT_NAMES.ADD_NEW_TOPIC)}>
          <AssistantName>
            <FormOutlined style={{ color: 'var(--color-text-2)', marginRight: 4 }} />
            {t('chat.button.new_topic')}
          </AssistantName>
        </ButtonAssistantItem>
        <ButtonAssistantItem onClick={onCreateAssistant}>
          <AssistantName>
            <PlusOutlined style={{ color: 'var(--color-text-2)', marginRight: 4 }} />
            {t('chat.add.assistant.title')}
          </AssistantName>
        </ButtonAssistantItem>
      </ButtonContainer>
      <Container>
        <ListContent>
          <DragableList
            list={assistants}
            onUpdate={updateAssistants}
            style={{ paddingBottom: dragging ? '14px' : 0 }}
            onDragStart={() => setDragging(true)}
            onDragEnd={() => setDragging(false)}>
            {(assistant) => {
              const isExpanded = expandedAssistants[assistant.id]
              const isCurrentAssistant = assistant.id === activeAssistant.id
              const isActive = isCurrentAssistant && !isExpanded
              return (
                <div key={assistant.id}>
                  <Dropdown menu={{ items: getMenuItems(assistant) }} trigger={['contextMenu']}>
                    <AssistantItem
                      onClick={() => toggleAssistantExpand(assistant.id)}
                      className={isActive ? 'active' : ''}>
                      <AssistantName className="name">{assistant.name || t('chat.default.name')}</AssistantName>
                      <TopicCount className="topics-count">{assistant.topics.length}</TopicCount>
                    </AssistantItem>
                  </Dropdown>
                  {isExpanded && (
                    <TopicsContainer>
                      <Topics
                        assistant={assistant}
                        activeTopic={isCurrentAssistant ? activeTopic : undefined}
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
          <div style={{ minHeight: 10 }}></div>
        </ListContent>
      </Container>
    </PageWrapper>
  )
}

export default Assistants
