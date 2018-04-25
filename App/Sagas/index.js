import { takeLatest, all } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'
import {AsyncStorage} from 'react-native'
import {getAsync} from '../Lib/StorageUtils'
/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { LoginTypes } from '../Redux/LoginRedux'
import { ChatTypes } from '../Redux/ChatRedux'
import { FriendsTypes } from '../Redux/FriendsRedux'
import { MeetMapTypes } from '../Redux/MeetMapRedux'
import { SwipeTypes } from '../Redux/SwipeRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import {
  loginUser, updateLocation, patchUser, patchProfile, registerUser,
  logout, checkSocialLogin, passwordChange, passwordReset, passwordResetConfirm
} from './LoginSagas'
import { fetchUsers, swipe } from './SwipeSagas'
import { fetchRooms } from './ChatSagas'
import { fetchFriends } from './FriendsSagas'
import { fetchMeetMapUsers } from './MeetMapSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.

const api = API.create()
/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    takeLatest(StartupTypes.STARTUP, startup,api),
    takeLatest(LoginTypes.LOGIN_REQUEST, loginUser, api),
    takeLatest(LoginTypes.LOGOUT_REQUEST, logout, api),
    takeLatest(LoginTypes.REGISTER_REQUEST, registerUser, api),
    takeLatest(LoginTypes.PATCH_USER_REQUEST, patchUser, api),
    takeLatest(LoginTypes.PATCH_PROFILE_REQUEST, patchProfile, api),
    takeLatest(LoginTypes.CHECK_SOCIAL_LOGIN_REQUEST, checkSocialLogin, api),
    takeLatest(LoginTypes.PASSWORD_CHANGE_REQUEST, passwordChange, api),
    takeLatest(LoginTypes.PASSWORD_RESET_REQUEST, passwordReset, api),
    takeLatest(LoginTypes.PASSWORD_RESET_CONFIRM_REQUEST, passwordResetConfirm, api),
    takeLatest(LoginTypes.LOCATION_REQUEST, updateLocation, api),
    takeLatest(ChatTypes.FETCH_ROOMS_REQUEST, fetchRooms,api),
    takeLatest(FriendsTypes.FETCH_FRIENDS_REQUEST, fetchFriends,api),
    takeLatest(SwipeTypes.FETCH_USERS_REQUEST, fetchUsers,api),
    takeLatest(SwipeTypes.SWIPE_REQUEST, swipe, api),
    takeLatest(MeetMapTypes.MEET_MAP_REQUEST, fetchMeetMapUsers,api)
  ]);
}
