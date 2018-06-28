import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

import { ChatAPI } from '../Services/ChatAPI';
/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  meetMapRequest: null,
  meetMapSuccess: ['data'],
  meetMapFailure: null,

  receiveRooms: ['data'],

  requestToJoin: ['data'],
  requestToJoinSuccess: ['data'],
  requestToJoinFailure: ['error'],

  acceptJoinRequest: ['data'],
  acceptJoinRequestSuccess: ['data'],
  acceptJoinRequestFailure: ['error'],

  rejectJoinRequest: ['data'],
  rejectJoinRequestSuccess: ['data'],
  rejectJoinRequestFailure: ['error'],

  createMeetMapRoom: ['data'],
  createMeetMapRoomSuccess: ['data'],
  createMeetMapRoomFailure: ['error'],

  setCurrentMeetMapRoom: ['data'],

  resetMeetMapSuccess: null,
  resetMeetMapCurrentRoom: null,
  resetMeetMapCreatedRoom: null,
})

export const MeetMapTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  next: null,
  previous: null,
  fetching: null,
  group_rooms: null,
  error: null,
  success: null,
})

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state) =>
  state.merge({ fetching: true })

// successful api lookup
export const success = (state, action) => {
  const { group_rooms } = action
  return state.merge({ fetching: false, group_rooms })
}

export const requestToJoin = (state, action)=>{
  ChatAPI.send({
    type: "REQUEST_TO_JOIN",
    requested: action.data.requested,
    message: action.data.message //TODO: let's add the ability to send video/picture/content message.... let's start with a text message. Keep it simple stupid
  })
  return state.merge({ fetching:true })
}

export const requestToJoinSuccess = (state, action)=>{
  return state.merge({
    fetching: false,
    success: action.data.success,
    group_rooms: state.group_rooms.map(
      room=> room.id === action.data.room.id ?
        action.data.room : room
    )
  })
}

export const requestToJoinFailure = (state, action) => {
  return state.merge({
    fetching: false,
    error: action.error.error
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

export const acceptJoinRequest = (state, action) => {
  ChatAPI.send({
    type: "ACCEPT_JOIN_REQUEST",
    roomId: action.data.roomId
  })
  return state.merge({ fetching: true })
}

export const acceptJoinRequestSuccess = (state, action) => {
  return state.merge({
    group_rooms: state.group_rooms.map(
      room=>room.id = action.data.room.id ?
        {...action.data.room } : room),//.sort((a,b)=>a.last_activity - b.last_activity)
    fetching: false,
    success: action.data.success,
  })
}

export const acceptJoinRequestFailure = (state, action) => {
  return state.merge({
    fetching: false,
    error: action.error.error,
  })
}

export const rejectJoinRequest = (state, action) => {
  ChatAPI.send({
    type: "REJECT_JOIN_REQUEST",
    roomId: action.data.roomId
  })
  return state.merge({ fetching: true })
}

export const rejectJoinRequestSuccess = (state, action) => {
  return state.merge({
    group_rooms: state.group_rooms.map(
      room=>room.id = action.data.room.id ?
        action.data.room : room),//.sort((a,b)=>a.last_activity - b.last_activity)
    fetching: false,
    success: action.data.success,
  })
}

export const rejectJoinRequestFailure = (state, action) => {
  return state.merge({
    fetching: false,
    error: action.error.error,
  })
}
// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, payload: null })

export const setCurrentRoom = (state, action) => state.merge({currentRoom: action.data.room});

export const resetSuccess = state => state.merge({ success: null })

export const resetCurrentRoom = state => state.merge({ currentRoom: null })

export const resetCreatedRoom = state => state.merge({ createdRoom: null })
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.MEET_MAP_REQUEST]: request,
  [Types.MEET_MAP_SUCCESS]: success,
  [Types.MEET_MAP_FAILURE]: failure,

  [Types.REQUEST_TO_JOIN]: requestToJoin,
  [Types.REQUEST_TO_JOIN_SUCCESS]: requestToJoinSuccess,
  [Types.REQUEST_TO_JOIN_FAILURE]: requestToJoinFailure,

  [Types.CREATE_MEET_MAP_ROOM]: createMeetMapRoom,
  [Types.CREATE_MEET_MAP_ROOM_SUCCESS]: createMeetMapRoomSuccess,
  [Types.CREATE_MEET_MAP_ROOM_FAILURE]: createMeetMapRoomFailure,

  [Types.ACCEPT_JOIN_REQUEST]: acceptJoinRequest,
  [Types.ACCEPT_JOIN_REQUEST_SUCCESS]: acceptJoinRequestSuccess,
  [Types.ACCEPT_JOIN_REQUEST_FAILURE]: acceptJoinRequestFailure,

  [Types.REJECT_JOIN_REQUEST]: rejectJoinRequest,
  [Types.REJECT_JOIN_REQUEST_SUCCESS]: rejectJoinRequestSuccess,
  [Types.REJECT_JOIN_REQUEST_FAILURE]: rejectJoinRequestFailure,

  [Types.RESET_MEET_MAP_SUCCESS]: resetSuccess,
  [Types.RESET_MEET_MAP_CURRENT_ROOM]: resetCurrentRoom,
  [Types.RESET_MEET_MAP_CREATED_ROOM]: resetCreatedRoom,

  [Types.SET_CURRENT_MEET_MAP_ROOM]: setCurrentRoom,

  [Types.RECEIVE_ROOMS]: success
})
