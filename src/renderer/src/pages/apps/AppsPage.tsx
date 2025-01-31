import { SearchOutlined } from '@ant-design/icons'
import { Navbar, NavbarCenter } from '@renderer/components/app/Navbar'
import { Center } from '@renderer/components/Layout'
import { useMinapps } from '@renderer/hooks/useMinapps'
import { Empty, Input } from 'antd'
import { isEmpty } from 'lodash'
import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import App from './App'

const AppsPage: FC = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const { minapps } = useMinapps()

  const filteredApps = search
    ? minapps.filter(
        (app) => app.name.toLowerCase().includes(search.toLowerCase()) || app.url.includes(search.toLowerCase())
      )
    : minapps

  const defaultApps = filteredApps.filter((app) => !app.id?.toString().startsWith('custom_'))
  const customApps = filteredApps.filter((app) => app.id?.toString().startsWith('custom_'))

  // Disable right-click menu in blank area
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const renderAppSection = (apps: typeof filteredApps, title: string) => {
    if (isEmpty(apps)) return null

    return (
      <Section>
        <AppsGrid>
          <SectionTitle>
            <TitleBar />
            {title}
          </SectionTitle>
          {apps.map((app) => (
            <App key={app.id} app={app} />
          ))}
        </AppsGrid>
      </Section>
    )
  }

  return (
    <Container onContextMenu={handleContextMenu}>
      <Navbar>
        <NavbarCenter style={{ borderRight: 'none', justifyContent: 'space-between' }}>
          {t('minapp.title')}
          <Input
            placeholder={t('common.search')}
            className="nodrag"
            style={{ width: '30%', height: 28 }}
            size="small"
            variant="filled"
            suffix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={{ width: 80 }} />
        </NavbarCenter>
      </Navbar>
      <ContentContainer id="content-container">
        <ContentWrapper>
          {renderAppSection(defaultApps, t('默认应用'))}
          {renderAppSection(customApps, t('自定义应用'))}
          {isEmpty(filteredApps) && (
            <Center style={{ flex: 1 }}>
              <Empty />
            </Center>
          )}
        </ContentWrapper>
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

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  height: 100%;
  overflow-y: auto;
  padding: 30px 50px;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-width: 0;
  max-width: 930px;
  width: 100%;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
`

const AppsGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, 90px);
  column-gap: 25px;
  row-gap: 25px;
  justify-content: start;
`

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  grid-column: 1/-1;
  margin-bottom: 8px;
`

const TitleBar = styled.div`
  width: 3px;
  height: 14px;
  background-color: var(--color-primary);
  border-radius: 1.5px;
`

export default AppsPage
