import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import {ChatAPI} from '../Services/ChatAPI';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  fetchUsersRequest: null,
  fetchUsersSuccess: ['data'],
  fetchUsersFailure: ['error'],

  userMatchReceiptSuccess: ['data'],
  userMatchReceiptFailure: ['error'],

  deleteVotesRequest: ['data'],
  deleteVotesSuccess: ['data'],
  deleteVotesFailure: ['error'],

  swipeRequest: ['data'],
  swipeSuccess: ['data'],
  swipeFailure: ['error'],

  resetMatchSuccess: ['closingModal'],

  markMatchNotificationRead: ['data'],
  markMatchNotificationReadSuccess:['data'],
  markMatchNotificationReadSuccess: ['error'],

  markAllMatchNotificationsRead: ['data'],
  markAllMatchNotificationsReadSuccess: ['data'],
  markAllMatchNotificationsReadFailure: ['error'],

  swipeLogout: null,
  autoLogin: ['data'],
  loginSuccess: ['data'],
  checkSocialLoginSuccess: ['data'],
})

export const SwipeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  results: null,
  fetching: null,
  currentMatch: null,
  currentRoom: null,
  remainingMatches: [],
  error: null
})

/* ------------- Reducers ------------- */
// FIXME: hould all be the same name in the reducers so one call can be made
// wasn't aware this is considered an anti-pattern; I thought more control might be better but not so much
export const swipeLogout = (state,action) => state.merge(INITIAL_STATE)

export const updateMatchNotifications = (state, action) => state.merge({ remainingMatches: action.data.user ? action.data.user.match_notifications : action.data.match_notifications})

/* ##########################################
 *
 *          markMatchNotificationRead
 *        markAllMatchNotificationsRead
 *
 *  This occurs when a user profile or coinciding chat room is visited after matching
 *
 *
 *
 * ########################################## */
export const markMatchNotificationRead = (state, action) =>{
  return state.merge({
    fetching: true,
  })
}
export const markMatchNotificationReadSuccess = (state, action) =>{
  return state.merge({
    // only want to filter out the notification if the currentMatch, which is the modal was empty
    remainingMatches: state.currentMatch == null && state.remainingMatches.filter(m=>m.username===action.data.username),
    currentMatch: null,
    fetching: false,

  })
}
export const markMatchNotificationReadFailure = (state, error) =>{
  return state.merge({
    fetching: true,
    error: error.error
  })
}

export const markAllMatchNotificationsRead = (state, action) =>{
  return state.merge({
    fetching: true,
  })
}
export const markAllMatchNotificationsReadSuccess = (state, action) =>{
  return state.merge({
    currentMatch: null,
    remainingMatches: [],
    fetching: false,

  })
}
export const markAllMatchNotificationsReadFailure = (state, action) =>{
  return state.merge({
    fetching: true,

  })
}

/* ##########################################
 *
 *                swipeRequest
 *
 *  This fires when the user swipes, triggering a websocket
 *  call to notify the other use that a match occurred, then
 *  add the room to their list of rooms.
 *
 *
 * ########################################## */
export const swipeRequest = (state) => state.merge({ fetching: true })
export const swipeSuccess = (state, action) => {
  action.data.matched && ChatAPI.send({
    roomId: action.data.currentMatch.id,
    type: "USER_MATCH_RECEIPT"

  })
  return state.merge({
    fetching: false,
    matched: action.data.matched,
    mega_match: action.data.mega_match,
    currentMatch: action.data.currentMatch  ,
    remainingMatches: state.currentMatch !== null ?
      state.remainingMatches.concat(action.data.currentMatch)
      : state.remainingMatches
  })
}
export const swipeFailure = (state, error) => state.merge({ fetching: false, error: error})


/* ##########################################
 *
 *              deleteVotes
 *
 *  deletes all the votes for the user and send a
 *  websocket request to inform the UI of other users
 *
 *
 * ########################################## */
export const deleteVotesRequest = (state) => state.merge({ fetching: true })
export const deleteVotesSuccess = (state, action) => {
    ChatAPI.send({
      ...action.data,
      type:"SET_ALL_ROOMS_INACTIVE"
    })
  return state.merge({ fetching: false })
}
export const deleteVotesFailure = (state, error) => state.merge({ fetching: false, error: error})


/* ##########################################
 *
 *               fetchUsers
 *
 * Paged response of users sorted by distance
 *
 *
 * ########################################## */
export const fetchUsersRequest = (state) => state.merge({ fetching: true})
export const fetchUsersSuccess = (state, action) => state.merge({
  fetching: false,
  results: action.data.results,
  error: null
})
export const fetchUsersFailure = state => state.merge({ fetching: false, error: true, results: null })


/* ##########################################
 *
 *              userMatchReceipt
 *
 * check if the current match is empty, if it's not,
 * we add the remaining matches to an array to be consumer by the front end
 * ########################################## */
 export const userMatchReceiptSuccess = (state, action)=> state.merge({
   currentMatch: state.currentMatch == null ? action.room : state.currentMatch,
   remainingMatches: state.currentMatch !== null ? state.remainingMatches.concat(action.room): state.remainingMatches,
   success: action.success
})
export const userMatchReceiptFailure = (state, error) => state.merge({
  ...error
})

/* ##########################################
 *
 *            resetMatchSuccess
 *
 * 1) Reset the current match.
 *  - if the user is closing the Modal to continue swiping
 *    then set current match to null so the modal will not trigger to open
 *  - If there are any remaining matches, or otherwise, match notifications that were
 *    received through the websocket, we either go to the next match, or return the original
 *    state and let the user decide when they see their matches
 *
 *
 * ########################################## */
export const resetMatchSuccess = (state, action) => state.merge({
  fetching: false,
  currentMatch: action.closingModal ? null :
    state.remainingMatches.length > 0 ?
      state.remainingMatches[0]: null,
  remainingMatches: action.closingModal ?
    state.remainingMatches :
      state.remainingMatches.length > 0 ?
        state.remainingMatches.splice(0,1) : state.remainingMatches,
  mega_match: false,
  matched:false,
  success: null
});
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FETCH_USERS_REQUEST]: fetchUsersRequest,
  [Types.FETCH_USERS_SUCCESS]: fetchUsersSuccess,
  [Types.FETCH_USERS_FAILURE]: fetchUsersFailure,

  [Types.USER_MATCH_RECEIPT_SUCCESS]: userMatchReceiptSuccess,
  [Types.USER_MATCH_RECEIPT_FAILURE]: userMatchReceiptFailure,

  [Types.SWIPE_REQUEST]: swipeRequest,
  [Types.SWIPE_SUCCESS]: swipeSuccess,
  [Types.SWIPE_FAILURE]: swipeFailure,

  [Types.DELETE_VOTES_REQUEST]: deleteVotesRequest,
  [Types.DELETE_VOTES_SUCCESS]: deleteVotesSuccess,
  [Types.DELETE_VOTES_FAILURE]: deleteVotesFailure,

  [Types.RESET_MATCH_SUCCESS]: resetMatchSuccess,

  [Types.SWIPE_LOGOUT]: swipeLogout,

  [Types.MARK_MATCH_NOTIFICATION_READ]: markMatchNotificationRead,
  [Types.MARK_MATCH_NOTIFICATION_READ]: markMatchNotificationReadSuccess,
  [Types.MARK_MATCH_NOTIFICATION_READ]: markMatchNotificationReadFailure,

  [Types.MARK_ALL_MATCH_NOTIFICATIONS_READ]: markAllMatchNotificationsRead,
  [Types.MARK_ALL_MATCH_NOTIFICATIONS_READ_SUCCESS]: markAllMatchNotificationsReadSuccess,
  [Types.MARK_ALL_MATCH_NOTIFICATIONS_READ_FAILURE]: markAllMatchNotificationsReadFailure,

  [Types.AUTO_LOGIN]: updateMatchNotifications,
  [Types.LOGIN_SUCCESS]: updateMatchNotifications,
  [Types.CHECK_SOCIAL_LOGIN_SUCCESS]: updateMatchNotifications,

})
