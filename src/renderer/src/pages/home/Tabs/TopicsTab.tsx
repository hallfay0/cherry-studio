import {
  ClearOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderOutlined,
  UploadOutlined,
  MessageOutlined
} from '@ant-design/icons'
import DragableList from '@renderer/components/DragableList'
import PromptPopup from '@renderer/components/Popups/PromptPopup'
import Scrollbar from '@renderer/components/Scrollbar'
import { useAssistant, useAssistants } from '@renderer/hooks/useAssistant'
import { modelGenerating } from '@renderer/hooks/useRuntime'
import { useSettings } from '@renderer/hooks/useSettings'
import { TopicManager } from '@renderer/hooks/useTopic'
import { fetchMessagesSummary } from '@renderer/services/ApiService'
import { getDefaultTopic } from '@renderer/services/AssistantService'
import { EVENT_NAMES, EventEmitter } from '@renderer/services/EventService'
import store from '@renderer/store'
import { setGenerating } from '@renderer/store/runtime'
import { Assistant, Topic } from '@renderer/types'
import { exportTopicAsMarkdown, topicToMarkdown } from '@renderer/utils/export'
import { Dropdown, MenuProps } from 'antd'
import dayjs from 'dayjs'
import { findIndex } from 'lodash'
import { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface Props {
  assistant: Assistant
  activeTopic?: Topic
  setActiveTopic: (topic: Topic) => void
  className?: string
}

const Topics: FC<Props> = ({ assistant: _assistant, activeTopic, setActiveTopic, className }) => {
  const { assistants } = useAssistants()
  const { assistant, removeTopic, moveTopic, updateTopic, updateTopics } = useAssistant(_assistant.id)
  const { t } = useTranslation()
  const { showTopicTime, topicPosition } = useSettings()

  const borderRadius = 10

  const onDeleteTopic = useCallback(
    async (topic: Topic) => {
      await modelGenerating()
      const index = findIndex(assistant.topics, (t) => t.id === topic.id)
      setActiveTopic(assistant.topics[index + 1 === assistant.topics.length ? 0 : index + 1])
      removeTopic(topic)
    },
    [assistant.topics, removeTopic, setActiveTopic]
  )

  const onMoveTopic = useCallback(
    async (topic: Topic, toAssistant: Assistant) => {
      await modelGenerating()
      const index = findIndex(assistant.topics, (t) => t.id === topic.id)
      setActiveTopic(assistant.topics[index + 1 === assistant.topics.length ? 0 : index + 1])
      moveTopic(topic, toAssistant)
    },
    [assistant.topics, moveTopic, setActiveTopic]
  )

  const onSwitchTopic = useCallback(
    async (topic: Topic) => {
      await modelGenerating()
      setActiveTopic(topic)
    },
    [setActiveTopic]
  )

  const onClearMessages = useCallback(
    async (topicId: string) => {
      window.keyv.set(EVENT_NAMES.CHAT_COMPLETION_PAUSED, true)
      store.dispatch(setGenerating(false))
      await TopicManager.clearTopicMessages(topicId)
      const defaultTopic = getDefaultTopic(assistant.id)
      const topic = assistant.topics.find((t) => t.id === topicId)
      if (topic) {
        updateTopic({ ...topic, name: defaultTopic.name, messages: [] })
      }
      EventEmitter.emit(EVENT_NAMES.CLEAR_MESSAGES, topicId)
    },
    [assistant.id, assistant.topics, updateTopic]
  )

  const getTopicMenuItems = useCallback(
    (topic: Topic) => {
      const menus: MenuProps['items'] = [
        {
          label: t('chat.topics.auto_rename'),
          key: 'auto-rename',
          icon: <i className="iconfont icon-business-smart-assistant" style={{ fontSize: '14px' }} />,
          async onClick() {
            const messages = await TopicManager.getTopicMessages(topic.id)
            if (messages.length >= 2) {
              const summaryText = await fetchMessagesSummary({ messages, assistant })
              if (summaryText) {
                updateTopic({ ...topic, name: summaryText })
              }
            }
          }
        },
        {
          label: t('chat.topics.edit.title'),
          key: 'rename',
          icon: <EditOutlined />,
          async onClick() {
            const name = await PromptPopup.show({
              title: t('chat.topics.edit.title'),
              message: '',
              defaultValue: topic?.name || ''
            })
            if (name && topic?.name !== name) {
              updateTopic({ ...topic, name })
            }
          }
        },
        {
          label: t('chat.topics.clear.title'),
          key: 'clear-messages',
          icon: <ClearOutlined />,
          async onClick() {
            window.modal.confirm({
              title: t('chat.input.clear.content'),
              centered: true,
              onOk: () => onClearMessages(topic.id)
            })
          }
        },
        {
          label: t('chat.topics.export.title'),
          key: 'export',
          icon: <UploadOutlined />,
          children: [
            {
              label: t('chat.topics.export.image'),
              key: 'image',
              onClick: () => EventEmitter.emit(EVENT_NAMES.EXPORT_TOPIC_IMAGE, topic)
            },
            {
              label: t('chat.topics.export.md'),
              key: 'markdown',
              onClick: () => exportTopicAsMarkdown(topic)
            },
            {
              label: t('chat.topics.export.word'),
              key: 'word',
              onClick: async () => {
                const markdown = await topicToMarkdown(topic)
                window.api.export.toWord(markdown, topic.name)
              }
            }
          ]
        }
      ]

      if (assistants.length > 1 && assistant.topics.length > 1) {
        menus.push({
          label: t('chat.topics.move_to'),
          key: 'move',
          icon: <FolderOutlined />,
          children: assistants
            .filter((a) => a.id !== assistant.id)
            .map((a) => ({
              label: a.name,
              key: a.id,
              onClick: () => onMoveTopic(topic, a)
            }))
        })
      }

      if (assistant.topics.length > 1) {
        menus.push({ type: 'divider' })
        menus.push({
          label: t('common.delete'),
          danger: true,
          key: 'delete',
          icon: <DeleteOutlined />,
          onClick: () => onDeleteTopic(topic)
        })
      }

      return menus
    },
    [assistant, assistants, onClearMessages, onDeleteTopic, onMoveTopic, t, updateTopic]
  )

  return (
    <Container right={topicPosition === 'right'} className={`topics-tab ${className || ''}`}>
      <DragableList list={assistant.topics} onUpdate={updateTopics}>
        {(topic) => {
          const isActive = activeTopic?.id === topic.id
          return (
            <Dropdown menu={{ items: getTopicMenuItems(topic) }} trigger={['contextMenu']} key={topic.id}>
              <TopicListItem
                className={isActive ? 'active' : ''}
                onClick={() => onSwitchTopic(topic)}
                style={{ borderRadius }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MessageIcon>
                    <MessageOutlined />
                  </MessageIcon>
                  <TopicName className="name">{topic.name.replace('`', '')}</TopicName>
                </div>
                {showTopicTime && (
                  <TopicTime className="time">{dayjs(topic.createdAt).format('MM/DD HH:mm')}</TopicTime>
                )}
                {isActive && (
                  <MenuButton
                    className="menu"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (assistant.topics.length === 1) {
                        return onClearMessages(topic.id)
                      }
                      onDeleteTopic(topic)
                    }}>
                    <CloseOutlined />
                  </MenuButton>
                )}
              </TopicListItem>
            </Dropdown>
          )
        }}
      </DragableList>
      <div style={{ minHeight: '10px' }}></div>
    </Container>
  )
}

const MessageIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px;
  color: var(--color-text-3);
  font-size: 14px;
  transition: color 0.3s ease;
  .anticon {
    font-size: 14px;
  }
`

//单个话题
const TopicListItem = styled.div`
  font-family: Ubuntu;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  cursor: pointer;
  border: 0.5px solid transparent;
  padding: 5px 10px;
  .menu {
    opacity: 1;
    color: var(--color-text-2);
  }
  &:hover {
    background-color: var(--color-background-soft);
  }
  &.active {
    background-color: var(--color-background-soft);
    border: 0.5px solid var(--color-border);
    .menu {
      opacity: 1;
      &:hover {
        color: var(--color-text-2);
      }
    }
  }
`

//话题列表
const Container = styled(Scrollbar)<{ right?: boolean }>`
  display: flex;
  flex-direction: column;
  padding-top: 11px;
  user-select: none;
  max-height: auto;
  overflow-y: auto;
  background: transparent;
  &.in-assistant {
    padding-top: 5px;
    padding-bottom: 0;

    ${TopicListItem} {
      margin-left: 20px;
      margin-right: 20px;
      padding-right: 25px;
    }

    & > div:last-child {
      min-height: 0;
    }
  }

  .topics-tab {
    background: transparent;
  }
`

const TopicName = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 13px;
`

const TopicTime = styled.div`
  color: var(--color-text-3);
  font-size: 11px;
`

const MenuButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-width: 22px;
  min-height: 22px;
  position: absolute;
  right: 8px;
  top: 6px;
  .anticon {
    font-size: 12px;
  }
`

export default Topics
