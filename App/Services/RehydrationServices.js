import ReduxPersist from '../Config/ReduxPersist'
import { AsyncStorage } from 'react-native'
import { persistStore } from 'redux-persist'
import StartupActions from '../Redux/StartupRedux'
import DebugConfig from '../Config/DebugConfig'

const updateReducers = (store: Object) => {
  const reducerVersion = ReduxPersist.reducerVersion
  const config = ReduxPersist.storeConfig
  const startup = () => store.dispatch(StartupActions.startup())

  // Check to ensure latest reducer version
  AsyncStorage.getItem('reducerVersion').then((localVersion) => {
    if (localVersion !== reducerVersion) {
      if (DebugConfig.useReactotron) {
        console.tron.display({
          name: 'PURGE',
          value: {
            'Old Version:': localVersion,
            'New Version:': reducerVersion
          },
          preview: 'Reducer Version Change Detected',
          important: true
        })
      }
      // Purge store
    console.log('purge store')
      persistStore(store, [config, startup]).purge()
      AsyncStorage.setItem('reducerVersion', reducerVersion)
    } else {
    console.log('equal versions')
      persistStore(store, [config, startup])
    }
    //startup()
  }).catch(() => {
    persistStore(store, [config, startup])
    AsyncStorage.setItem('reducerVersion', reducerVersion)
    console.log('catch')
  })
}

export default {updateReducers}
