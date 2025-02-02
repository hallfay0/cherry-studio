import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

interface Props {
  name?: string
  children: React.ReactNode
}

const cache = new Map<
  string,
  {
    component: React.ReactNode
    scrollTop: number
  }
>()

const KeepAlive: React.FC<Props> = ({ name, children }) => {
  const { pathname } = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)
  const key = name || pathname

  useEffect(() => {
    // 保存组件到缓存
    if (!cache.has(key)) {
      cache.set(key, {
        component: children,
        scrollTop: 0
      })
    }

    // 恢复滚动位置
    const cached = cache.get(key)
    if (cached && containerRef.current) {
      containerRef.current.scrollTop = cached.scrollTop
    }

    return () => {
      // 保存滚动位置
      if (containerRef.current) {
        const cached = cache.get(key)
        if (cached) {
          cached.scrollTop = containerRef.current.scrollTop
        }
      }
    }
  }, [key, children])

  return <Container ref={containerRef}>{cache.get(key)?.component || children}</Container>
}

const Container = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;
  display: flex;
  flex: 1;
`

export default KeepAlive
