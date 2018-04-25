import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    nav: require('./NavigationRedux').reducer,
    github: require('./GithubRedux').reducer,
    login: require('./LoginRedux').reducer,
    search: require('./SearchRedux').reducer,
    chat: require('./ChatRedux').reducer,
    swipe: require('./SwipeRedux').reducer,
    meet_map: require('./MeetMapRedux').reducer,
    app: require('./AppStateRedux').reducer,
  })

  return configureStore(rootReducer, rootSaga)
}
