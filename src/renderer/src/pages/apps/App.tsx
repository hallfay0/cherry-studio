import MinAppIcon from '@renderer/components/Icons/MinAppIcon'
// import MinApp from '@renderer/components/MinApp'
import { useMinapps } from '@renderer/hooks/useMinapps'
import { MinAppType } from '@renderer/types'
import { Dropdown, MenuProps } from 'antd'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@renderer/store'
import { addTab, setActiveTab } from '@renderer/store/tabs'

interface Props {
  app: MinAppType
  onClick?: () => void
  size?: number
}

const App: FC<Props> = ({ app, onClick, size = 60 }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {
    minapps,
    pinned,
    updatePinnedMinapps,
    updateMinapps,
    updateDisabledMinapps,
    disabled: disabledMinapps
  } = useMinapps()
  const isPinned = pinned.some((p) => p.id === app.id)
  const isVisible = minapps.some((m) => m.id === app.id)
  const isCustomApp = Boolean(app.id?.toString().startsWith('custom_'))

  const handleClick = () => {
    dispatch(addTab(app))
    dispatch(setActiveTab(app.id!.toString()))
    navigate('/tabs')
    onClick?.()
  }

  const handleHideApp = () => {
    const newVisible = minapps.filter((item) => item.id !== app.id)
    const newDisabled = [...disabledMinapps, app]
    updateMinapps(newVisible)
    updateDisabledMinapps(newDisabled)
    if (isPinned) {
      const updatedPinned = pinned.filter((item) => item.id !== app.id)
      updatePinnedMinapps(updatedPinned)
    }
  }

  const handleEditApp = () => {
    navigate('/settings/custom-minapp', {
      state: { editingApp: app },
      replace: true
    })
  }

  const handleDeleteApp = () => {
    const updatedApps = minapps.filter((item) => item.id !== app.id)
    updateMinapps(updatedApps)
    if (isPinned) {
      const updatedPinned = pinned.filter((item) => item.id !== app.id)
      updatePinnedMinapps(updatedPinned)
    }
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'togglePin',
      label: isPinned ? t('minapp.sidebar.remove.title') : t('minapp.sidebar.add.title'),
      onClick: () => {
        const newPinned = isPinned ? pinned.filter((item) => item.id !== app.id) : [...(pinned || []), app]
        updatePinnedMinapps(newPinned)
      }
    },
    {
      key: 'hide',
      label: t('隐藏该应用'),
      onClick: handleHideApp
    },
    ...(isCustomApp
      ? [
          {
            key: 'edit',
            label: t('编辑该应用'),
            onClick: handleEditApp
          },
          {
            key: 'delete',
            label: t('删除该应用'),
            danger: true,
            onClick: handleDeleteApp
          }
        ]
      : [])
  ]

  if (!isVisible) return null

  return (
    <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']}>
      <Container onClick={handleClick} $isCustom={isCustomApp}>
        <MinAppIcon size={size} app={app} />
        <AppTitle>{app.name}</AppTitle>
      </Container>
    </Dropdown>
  )
}

const Container = styled.div<{ $isCustom: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: visible;
  position: relative;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--color-bg-hover);
  }
`

const AppTitle = styled.div`
  font-size: 12px;
  margin-top: 5px;
  color: var(--color-text-soft);
  text-align: center;
  user-select: none;
  white-space: nowrap;
`

export default App
