import { CloseOutlined, ExportOutlined, HomeOutlined, PushpinOutlined, ReloadOutlined } from '@ant-design/icons'
import { Navbar, NavbarCenter } from '@renderer/components/app/Navbar'
import { useMinapps } from '@renderer/hooks/useMinapps'
import { useAppDispatch, useAppSelector } from '@renderer/store'
import { removeTab, setActiveTab } from '@renderer/store/tabs'
// import { MinAppType } from '@renderer/types'
import { Tabs } from 'antd'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

// interface WebviewElement extends HTMLElement {
//   src: string
//   allowpopups: string
//   partition: string
//   reload: () => void
//   loadURL: (url: string) => void
// }

const TabsPage: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { tabs, activeTab } = useAppSelector((state) => state.tabs)
  const { pinned, updatePinnedMinapps } = useMinapps()

  const handleTabClose = (targetKey: string) => {
    const targetIndex = tabs.findIndex((tab) => tab.id === targetKey)
    let newActiveKey = activeTab

    if (targetKey === activeTab) {
      if (tabs.length > 1) {
        newActiveKey = tabs[targetIndex === tabs.length - 1 ? targetIndex - 1 : targetIndex + 1].id!.toString()
      } else {
        newActiveKey = ''
      }
    }

    dispatch(removeTab(targetKey))
    dispatch(setActiveTab(newActiveKey))
  }

  const handleReload = () => {
    // 通过事件通知WebviewContainer重新加载
    window.dispatchEvent(new CustomEvent('reload-webview', { detail: { tabId: activeTab } }))
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

  const handleHome = () => {
    const currentTab = tabs.find((tab) => tab.id?.toString() === activeTab)
    if (currentTab) {
      window.dispatchEvent(new CustomEvent('home-webview', { detail: { tabId: activeTab, url: currentTab.url } }))
    }
  }

  const items = tabs.map((tab) => {
    return {
      key: tab.id!.toString(),
      label: (
        <TabLabel>
          <span>{tab.name}</span>
        </TabLabel>
      ),
      children: null // 移除webview渲染
    }
  })

  return (
    <Container>
      <Navbar>
        <StyledNavbarCenter>
          {activeTab ? tabs.find((tab) => tab.id?.toString() === activeTab)?.name : t('minapp.title')}
          <ButtonsGroup>
            <Button onClick={handleHome} $disabled={!activeTab}>
              <HomeOutlined />
            </Button>
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
