import { useAppSelector } from '@renderer/store'
import { FC, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { isMac } from '@renderer/config/constant'
import { useLocation } from 'react-router-dom'

interface WebviewElement extends HTMLElement {
  src: string
  allowpopups: string
  partition: string
  reload: () => void
  loadURL: (url: string) => void
  addEventListener: (event: string, callback: (event: any) => void) => void
  removeEventListener: (event: string, callback: (event: any) => void) => void
}

const WebviewContainer: FC = () => {
  const { tabs, activeTab } = useAppSelector((state) => state.tabs)
  const webviewRefs = useRef<{ [key: string]: WebviewElement | null }>({})
  const { pathname } = useLocation()
  const isTabsPage = pathname === '/tabs'

  useEffect(() => {
    const handleReload = (event: CustomEvent) => {
      const { tabId } = event.detail
      const webview = webviewRefs.current[tabId]
      if (webview) {
        webview.reload()
      }
    }

    window.addEventListener('reload-webview', handleReload as EventListener)
    return () => {
      window.removeEventListener('reload-webview', handleReload as EventListener)
    }
  }, [])

  return (
    <Container $visible={isTabsPage}>
      {tabs.map((tab) => (
        <WebviewWrapper key={tab.id} $visible={tab.id?.toString() === activeTab}>
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
        </WebviewWrapper>
      ))}
    </Container>
  )
}

const Container = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: ${isMac ? 'var(--navbar-height)' : '0'};
  left: var(--sidebar-width);
  width: calc(100% - var(--sidebar-width));
  height: ${isMac ? 'calc(100vh - var(--navbar-height))' : '100vh'};
  z-index: ${(props) => (props.$visible ? 1 : -1)};
  pointer-events: ${(props) => (props.$visible ? 'auto' : 'none')};
  border-top-left-radius: 10px;
  border: 0.5px solid var(--color-frame-border);
  overflow: hidden;
`

const WebviewWrapper = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};
  pointer-events: ${(props) => (props.$visible ? 'auto' : 'none')};
`

export default WebviewContainer
