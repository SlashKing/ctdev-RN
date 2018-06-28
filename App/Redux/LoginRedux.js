import { createReducer, createActions } from 'reduxsauce'
import {getAsync, setAsync} from '../Lib/StorageUtils'
import Immutable from 'seamless-immutable'
import {AsyncStorage} from 'react-native'
/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginRequest: ['username', 'password', 'store'],
  loginSuccess: ['data'],
  loginFailure: ['error'],

  registerRequest: ['username','password1', 'password2', 'email', 'birthday','latitude', 'longitude','store'],
  registerSuccess: ['data'],
  registerFailure: ['error'],

  patchUserRequest: ['data'],
  patchUserSuccess: ['data'],
  patchUserError: ['error'],

  patchProfileRequest: ['data'],
  patchProfileSuccess: ['data'],
  patchProfileError: ['error'],

  addProfilePictureRequest: ['data'],
  addProfilePictureSuccess: ['data'],
  addProfilePictureFailure: ['error'],

  switchPriorityRequest: ['data'],
  switchPrioritySuccess: ['data'],
  switchPriorityFailure: ['error'],

  checkSocialLoginRequest: ['accessToken','userId','store'],
  checkSocialLoginSuccess: ['data'],
  checkSocialLoginError: ['error'],

  passwordChangeRequest: ['data'],
  passwordChangeSuccess: ['data'],
  passwordChangeError: ['error'],

  passwordResetRequest: ['email'],
  passwordResetSuccess: ['data'],
  passwordResetError: ['error'],

  passwordResetConfirmRequest: ['new_password1', 'new_password2', 'uid', 'token'],
  passwordResetConfirmSuccess: ['data'],
  passwordResetConfirmError: ['error'],

  locationRequest: ['data'],
  locationSuccess: ['data'],
  locationError: ['error'],

  logoutRequest: ['navigation'],
  logoutSuccess: null,
  logoutFailure: ['error'],

  autoLogin: ['token','expiry','isNew','data'],

  setIsNew:['bool'],

  resetLoginSuccess: null,
})

export const LoginTypes = Types
export default Creators

/* ------------- Initial State ------------- */

/*
  get token from asyncstorage and check expiry time to determine authentication status
*/
// set isNew and isAuthenticated based on results in AsyncStorage in RootContainer componentWillMount()
export const INITIAL_STATE = Immutable({
  isNew: true,
  isAuthenticated: false,
  isSocial: false,
  currentUser: null,
  likes: null,
  expiry: null, // save expiry TODO: wrap all api calls with method to check if the expiry is nearing and make call to django to refresh JWT
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */
export const resetSuccess = state =>state.merge({ success: undefined })
// we're attempting to login
export const request = (state) => state.merge({ fetching: true })

// we've successfully logged in
export const success = (state, action) =>
  state.merge({ fetching: false,
    error: null,
    currentUser: action.data.user,
    isNew: action.data.is_new,
    expiry:action.data.token_dec.exp,
    isAuthenticated: action.data.token ? true :false
  })

// we've had a problem logging in
export const failure = (state, error) => state.merge({ fetching: false, error })
export const patchUserRequest = (state) => state.merge({fetching:true})
export const patchUserSuccess = (state, action) => state.merge({fetching:false, currentUser: action.data.user})
export const patchUserError = (state, error) => state.merge({fetching:false, error:error})

export const patchProfileRequest = (state) => state.merge({ fetching:true })
export const patchProfileSuccess = (state, action) => state.merge({fetching:false, currentUser: action.data.user})
export const patchProfileError = (state, error) => state.merge({fetching:false, error:error.data})

export const addProfilePictureRequest = (state) => state.merge({ fetching:true })
export const addProfilePictureSuccess = (state, action) => state.merge({fetching:false, currentUser: {...action.data, success: undefined}, success: action.data.success})
export const addProfilePictureError = (state, error) => state.merge({fetching:false, error:error.data})

export const switchPriorityRequest = (state) => state.merge({ fetching:true })
export const switchPrioritySuccess = (state, action) => state.merge({
  fetching:false,
  currentUser: {...action.data, success: undefined},
  success: action.data.success
})
export const switchPriorityFailure = (state, error) => state.merge({fetching:false, error:error.data})

// we're attempting to login
export const checkSocialLoginRequest = (state) => state.merge({ fetching: true })
export const checkSocialLoginSuccess = (state, action) => state.merge({
  fetching: false,
  error: null,
  expiry:action.data.token_dec.exp,
  currentUser: action.data.user,
  isNew: action.data.is_new,
  isAuthenticated: action.data.token ? true : false,
  isSocial: true
})
export const checkSocialLoginError = (state, error ) => state.merge({ fetching: false, error: error.data })

// Password Change
export const passwordChangeRequest = (state) => state.merge({ fetching: true })
export const passwordChangeSuccess = (state,action) => state.merge({ fetching:false, error:null})
export const passwordChangeError = (state,error) => state.merge({ fetching:false, error:error.data})

// Password Reset
export const passwordResetRequest = (state) => state.merge({ fetching: true })
export const passwordResetSuccess =(state, action) => state.merge({ fetching:false, error:null})
export const passwordResetError =(state, error) => state.merge({ fetching:false, error:error.data})

// Password Reset Confirm
export const passwordResetConfirmRequest =(state)=> state.merge({ fetching: true })
export const passwordResetConfirmSuccess =(state,action)=> state.merge({ fetching:false, error:null})
export const passwordResetConfirmError =(state,error)=> state.merge({ fetching:false, error:error.data})

// we've logged out, reset the state, fire off a saga to remove AsyncStorage tokens and expiry time
export const logoutRequest = (state) => state.merge({fetching:true})
export const logoutSuccess = (state,action) => state.merge(INITIAL_STATE)
export const logoutFailure = (state,error) => state.merge({fetching:false, error})

// startup saga invoked autoLogin
export const autoLogin = (state,action) =>state.merge({
  currentUser:action.data,
  expiry:action.expiry,
  isAuthenticated: action.token ? true : false,
  isNew: action.isNew === 'false' ? false : true
})

export const setIsNew = (state,action) =>state.merge({isNew:action.bool})
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_REQUEST]: request,
  [Types.LOGIN_SUCCESS]: success,
  [Types.LOGIN_FAILURE]: failure,

  [Types.REGISTER_REQUEST]: request,
  [Types.REGISTER_SUCCESS]: success,
  [Types.REGISTER_FAILURE]: failure,

  [Types.PATCH_USER_REQUEST]: patchUserRequest,
  [Types.PATCH_USER_SUCCESS]: patchUserRequest,
  [Types.PATCH_USER_ERROR]: patchUserError,

  [Types.PATCH_PROFILE_REQUEST]: patchProfileRequest,
  [Types.PATCH_PROFILE_SUCCESS]: patchProfileSuccess,
  [Types.PATCH_PROFILE_ERROR]: patchProfileError,

  [Types.ADD_PROFILE_PICTURE_REQUEST]: addProfilePictureRequest,
  [Types.ADD_PROFILE_PICTURE_SUCCESS]: addProfilePictureSuccess,
  [Types.ADD_PROFILE_PICTURE_FAILURE]: addProfilePictureError,

  [Types.SWITCH_PRIORITY_REQUEST]: switchPriorityRequest,
  [Types.SWITCH_PRIORITY_SUCCESS]: switchPrioritySuccess,
  [Types.SWITCH_PRIORITY_FAILURE]: switchPriorityFailure,

  [Types.CHECK_SOCIAL_LOGIN_REQUEST]: checkSocialLoginRequest,
  [Types.CHECK_SOCIAL_LOGIN_SUCCESS]: checkSocialLoginSuccess,
  [Types.CHECK_SOCIAL_LOGIN_ERROR]: checkSocialLoginError,

  [Types.PASSWORD_CHANGE_REQUEST]: passwordChangeRequest,
  [Types.PASSWORD_CHANGE_SUCCESS]: passwordChangeSuccess,
  [Types.PASSWORD_CHANGE_ERROR]: passwordChangeError,

  [Types.PASSWORD_RESET_REQUEST]: passwordResetRequest,
  [Types.PASSWORD_RESET_SUCCESS]: passwordResetSuccess,
  [Types.PASSWORD_RESET_ERROR]: passwordResetError,

  [Types.PASSWORD_RESET_CONFIRM_REQUEST]: passwordResetConfirmRequest,
  [Types.PASSWORD_RESET_CONFIRM_SUCCESS]: passwordResetConfirmSuccess,
  [Types.PASSWORD_RESET_CONFIRM_ERROR]: passwordResetConfirmError,

  [Types.LOCATION_REQUEST]: patchProfileRequest,

  [Types.LOCATION_SUCCESS]: patchProfileSuccess,

  [Types.LOCATION_ERROR]: patchProfileError,

  [Types.LOGOUT_REQUEST]: logoutRequest,
  [Types.LOGOUT_SUCCESS]: logoutSuccess,
  [Types.LOGOUT_FAILURE]: logoutFailure,

  [Types.AUTO_LOGIN] : autoLogin,

  [Types.SET_IS_NEW] : setIsNew,

  [Types.RESET_LOGIN_SUCCESS] : resetSuccess,
})

/* ------------- Selectors ------------- */

// Is the current user logged in?
export function * isLoggedIn (loginState) {
  let token = yield AsyncStorage.getItem('@USER_STORE:token')
  //console.log(token)
  return token

}
/* Check whether the user has signed up already */
export function * isNew (loginState) {
  let isNew = yield AsyncStorage.getItem('@USER_STORE:isNew')
  //console.log(isNew)
  return isNew

}
/* Check whether the user has signed up already */
export function * asyncExpiry (loginState) {
  let expiry = yield AsyncStorage.getItem('@USER_STORE:expiry')
  //console.log(expiry)
  return expiry

}
