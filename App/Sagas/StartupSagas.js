import { put, select, call } from 'redux-saga/effects'
import LoginActions,{isLoggedIn, isNew, asyncExpiry} from '../Redux/LoginRedux'
import ChatTypes from '../Redux/ChatRedux'
import AppStateActions from '../Redux/AppStateRedux'
import { ChatAPI } from '../Services/ChatAPI'
import { is } from 'ramda'

import ReduxPersist from "../Config/ReduxPersist";
export function * startup (api, action) {
  // Set initial reducer values to determine where the user should be navigated to on the login screen
  const tokenInMemory = yield isLoggedIn(null)
  const signedUp = yield isNew(null)
  const expiry = yield asyncExpiry(null)
  api.setHeader('Authorization',tokenInMemory == null ? '' : `JWT ${tokenInMemory}`)
  // if token exists set isAuthenticated and token value in reducer[login] is not expired
  if (tokenInMemory) {
    if(expiry >= new Date().getMilliseconds()){
      const response = yield call(api.fetchCurrentUser)
      // we made it!
      if (response.ok) {
        yield put(LoginActions.autoLogin(tokenInMemory, expiry, response.data))
        ChatAPI.connect(tokenInMemory);
        ChatAPI.listen(action.store);

      }else{
        yield put(LoginActions.loginFailure(response.data))
      }
    }
  }

	if (ReduxPersist.active) {
    yield put(AppStateActions.setRehydrationComplete())
  }
}
