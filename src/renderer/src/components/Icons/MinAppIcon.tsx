import { DEFAULT_MIN_APPS } from '@renderer/config/minapps'
import { MinAppType, MinAppIcon as MinAppIconType } from '@renderer/types'
import { IconHelper } from '@renderer/utils/iconHelper'
import { FC, useState } from 'react'
import styled from 'styled-components'

interface Props {
  app: MinAppType
  size?: number
  style?: React.CSSProperties
}

const MinAppIcon: FC<Props> = ({ app, size = 48, style }) => {
  const [iconError, setIconError] = useState(false)
  const _app = DEFAULT_MIN_APPS.find((item) => item.id === app.id)

  const getIconValue = (logo: string | MinAppIconType): string => {
    if (typeof logo === 'string') {
      return logo
    }
    return logo.value
  }

  const getIconSrc = (): string => {
    if (iconError) {
      return IconHelper.getDefaultIcon().value
    }

    // 如果是默认应用，使用DEFAULT_MIN_APPS中的图标
    if (_app?.logo) {
      return getIconValue(_app.logo)
    }

    // 如果是自定义应用，使用应用自身的图标
    if (app.logo) {
      return getIconValue(app.logo)
    }

    return IconHelper.getDefaultIcon().value
  }

  const handleError = () => {
    console.log('Icon load error for app:', app.name, app.id)
    console.log('Icon source was:', getIconSrc())
    setIconError(true)
  }

  return (
    <Container
      src={getIconSrc()}
      onError={handleError}
      style={{
        border: app.bodered ? '0.5px solid var(--color-border)' : 'none',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: app.background,
        ...style
      }}
    />
  )
}

const Container = styled.img`
  border-radius: 16px;
  user-select: none;
  -webkit-user-drag: none;
`

export default MinAppIcon
