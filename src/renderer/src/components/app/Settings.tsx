import { FC, ReactNode } from 'react'
import styled from 'styled-components'
import { ThemeMode } from '@renderer/types'

interface SettingContainerProps {
  theme: ThemeMode
  children: ReactNode
}

interface SettingGroupProps {
  theme: ThemeMode
  children: ReactNode
  style?: React.CSSProperties
}

export const SettingContainer: FC<SettingContainerProps> = ({ theme, children }) => (
  <Container theme={theme}>{children}</Container>
)

export const SettingGroup: FC<SettingGroupProps> = ({ theme, children, style }) => (
  <Group theme={theme} style={style}>
    {children}
  </Group>
)

export const SettingTitle: FC<{ children: ReactNode }> = ({ children }) => <Title>{children}</Title>

export const SettingDivider: FC<{ style?: React.CSSProperties }> = ({ style }) => <Divider style={style} />

const Container = styled.div<{ theme: ThemeMode }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`

const Group = styled.div<{ theme: ThemeMode }>`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: var(--color-background-soft);
  border-radius: 8px;
  border: 1px solid var(--color-border);
`

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 8px;
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: var(--color-border);
  margin: 16px 0;
`
