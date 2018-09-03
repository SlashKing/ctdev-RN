import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import {receiveMessages, cancelRoomsSearch, reportSuccess, reportFailure, flagMessageSuccess, flagMessageFailure,
        removeMessageFlagSuccess, removeMessageFlagFailure, performSearch, createFileMessageSuccess, createFileMessageFailure,
        setRoomContent, setRoomIsTyping, setRoomActive, setRoomInactive, setRoomInactiveInterval, markRoomMessageNotificationsReadSuccess,
        markRoomMessageNotificationsReadFailure
} from './ChatRedux'
import { ChatAPI } from '../Services/ChatAPI';
import { _isGroup } from '../Lib/ChatAPIUtils'
/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  meetMapRequest: null,
  meetMapSuccess: ['data'],
  meetMapFailure: null,

  fetchBareBoneChatUsers: ['data'],
  fetchBareBoneChatUsersSuccess: ['data'],
  fetchBareBoneChatUsersFailure: ['error'],

  requestToJoin: ['data'],
  requestToJoinSuccess: ['data'],
  requestToJoinFailure: ['error'],

  acceptJoinRequest: ['roomId', 'jrId'],
  acceptJoinRequestSuccess: ['data'],
  acceptJoinRequestFailure: ['error'],

  cancelJoinRequest: ['roomId', 'jrId'],
  cancelJoinRequestSuccess: ['data'],
  cancelJoinRequestFailure: ['error'],

  rejectJoinRequest: ['roomId', 'jrId'],
  rejectJoinRequestSuccess: ['data'],
  rejectJoinRequestFailure: ['error'],

  createMeetMapRoom: ['data'],
  createMeetMapRoomSuccess: ['data'],
  createMeetMapRoomFailure: ['error'],

  setCurrentMeetMapRoom: ['data'],
  setCurrentMeetMapRoomSuccess: ['data'],

  setCurrentJoinRequest: ['data'],
  setCurrentJoinRequestSuccess: ['data'],

  setCurrentRequestToJoin: ['data'],
  setCurrentRequestToJoinSuccess: ['data'],

  resetMeetMapSuccess: null,
  resetMeetMapCurrentRoom: null,
  resetMeetMapCreatedRoom: null,
  resetCurrentRequestToJoin: null,
  resetCurrentJoinRequest: null,

  // login

  // chat

  receiveRooms: ['data'],

  receiveMessages: ['data'],

  flagMessageSuccess: ['data'],
  flagMessageFailure: ['error'],

  removeMessageFlagSuccess: ['data'],
  removeMessageFlagFailure: ['error'],

  mmSearchRooms: ['searchTerm', 'rModel'],
  mmCancelRoomsSearch: null,
  mmResetRooms: null,

  reportSuccess: ['data'],
  reportFailure: ['error'],

  blockUserSuccess: ['data'],
  blockUserFailure: ['error'],

  unblockUserSuccess: ['data'],
  unblockUserFailure: ['error'],

  unmatchUserSuccess: ['data'],
  unmatchUserFailure: ['error'],

  createFileMessageSuccess: ['data'],
  createFileMessageFailure: ['error'],

  setRoomContent: ['data'],
  setRoomIsTyping: ['data'],
  setRoomActive: ['data'],
  setRoomInactive: ['data'],
  setRoomInactiveInterval: ['data'],

  loadPreviousMessages: ['roomId', 'username', 'rModel', 'mModel'],

  markGroupRoomMessageNotificationsRead: ['roomId', 'rModel'],
  markGroupRoomMessageNotificationsReadSuccess: ['data'],
  markGroupRoomMessageNotificationsReadFailure: ['error'],

})

export const MeetMapTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  next: null,
  previous: null,
  fetching: null,
  group_rooms: [],
  rooms:[], // ***HACK*** here so the .map function in overloaded function doesn't break
  // When requesting users to join a room, a list of possibles are fetched from the server and stored here
  currentRequestableUsers: [],
  currentRequestApprovals: [],
  currentRoom: null,
  currentRequestToJoin: null,
  currentJoinRequest: null,
  createdRoom: null,
  error: null,
  success: null,
  notificationsCount: 0
})

/* ------------- Reducers ------------- */
// request the data from an api
export const request = (state) =>
  state.merge({ fetching: true })

// anytime the CurrentUserSerializer is accessed from the server, this is hit
export const success = (state, { group_rooms, g_room_notifications_sum, username }) => {
  //const { group_rooms, g_room_notifications_sum, username } = action
  let currentRequestApprovals = []

  // for each room, check the join requests for those that would be in need of approval
  // requirements: (!admin && requested.username === currentUser) || (admin && requester.username === curentUser)
  group_rooms.forEach(
    item=>{
      item.join_requests.forEach(
        j=>{
          if((j.requested.username===username && !j.admin)||(j.requester.username===username)){
            currentRequestApprovals.push(j)
          }
      })
   })
  return state.merge({
    fetching: false,
    group_rooms,
    currentRequestApprovals,
    notificationsCount: g_room_notifications_sum == null ? state.notificationsCount : g_room_notifications_sum
  })
}

export const failure = state =>
  state.merge({ fetching: false, error: true, payload: null })
export const fetchBareBoneChatUsersSuccess = (state, action)=>state.merge({
  fetching:false,
  currentRequestableUsers: action.data
})

export const fetchBareBoneChatUsersFailure = (state, action)=>state.merge({
  fetching:false,
  error: action.data.error
})

export const requestToJoin = (state, action)=>{
  ChatAPI.send({
    type: "REQUEST_TO_JOIN",
    roomId: action.data.roomId,
    sendToUsers: action.data.sendToUsers,
    message: action.data.message //TODO: let's add the ability to send video/picture/content message.... let's start with a text message. Keep it simple stupid
  })
  return state.merge({ fetching:true })
}

export const requestToJoinSuccess = (state, action)=>{
  return state.merge({
    fetching: false,
    success: action.success,
    group_rooms: state.group_rooms.map(
      room=> room.id === action.room.id ?
        action.room : room
    ),
    currentRequestToJoin: action.room,
    currentRequestableUsers: state.currentRequestableUsers.filter(
      u=>action.room.users.some(uu=>uu.id === u.key) ? false:true // The FlatList component uses key instead of id, RIP.
     )
  })
}

export const requestToJoinFailure = (state, action) => {
  return state.merge({
    fetching: false,
    error: action.error
  })
}

export const createMeetMapRoom = (state, action)=>{
  ChatAPI.send({
    type: "CREATE_MEET_MAP_ROOM",
    ...action.data,
    rModel: "GroupRoom"
  })
  return state.merge({ fetching:true })
}

export const createMeetMapRoomSuccess = (state, action) => {
  return state.merge({
    group_rooms: state.group_rooms.concat(action.room),//.sort((a,b)=>a.last_activity - b.last_activity)
    createdRoom:action.room,
    fetching: false,
    success: action.success,
  })
}

export const createMeetMapRoomFailure = (state, action) => {
  return state.merge({
    fetching: false,
    error: action.error,
  })
}

export const cancelJoinRequest = (state, action) => {
  ChatAPI.send({
    ...action,
    type: "CANCEL_JOIN_REQUEST",
  })
  return state.merge({ fetching: true })
}


/* ########################################
 * cancelJoinRequest
 *
 *
 * ######################################## */
export const cancelJoinRequestSuccess = (state, action) => {
  return state.merge({
    group_rooms: state.group_rooms.map(
      room=>room.id === action.room.id ?
        action.room : room),//.sort((a,b)=>a.last_activity - b.last_activity)
    fetching: false,
    currentRequestToJoin: action.room,
    success: action.success,
  })
}

export const cancelJoinRequestFailure = (state, action) => {
  return state.merge({
    fetching: false,
    error: action.error,
  })
}


/* ########################################
 * acceptJoinRequest
 *
 *
 * ######################################## */

export const acceptJoinRequest = (state, action) => {
  ChatAPI.send({
    ...action,
    type: "ACCEPT_JOIN_REQUEST",
  })
  return state.merge({ fetching: true })
}

export const acceptJoinRequestSuccess = (state, action) => {
  return state.merge({
    group_rooms: state.group_rooms.map(
      room=>room.id === action.room.id ?
        action.room : room),//.sort((a,b)=>a.last_activity - b.last_activity)
    fetching: false,
    currentRequestToJoin: action.room,
    success: action.success,
  })
}

export const acceptJoinRequestFailure = (state, action) => {
  return state.merge({
    fetching: false,
    error: action.error,
  })
}


/* ########################################
 * rejectJoinRequest
 *
 *
 * ######################################## */
export const rejectJoinRequest = (state, action) => {
  ChatAPI.send({
    ...action,
    type: "REJECT_JOIN_REQUEST"
  })
  return state.merge({ fetching: true })
}

export const rejectJoinRequestSuccess = (state, action) => {
  return state.merge({
    group_rooms: state.group_rooms.map(
      room=>room.id === action.data.room.id ?
        action.data.room : room),//.sort((a,b)=>a.last_activity - b.last_activity)
    fetching: false,
    currentRequestToJoin: action.room,
    success: action.data.success,
  })
}

export const rejectJoinRequestFailure = (state, action) => {
  return state.merge({
    fetching: false,
    error: action.error.error,
  })
}

export const setCurrentRoom = (state, action) => state.merge({currentRoom: action.data.room});

export const setCurrentRequestToJoin = (state, action) => state.merge({
  currentRequestToJoin: action.data.room
})

export const setCurrentJoinRequest = (state, action) => state.merge({
  currentJoinRequest: action.data.room
})

export const resetSuccess = state => state.merge({ success: null })

export const resetCurrentRoom = state => state.merge({ currentRoom: null })

export const resetCreatedRoom = state => state.merge({ createdRoom: null })

export const resetCurrentRequestToJoin = state => state.merge({ currentRequestToJoin: null })

export const resetCurrentJoinRequest = state => state.merge({ currentJoinRequest: null })

export const receiveGroupMessages = (state, action)=> {
  const isSingle = action.message == null ? false : true;
  const isGroup = _isGroup(action.rModel);
  if(isGroup){
    state = receiveMessages(state, action, isSingle)
    return state.merge({ fetching: false, notificationsCount: (isGroup && action.recipient) ? state.noticationsCount +=1 : state.notificationsCount })
  }
  return state;
}

export const mmUnmatchUserSuccess = (state, action) => unmatchUserSuccess(state, action)
export const mmUnmatchUserFailure = (state, error) => unmatchUserFailure(state, error)

export const mmUnblockUserSuccess = (state, action) => unblockUserSuccess(state, action)
export const mmUnblockUserFailure = (state, error) => unblockUserFailure(state, error)

export const mmBlockUserSuccess = (state, action) => blockUserSuccess(state, action)
export const mmBlockUserFailure = (state, error) => blockUserFailure(state, error)

export const mmFlagMessageSuccess = (state, action) => flagMessageSuccess(state, action)
export const mmFlagMessageFailure = (state, error) => flagMessageFailure(state, error)

export const mmRemoveMessageFlagSuccess = (state, action) => removeMessageFlagSuccess(state, action)
export const mmRemoveMessageFlagFailure = (state, error) => removeMessageFlagFailure(state, error)

export const mmCreateFileMessageSuccess = (state, action) => createFileMessageSuccess(state, action)
export const mmCreateFileMessageFailure= (state, error) => createFileMessageSuccess(state, error)

export const mmSetRoomInactive = (state, action) => setRoomInactive(state, action)
export const mmSetRoomActive = (state, action) => setRoomActive(state, action)
export const mmSetRoomContent = (state, action) => setRoomContent(state, action)
export const mmSetRoomIsTyping = (state, action) => setRoomIsTyping(state, action)
export const mmSetRoomInactiveInterval = (state, action) => setRoomInactiveInterval(state, action)

export const mmPerformSearch = (state, {searchTerm}) => {
  // filter by room title/name
  // TODO: filter rooms with username as well
  re = new RegExp(searchTerm , "i") // simple regexp that searches for the username in the search term (case insensitive)
  //results = state.rooms.filter(item=> item.users[0].username.match(re) !== null)
  return state.merge({ searching: true, searchTerm, search_rooms: state.group_rooms.filter(item=> item.name.match(re) !== null) })
}
export const mmResetRooms = (state, action) => state.merge({ group_rooms: [], search_rooms: []})
export const mmCancelRoomsSearch = (state, action) => state.merge({
  searching: false,
  searchTerm: '',
  search_rooms: null
})


export const mmReportSuccess = (state, action) => reportSuccess(state, action)
export const mmReportFailure = (state, error) => reportFailure(state, error)

export const mmLoadPreviousMessages = (state, action) =>loadPreviousMessages(state, action)

export const markGroupRoomMessageNotificationsReadSuccess = (state, action) =>{
  let currentRoomNotificationCount = 0;
  const results = state.rooms.map(r=>{
    if(r.id===action.data.roomId){
      currentRoomNotificationCount = r.notifications_count;
      return {...r, notifications_count: 0 }
    }else{ return r }
  });

  // deduct the notifications of current room from the state notifications
  return state.merge({
    success: action.data.success,
    group_rooms: results,
    notificationsCount: state.notificationsCount - currentRoomNotificationCount
  })
}
export const markGroupRoomMessageNotificationsReadFailure = (state, error) => markRoomMessageNotificationsReadFailure(state, error)

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {

  [Types.MEET_MAP_REQUEST]: request,
  [Types.MEET_MAP_SUCCESS]: success,
  [Types.MEET_MAP_FAILURE]: failure,

  [Types.FETCH_BARE_BONE_CHAT_USERS]: request,
  [Types.FETCH_BARE_BONE_CHAT_USERS_SUCCESS]: fetchBareBoneChatUsersSuccess,
  [Types.FETCH_BARE_BONE_CHAT_USERS_FAILURE]: fetchBareBoneChatUsersFailure,

  [Types.REQUEST_TO_JOIN]: requestToJoin,
  [Types.REQUEST_TO_JOIN_SUCCESS]: requestToJoinSuccess,
  [Types.REQUEST_TO_JOIN_FAILURE]: requestToJoinFailure,

  [Types.CREATE_MEET_MAP_ROOM]: createMeetMapRoom,
  [Types.CREATE_MEET_MAP_ROOM_SUCCESS]: createMeetMapRoomSuccess,
  [Types.CREATE_MEET_MAP_ROOM_FAILURE]: createMeetMapRoomFailure,

  [Types.ACCEPT_JOIN_REQUEST]: acceptJoinRequest,
  [Types.ACCEPT_JOIN_REQUEST_SUCCESS]: acceptJoinRequestSuccess,
  [Types.ACCEPT_JOIN_REQUEST_FAILURE]: acceptJoinRequestFailure,

  [Types.CANCEL_JOIN_REQUEST]: cancelJoinRequest,
  [Types.CANCEL_JOIN_REQUEST_SUCCESS]: cancelJoinRequestSuccess,
  [Types.CANCEL_JOIN_REQUEST_FAILURE]: cancelJoinRequestFailure,

  [Types.REJECT_JOIN_REQUEST]: rejectJoinRequest,
  [Types.REJECT_JOIN_REQUEST_SUCCESS]: rejectJoinRequestSuccess,
  [Types.REJECT_JOIN_REQUEST_FAILURE]: rejectJoinRequestFailure,

  [Types.RESET_MEET_MAP_SUCCESS]: resetSuccess,

  [Types.RESET_MEET_MAP_CURRENT_ROOM]: resetCurrentRoom,

  [Types.RESET_MEET_MAP_CREATED_ROOM]: resetCreatedRoom,

  [Types.RESET_CURRENT_REQUEST_TO_JOIN]: resetCurrentRequestToJoin,

  [Types.RESET_CURRENT_JOIN_REQUEST]: resetCurrentJoinRequest,

  [Types.SET_CURRENT_MEET_MAP_ROOM]: setCurrentRoom,

  [Types.SET_CURRENT_REQUEST_TO_JOIN]: setCurrentRequestToJoin,

  [Types.SET_CURRENT_JOIN_REQUEST]: setCurrentJoinRequest,

  /* ###############  CHAT  ############### */
  [Types.RECEIVE_ROOMS]: success,

  [Types.RECEIVE_MESSAGES]: receiveGroupMessages,

  [Types.MARK_GROUP_ROOM_MESSAGE_NOTIFICATIONS_READ]: request,
  [Types.MARK_GROUP_ROOM_MESSAGE_NOTIFICATIONS_READ_SUCCESS]: markGroupRoomMessageNotificationsReadSuccess,
  [Types.MARK_GROUP_ROOM_MESSAGE_NOTIFICATIONS_READ_FAILURE]: markGroupRoomMessageNotificationsReadFailure,

  [Types.UNMATCH_USER_SUCCESS] : mmUnmatchUserSuccess,
  [Types.UNMATCH_USER_FAILURE] : mmUnmatchUserFailure,

  [Types.UNBLOCK_USER_SUCCESS] : mmUnblockUserSuccess,
  [Types.UNBLOCK_USER_FAILURE] : mmUnblockUserFailure,

  [Types.REPORT_SUCCESS] : mmReportSuccess,
  [Types.REPORT_FAILURE] : mmReportFailure,

  [Types.BLOCK_USER_SUCCESS] : mmBlockUserSuccess,
  [Types.BLOCK_USER_FAILURE] : mmBlockUserFailure,

  [Types.FLAG_MESSAGE_SUCCESS] : mmFlagMessageSuccess,
  [Types.FLAG_MESSAGE_FAILURE] : mmFlagMessageFailure,

  [Types.REMOVE_MESSAGE_FLAG_SUCCESS] : mmRemoveMessageFlagSuccess,
  [Types.REMOVE_MESSAGE_FLAG_FAILURE] : mmRemoveMessageFlagFailure,

  [Types.CREATE_FILE_MESSAGE_SUCCESS] : mmCreateFileMessageSuccess,
  [Types.CREATE_FILE_MESSAGE_FAILURE] : mmCreateFileMessageFailure,

  [Types.SET_ROOM_CONTENT]: mmSetRoomContent,
  [Types.SET_ROOM_ACTIVE] : mmSetRoomActive,
  [Types.SET_ROOM_INACTIVE] : mmSetRoomInactive,
  [Types.SET_ROOM_INACTIVE_INTERVAL] : mmSetRoomInactiveInterval,
  [Types.SET_ROOM_IS_TYPING] : mmSetRoomIsTyping,

  [Types.MM_RESET_ROOMS] : mmResetRooms,
  [Types.MM_SEARCH_ROOMS] : mmPerformSearch ,
  [Types.MM_CANCEL_ROOMS_SEARCH] : mmCancelRoomsSearch ,

  [Types.LOAD_PREVIOUS_MESSAGES] : mmLoadPreviousMessages,
})
