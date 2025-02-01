/* eslint-disable react/no-unknown-property */
import store from '@renderer/store'
import { setMinappShow } from '@renderer/store/runtime'
import { addTab, setActiveTab } from '@renderer/store/tabs'
import { MinAppType } from '@renderer/types'

import NavigationService from '@renderer/services/NavigationService'

export default class MinApp {
  static app: MinAppType | null = null
  static onClose = () => {}

  static async start(app: MinAppType) {
    if (app?.id && MinApp.app?.id === app?.id) {
      return
    }

    if (MinApp.app) {
      await MinApp.onClose()
    }

    MinApp.app = app
    store.dispatch(addTab(app))
    store.dispatch(setActiveTab(app.id!.toString()))
    store.dispatch(setMinappShow(true))
    NavigationService.navigate?.('/tabs')
  }

  static close() {
    store.dispatch(setMinappShow(false))
    MinApp.app = null
  }
}
