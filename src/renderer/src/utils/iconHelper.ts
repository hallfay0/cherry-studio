import { MinAppIcon } from '@renderer/types'

export const IconHelper = {
  // 统一的图标获取方法
  async fetchIcon(url: string): Promise<MinAppIcon | null> {
    try {
      // 1. 尝试直接获取指定URL
      let response = await fetch(url)
      if (!response.ok) {
        // 2. 尝试获取网站favicon
        const urlObj = new URL(url)
        response = await fetch(`${urlObj.protocol}//${urlObj.hostname}/favicon.ico`)
      }

      if (!response.ok) return null

      // 验证内容类型
      const contentType = response.headers.get('content-type')
      // 增加对 ICO 格式的支持
      const validImageTypes = ['image/', 'image/x-icon', 'image/vnd.microsoft.icon']
      const isValidImage = validImageTypes.some((type) => contentType?.startsWith(type))
      if (!isValidImage) {
        console.log('Invalid content type:', contentType)
        return null
      }

      // 转换为base64
      const blob = await response.blob()
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })

      return {
        type: 'base64',
        value: base64,
        originalUrl: url
      }
    } catch (error) {
      console.error('Failed to fetch icon:', error)
      return null
    }
  },

  // 获取默认图标
  getDefaultIcon(): MinAppIcon {
    return {
      type: 'base64',
      value:
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIi8+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiLz48cG9seWxpbmUgcG9pbnRzPSIyMSAxNSAxNiAxMCA1IDIxIi8+PC9zdmc+'
    }
  }
}
