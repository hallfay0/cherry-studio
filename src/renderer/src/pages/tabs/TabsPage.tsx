import { CloseOutlined, ExportOutlined, PushpinOutlined, ReloadOutlined } from '@ant-design/icons'
import { Navbar, NavbarCenter } from '@renderer/components/app/Navbar'
import { useMinapps } from '@renderer/hooks/useMinapps'
import { useAppDispatch, useAppSelector } from '@renderer/store'
import { removeTab, setActiveTab } from '@renderer/store/tabs'
// import { MinAppType } from '@renderer/types'
import { Tabs } from 'antd'
import { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface WebviewElement extends HTMLElement {
  src: string
  allowpopups: string
  partition: string
  reload: () => void
  loadURL: (url: string) => void
  addEventListener: (event: string, callback: (event: any) => void) => void
  removeEventListener: (event: string, callback: (event: any) => void) => void
}

const TabsPage: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { tabs, activeTab } = useAppSelector((state) => state.tabs)
  const webviewRefs = useRef<{ [key: string]: WebviewElement | null }>({})
  const { pinned, updatePinnedMinapps } = useMinapps()

  const handleTabClose = (targetKey: string) => {
    const targetIndex = tabs.findIndex((tab) => tab.id === targetKey)
    let newActiveKey = activeTab

    // 如果关闭的是当前激活的标签页
    if (targetKey === activeTab) {
      if (tabs.length > 1) {
        // 如果还有其他标签页，切换到下一个或上一个标签页
        newActiveKey = tabs[targetIndex === tabs.length - 1 ? targetIndex - 1 : targetIndex + 1].id!.toString()
      } else {
        newActiveKey = ''
      }
    }

    dispatch(removeTab(targetKey))
    dispatch(setActiveTab(newActiveKey))
  }

  const handleReload = () => {
    const webview = webviewRefs.current[activeTab]
    if (webview) {
      webview.reload()
    }
  }

  const handleOpenExternal = () => {
    const currentTab = tabs.find((tab) => tab.id?.toString() === activeTab)
    if (currentTab) {
      window.api.openWebsite(currentTab.url)
    }
  }

  const handleTogglePin = () => {
    const currentTab = tabs.find((tab) => tab.id?.toString() === activeTab)
    if (!currentTab) return

    const isPinned = pinned.some((p) => p.id === currentTab.id)
    const newPinned = isPinned ? pinned.filter((item) => item.id !== currentTab.id) : [...pinned, currentTab]
    updatePinnedMinapps(newPinned)
  }

  const items = tabs.map((tab) => {
    // const isPinned = pinned.some((p) => p.id === tab.id)
    return {
      key: tab.id!.toString(),
      label: (
        <TabLabel>
          <span>{tab.name}</span>
        </TabLabel>
      ),
      children: (
        <WebviewContainer>
          <webview
            ref={(ref) => {
              if (ref) {
                webviewRefs.current[tab.id!.toString()] = ref as WebviewElement
                ref.addEventListener('new-window', (event: any) => {
                  event.preventDefault()
                  if ((ref as WebviewElement).loadURL) {
                    ;(ref as WebviewElement).loadURL(event.url)
                  }
                })
              }
            }}
            src={tab.url}
            style={{ width: '100%', height: '100%' }}
            allowpopups={'true' as any}
            partition="persist:webview"
          />
        </WebviewContainer>
      )
    }
  })

  return (
    <Container>
      <Navbar>
        <StyledNavbarCenter>
          {t('minapp.title')}
          <ButtonsGroup>
            <Button onClick={handleReload} $disabled={!activeTab}>
              <ReloadOutlined />
            </Button>
            <Button onClick={handleTogglePin} $disabled={!activeTab}>
              <PushpinOutlined
                style={{
                  fontSize: 16,
                  color: pinned.some((p) => p.id?.toString() === activeTab) ? 'var(--color-primary)' : undefined
                }}
              />
            </Button>
            <Button onClick={handleOpenExternal} $disabled={!activeTab}>
              <ExportOutlined />
            </Button>
            <Button onClick={() => handleTabClose(activeTab)} $disabled={!activeTab}>
              <CloseOutlined />
            </Button>
          </ButtonsGroup>
        </StyledNavbarCenter>
      </Navbar>
      <ContentContainer>
        <TabsContainer>
          <Tabs
            hideAdd
            type="card"
            activeKey={activeTab}
            onChange={(key) => dispatch(setActiveTab(key))}
            onEdit={(targetKey, action) => {
              if (action === 'remove' && typeof targetKey === 'string') {
                handleTabClose(targetKey)
              }
            }}
            items={items}
          />
        </TabsContainer>
      </ContentContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
`

const StyledNavbarCenter = styled(NavbarCenter)`
  border-right: none;
  justify-content: space-between;
`

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
`

const TabsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  background: var(--color-bg-1);
  overflow: hidden;
  border: 0.5px solid var(--color-border-soft);
  border-radius: 10px 0 0 0;

  .ant-tabs {
    height: 100%;

    .ant-tabs-nav {
      display: none;
    }

    .ant-tabs-content {
      height: 100%;
      .ant-tabs-tabpane {
        height: 100%;
      }
    }
  }
`

const WebviewContainer = styled.div`
  height: 100%;
  background: white;
`

const TabLabel = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const ButtonsGroup = styled.div`
  display: flex;
  gap: 4px;
  margin-left: auto;
  -webkit-app-region: no-drag;
`

const Button = styled.div<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 28px;
  border-radius: 6px;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  color: var(--color-text);
  transition: all 0.2s;
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};

  &:hover {
    background: ${(props) => (props.$disabled ? 'none' : 'var(--color-hover)')};
  }
`

export default TabsPage
