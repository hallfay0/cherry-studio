import { SearchOutlined } from '@ant-design/icons'
import { Navbar, NavbarRight } from '@renderer/components/app/Navbar'
import { HStack } from '@renderer/components/Layout'
import MinAppsPopover from '@renderer/components/Popups/MinAppsPopover'
import SearchPopup from '@renderer/components/Popups/SearchPopup'
import { isMac, isWindows } from '@renderer/config/constant'
import { useAssistant } from '@renderer/hooks/useAssistant'
import { useSettings } from '@renderer/hooks/useSettings'
import { useShowAssistants } from '@renderer/hooks/useStore'
import AssistantSettingsPopup from '@renderer/pages/settings/AssistantSettings'
import { useAppDispatch } from '@renderer/store'
import { setNarrowMode, toggleShowRightSidebar } from '@renderer/store/settings'
import { Assistant } from '@renderer/types'
import { FC } from 'react'
import styled from 'styled-components'

import SelectModelButton from './components/SelectModelButton'

interface Props {
  activeAssistant: Assistant
  onCreateAssistant: () => void
}

const HeaderNavbar: FC<Props> = ({ activeAssistant }) => {
  const { assistant } = useAssistant(activeAssistant.id)
  const { showAssistants, toggleShowAssistants } = useShowAssistants()
  const { sidebarIcons, narrowMode, enableRightSidebar, showRightSidebar } = useSettings()
  const dispatch = useAppDispatch()

  return (
    <Navbar>
      <NavbarRight
        style={{ justifyContent: 'space-between', paddingRight: isWindows ? 140 : 12, flex: 1 }}
        className="home-navbar-right">
        <HStack alignItems="center">
          {!showAssistants && (
            <NavbarIcon onClick={() => toggleShowAssistants()} style={{ marginRight: 8, marginLeft: isMac ? 4 : -12 }}>
              <i className="iconfont icon-show-sidebar" />
            </NavbarIcon>
          )}
          <TitleText
            style={{ marginRight: 10, cursor: 'pointer' }}
            className="nodrag"
            onClick={() => AssistantSettingsPopup.show({ assistant })}>
            {assistant.name}
          </TitleText>
          <SelectModelButton assistant={assistant} />
        </HStack>
        <HStack alignItems="center" gap={8}>
          <NarrowIcon onClick={() => SearchPopup.show()}>
            <SearchOutlined />
          </NarrowIcon>
          <NarrowIcon onClick={() => dispatch(setNarrowMode(!narrowMode))}>
            <i className="iconfont icon-icon-adaptive-width"></i>
          </NarrowIcon>
          {sidebarIcons.visible.includes('minapp') && (
            <MinAppsPopover>
              <NarrowIcon>
                <i className="iconfont icon-appstore" />
              </NarrowIcon>
            </MinAppsPopover>
          )}
          {enableRightSidebar && (
            <NarrowIcon onClick={() => dispatch(toggleShowRightSidebar())}>
              <i className={`iconfont icon-${showRightSidebar ? 'show' : 'hide'}-sidebar`} />
            </NarrowIcon>
          )}
        </HStack>
      </NavbarRight>
    </Navbar>
  )
}

export const NavbarIcon = styled.div`
  -webkit-app-region: none;
  border-radius: 8px;
  height: 30px;
  padding: 0 7px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  .iconfont {
    font-size: 18px;
    color: var(--color-icon);
    &.icon-a-addchat {
      font-size: 20px;
    }
    &.icon-a-darkmode {
      font-size: 20px;
    }
    &.icon-appstore {
      font-size: 20px;
    }
  }
  .anticon {
    color: var(--color-icon);
    font-size: 16px;
  }
  &:hover {
    background-color: var(--color-background-mute);
    color: var(--color-icon-white);
  }
`

const TitleText = styled.span`
  margin-left: 5px;
  font-family: Ubuntu;
  font-size: 12px;
  user-select: none;
  @media (max-width: 1080px) {
    display: none;
  }
`

const NarrowIcon = styled(NavbarIcon)`
  @media (max-width: 1000px) {
    display: none;
  }
`

export default HeaderNavbar
