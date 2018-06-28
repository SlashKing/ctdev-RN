import { put, call } from 'redux-saga/effects'
import LoginActions, {isLoggedIn} from '../Redux/LoginRedux'
import SwipeActions from '../Redux/SwipeRedux'
import ChatActions from '../Redux/ChatRedux'
import {setAsync} from '../Lib/StorageUtils'
import {AsyncStorage} from 'react-native'
import { ChatAPI } from '../Services/ChatAPI'
import {NavigationActions} from 'react-navigation'
function * logout (api,action) {
  const token = yield isLoggedIn(null)
  const response = yield call(api.logout, token)
  if(response.ok){
    yield AsyncStorage.removeItem("@USER_STORE:token")
    yield AsyncStorage.removeItem("@USER_STORE:isNew")
    yield AsyncStorage.removeItem("@USER_STORE:expiry")
    yield put(LoginActions.logoutSuccess())
    yield put(SwipeActions.swipeLogout())
    yield put(ChatActions.chatLogout())
    // Reset the navigation and navigate to LoginScreen
    // IMPORTANT: key must be null in order to reset the stack
    // TODO: Revisit to add animation when destroyed, could be cool
    action.navigation.dispatch({type:"Navigation/RESET", index:0, key:null, actions: [{ type: 'Navigate', routeName: 'LoginScreen' }]})

  }else{
    yield put(LoginActions.logoutFailure(response.data))
  }
}
function * loginUser (api,action) {
  const {username, password} = action

  // TODO: pass a hashed/b64 password to the django api?
  if (password === '') {
    // dispatch failure
    yield put(LoginActions.loginFailure(response.data))
  } else {
    const token = yield isLoggedIn(null)

    // call the api to validate the login information
   const response = yield call(api.loginUser, username, password)
    console.log(response)
    // we made it!
    if (response.ok) {
      //__DEV__ && console.log(response,action)
      // save the token to AsyncStorage so we can append to Authorization header
      // save user object in redux to use across the entire application
      yield AsyncStorage.setItem("@USER_STORE:token", response.data.token)
      yield AsyncStorage.setItem("@USER_STORE:expiry", `${response.data.token_dec.exp}`)
      yield AsyncStorage.setItem("@USER_STORE:isNew", `${response.data.is_new}`)
      yield put(LoginActions.loginSuccess(response.data))
      console.log(ChatAPI.getStore())
      yield ChatAPI.connect(response.data.token)
      yield ChatAPI.listen(action.store)
    } else {
      // loop through possible response codes
      yield put(LoginActions.loginFailure(response.data))
    }
  }
}
function * patchUser (api, action) {
  const { data } = action
  const token = yield isLoggedIn(null)
  api.setHeader("Authorization", `JWT ${token}`)
  const response = yield call(api.patchUser, data)
  if (response.ok) {
    console.log(response)
    yield AsyncStorage.setItem("@USER_STORE:token", response.data.token)
    yield AsyncStorage.setItem("@USER_STORE:expiry", `${response.data.token_dec.exp}`)
    yield AsyncStorage.setItem("@USER_STORE:isNew", `${response.data.is_new}`)
    yield put(LoginActions.patchUserSuccess(response.data))
    yield Promise.resolve()
    if( data.hasOwnProperty("new_password1")) {
      yield put(LoginActions.passwordChangeRequest(data))
    }
    yield put(LoginActions.patchProfileRequest(data))
    //console.log(yield put(LoginActions.patchProfileRequest(data)))
  }else{
    yield put(LoginActions.patchUserError(response.data))
  }
}
function * updateLocation (api, action){
  const { data } = action
  const token = yield isLoggedIn(null)
  api.setHeader("Authorization", `JWT ${token}`)
  // update the users location
  const response = yield call(api.patchProfile, data)
  if (response.ok) {
    // get users after the location of the user is update in the db
    yield Promise.resolve();
    const users = yield call(api.fetchUsers);
    if (users.ok){
      yield put(SwipeActions.fetchUsersSuccess(users.data))
      yield put(LoginActions.locationSuccess(response.data))
    }else{ yield put(SwipeActions.fetchUsersFailure(users.data));}
   }else{
      yield put(LoginActions.locationError(response.data))
   }
}
function * patchProfile (api, action) {
  const { data } = action
  const token = yield isLoggedIn(null)
  api.setHeader("Authorization", `JWT ${token}`)
  const response = yield call(api.patchProfile, data)
  if (response.ok) {
    yield AsyncStorage.setItem("@USER_STORE:token", response.data.token)
    yield AsyncStorage.setItem("@USER_STORE:expiry", `${response.data.token_dec.exp}`)
    yield AsyncStorage.setItem("@USER_STORE:isNew", `${response.data.is_new}`)
    yield put(LoginActions.patchProfileSuccess(response.data))
  }else{
    yield put(LoginActions.patchProfileError(response.data))
  }
}
function * registerUser (api,action) {
  const {username, password1, password2, email, birthday, latitude, longitude} = action
    // call the api to validate the login information
   const response = yield call(api.registerUser, username, password1, password2, email, birthday, latitude, longitude)

    // we made it!
    if (response.ok) {
      __DEV__ && console.log(response,action)
      // save the token somewhere safe so we can append to Authorization header
      // save user object in redux to use across the entire application
      yield AsyncStorage.setItem("@USER_STORE:token", response.data.token)
      yield AsyncStorage.setItem("@USER_STORE:expiry", `${response.data.token_dec.exp}`)
      yield AsyncStorage.setItem("@USER_STORE:isNew", `${response.data.is_new}`)
      yield put(LoginActions.registerSuccess(response.data))
        ChatAPI.connect(response.data.token)
        ChatAPI.listen(action.store)

    } else {
      yield put(LoginActions.registerFailure(response.data))
    }
}
function * checkSocialLogin (api, action) {
console.log(action)
  const response = yield call(api.checkSocialLogin,action.accessToken)
      // we made it!
      if (response.ok) {
        __DEV__ && console.log(response,action)
        // save the token somewhere safe so we can append to Authorization header
        // save user object in redux to use across the entire application
        yield AsyncStorage.setItem("@USER_STORE:token", response.data.token)
        yield AsyncStorage.setItem("@USER_STORE:expiry", `${response.data.token_dec.exp}`)
        yield AsyncStorage.setItem("@USER_STORE:isNew", `${response.data.is_new}`)
        yield put(LoginActions.checkSocialLoginSuccess(response.data))
        //ChatAPI.close()
        ChatAPI.connect(response.data.token)
        ChatAPI.listen(action.store)

      } else {
        __DEV__ && console.log(response)
        yield put(LoginActions.checkSocialLoginError(response.data))
      }
}
function * passwordChange (api, action) {
  const response = yield call(api.passwordChange,action.data)
      if (response.ok) {
        __DEV__ && console.log(response,action)

        yield put(LoginActions.passwordChangeSuccess(response.data))

      } else {
        __DEV__ && console.log(response)
        yield put(LoginActions.passwordChangeError(response.data))
      }
}
function * passwordReset (api, action) {
  const response = yield call(api.passwordReset,action.data)
      if (response.ok) {
      __DEV__ && console.log(response,action)
        yield put(LoginActions.passwordResetSuccess(response.data))

      } else {
        __DEV__ && console.log(response)
        yield put(LoginActions.passwordResetError(response.data))
      }
}
function * passwordResetConfirm (api, action) {
  const response = yield call(api.passwordResetConfirm,action.data)
      if (response.ok) {
        __DEV__ && console.log(response,action)
        yield put(LoginActions.passwordResetConfirmSuccess(response.data))

      } else {
        __DEV__ && console.log(response)
        yield put(LoginActions.passwordResetConfirmError(response.data))
      }
}
function * addProfilePicture (api, action) {
  const response = yield call(api.addProfilePicture, action.data)
      if (response.ok) {
        __DEV__ && console.log(response,action)
        yield put(LoginActions.addProfilePictureSuccess(response.data))

      } else {
        __DEV__ && console.log(response)
        yield put(LoginActions.addProfilePictureFailure(response.data))
      }
}
function * switchPriority (api, action) {
  const response = yield call(api.switchPriority, action.data)
      if (response.ok) {
        __DEV__ && console.log(response,action)
        yield put(LoginActions.switchPrioritySuccess(response.data))

      } else {
        __DEV__ && console.log(response)
        yield put(LoginActions.switchPriorityFailure(response.data))
      }
}
export {
  loginUser,
  patchUser,
  patchProfile,
  updateLocation,
  logout,
  checkSocialLogin,
  passwordChange,
  passwordReset,
  passwordResetConfirm,
  registerUser,
  addProfilePicture,
  switchPriority
}
