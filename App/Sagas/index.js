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
  logout, checkSocialLogin, passwordChange, passwordReset, passwordResetConfirm,
  addProfilePicture, switchPriority
} from './LoginSagas'
import { fetchUsers, swipe, deleteVotes } from './SwipeSagas'
import {
  unmatchUser, reportUser, fetchRooms, sendMessage, flagMessage, removeMessageFlag,
  markRoomMessageNotificationsRead
} from './ChatSagas'
import { fetchFriends } from './FriendsSagas'
import { fetchMeetMapUsers, fetchBareBoneChatUsers, markGroupRoomMessageNotificationsRead } from './MeetMapSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.

const api = API.create()
/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
try{
  yield all([
    // Startup
    takeLatest(StartupTypes.STARTUP, startup,api),

    // Login
    takeLatest(LoginTypes.LOGIN_REQUEST, loginUser, api),
    takeLatest(LoginTypes.LOGOUT_REQUEST, logout, api),
    takeLatest(LoginTypes.REGISTER_REQUEST, registerUser, api),

    // User and Profile
    takeLatest(LoginTypes.PATCH_USER_REQUEST, patchUser, api),
    takeLatest(LoginTypes.PATCH_PROFILE_REQUEST, patchProfile, api),
    takeLatest(LoginTypes.CHECK_SOCIAL_LOGIN_REQUEST, checkSocialLogin, api),
    takeLatest(LoginTypes.PASSWORD_CHANGE_REQUEST, passwordChange, api),
    takeLatest(LoginTypes.PASSWORD_RESET_REQUEST, passwordReset, api),
    takeLatest(LoginTypes.PASSWORD_RESET_CONFIRM_REQUEST, passwordResetConfirm, api),
    takeLatest(LoginTypes.ADD_PROFILE_PICTURE_REQUEST, addProfilePicture, api),
    takeLatest(LoginTypes.SWITCH_PRIORITY_REQUEST, switchPriority, api),

    // Location
    takeLatest(LoginTypes.LOCATION_REQUEST, updateLocation, api),

    // Chat
    takeLatest(ChatTypes.MARK_ROOM_MESSAGE_NOTIFICATIONS_READ, markRoomMessageNotificationsRead, api),
    takeLatest(ChatTypes.REPORT_USER, reportUser, api),
    takeLatest(ChatTypes.FLAG_MESSAGE, flagMessage, api),
    takeLatest(ChatTypes.REMOVE_MESSAGE_FLAG, removeMessageFlag, api),
    takeLatest(ChatTypes.FETCH_ROOMS_REQUEST, fetchRooms,api),
    takeLatest(ChatTypes.CREATE_FILE_MESSAGE, sendMessage, api),
    takeLatest(ChatTypes.UNMATCH_USER, unmatchUser, api),

    takeLatest(FriendsTypes.FETCH_FRIENDS_REQUEST, fetchFriends,api),

    // Swipe
    takeLatest(SwipeTypes.FETCH_USERS_REQUEST, fetchUsers ,api),
    takeLatest(SwipeTypes.SWIPE_REQUEST, swipe, api),
    takeLatest(SwipeTypes.DELETE_VOTES_REQUEST, deleteVotes, api),

    // Meet Map
    takeLatest(MeetMapTypes.MEET_MAP_REQUEST, fetchMeetMapUsers,api),
    takeLatest(MeetMapTypes.MARK_GROUP_ROOM_MESSAGE_NOTIFICATIONS_READ, markGroupRoomMessageNotificationsRead, api),
    takeLatest(MeetMapTypes.FETCH_BARE_BONE_CHAT_USERS, fetchBareBoneChatUsers,api)
  ]);
}catch(err){
  console.log(err)}
}
