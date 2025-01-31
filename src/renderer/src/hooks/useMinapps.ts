import { DEFAULT_MIN_APPS } from '@renderer/config/minapps'
import { RootState, useAppDispatch, useAppSelector } from '@renderer/store'
import { setDisabledMinApps, setMinApps, setPinnedMinApps } from '@renderer/store/minapps'
import { MinAppType } from '@renderer/types'

export const useMinapps = () => {
  const { enabled, disabled, pinned } = useAppSelector((state: RootState) => state.minapps)
  const dispatch = useAppDispatch()

  const mapCustomApps = (apps: MinAppType[]) => {
    return apps.map((app) => {
      // 如果是自定义应用（ID以custom_开头），直接返回原始数据
      if (app.id?.toString().startsWith('custom_')) {
        return app
      }
      // 如果是默认应用，尝试从DEFAULT_MIN_APPS中获取
      return DEFAULT_MIN_APPS.find((item) => item.id === app.id) || app
    })
  }

  return {
    minapps: mapCustomApps(enabled),
    disabled: mapCustomApps(disabled),
    pinned: mapCustomApps(pinned),
    updateMinapps: (minapps: MinAppType[]) => {
      console.log('Updating minapps in store:', minapps)
      dispatch(setMinApps(minapps))
    },
    updateDisabledMinapps: (minapps: MinAppType[]) => {
      console.log('Updating disabled minapps in store:', minapps)
      dispatch(setDisabledMinApps(minapps))
    },
    updatePinnedMinapps: (minapps: MinAppType[]) => {
      console.log('Updating pinned minapps in store:', minapps)
      dispatch(setPinnedMinApps(minapps))
    }
  }
}
