import { createReducer, createActions } from 'reduxsauce'
import { ChatAPI } from '../Services/ChatAPI'
import Immutable from 'seamless-immutable'
import { filter } from 'ramda'
import { startsWith } from 'ramdasauce'
import _ from 'lodash'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  searchRooms: ['searchTerm'],

  cancelRoomsSearch: null,

  fetchRoomsRequest: null,
  fetchRoomsSuccess: ['data'],
  fetchRoomsFailure: null,

  chatLogin: ['username'],

  receiveRooms: ['data'],

  sendMessage: ['roomId', 'username', 'message', 'rModel', 'mModel'],

  createFileMessage: ['data'],
  createFileMessageSuccess: ['data'],
  createFileMessageFailure: ['error'],

  receiveMessages: ['data'],

  setRoomInactiveInterval: ['roomId', 'username', 'WS', 'both'],

  sendRoomActive: ['roomId', 'username', 'rModel'],

  setRoomInactive: null,

  setRoomActive: null,

  setRoomContent: ['roomId','content'],

  setRoomIsTyping: ['isTyping','roomId'],

  setGroupUserIsTyping: ['isTyping','roomId', 'rModel'],

  sendRoomIsTyping: ['isTyping', 'roomId', 'rModel'],

  createChatRoom: ['users', 'rModel'],
  createChatRoomSuccess: ['data'],
  createChatRoomFailure: ['error'],

  blockUser: ['data'],
  blockUserSuccess: ['data'],
  blockUserFailure: ['error'],

  unblockUser: ['data'],
  unblockUserSuccess: ['data'],
  unblockUserFailure: ['error'],

  unmatchUser: ['data'],

  flagMessage: ['data'],
  flagMessageSuccess: ['data'],
  flagMessageFailure: ['error'],

  removeMessageFlag: ['data'],
  removeMessageFlagSuccess: ['data'],
  removeMessageFlagFailure: ['error'],

  reportUser: ['data'],
  reportUserSuccess: ['data'],
  reportUserFailure: ['error'],
  deleteChatRoomSuccess: ['data'],
  deleteChatRoomFailure: ['error'],
  loadPreviousMessages: ['roomId','username'],
  setAllRoomsInactiveSuccess: ['data'],
  chatLogout: null,
  resetRooms: null,
})

export const ChatTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  searchTerm: '',
  searching: false,
  search_rooms: null,
  group_rooms: null,
  rooms: null,
  friends: null,
  next: null,
  previous: null,
  fetching: null,
  success: null,
  error: null
})

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state) =>
  state.merge({ fetching: true})

// successful api lookup
export const success = (state, action) => {
  const { rooms, friends, group_rooms } = action
  console.log(action)
  return state.merge({ fetching: false, error: null, rooms, friends, group_rooms })
}

// Something went wrong somewhere.
export const failure = state => state.merge({ fetching: false, error: true });

export const resetRooms = state => state.merge({ rooms: [], search_rooms: [] });

export const reportSuccess = (state, action) => state.merge({
  fetching:false,
  success: action.data.success
})

export const reportFailure = (state, error) => state.merge({
  fetching:false,
  error: error.errors == null ? error.error : error.errors
})

export const flagMessageSuccess = (state, action) => state.merge({
  fetching:false,
  success: action.data.success,
  rooms: state.rooms.map(room=>room.id===action.data.roomId ?
    {...room, messages:room.messages.map(
      message=>message.id===action.data.id ? {...message, has_flagged:true}: message)}: room)
})

export const removeMessageFlagSuccess = (state, action) => state.merge({
  fetching:false,
  success: action.data.success,
  rooms: state.rooms.map(room=>room.id===action.data.roomId ?
      {...room, messages: room.messages.map(
      message=>message.id===action.data.id ? {...message, has_flagged:false}: message)}: room)
})

export const performSearch = (state, { searchTerm }) => {
  let results = state.rooms
  re = new RegExp(searchTerm , "i")
  results = state.rooms.filter(item=> item.users[0].username.match(re) !== null)
  return state.merge({ searching: true, searchTerm, search_rooms: results })
}

export const cancelSearch = (state) => state.merge({ searching:false, searchTerm: '', search_rooms: null})

export const unmatchUser = (state, action) => state.merge({ fetching: true })

export const deleteChatRoomSuccess = (state, action) => state.merge({
  fetching: false,
  rooms: rooms.filter(room => room.id !== action.data.roomId)
})
export const deleteChatRoomFailure = (state, error) => state.merge({ fetching: false, error: error.error })

export const blockUser = (state, action) => {
  ChatAPI.send({
    type: "BLOCK_USER",
    userId: action.data.userId,
    roomId: action.data.roomId
  })
  return state
}
export const blockUserSuccess = (state, action) => state.merge({
  rooms: state.rooms.map(room=>room.id === action.roomId ?
    {...room, users: room.users.map(
      user=> user.id === action.userId ?
        {...user, blocked: true} :
        user)} :
      room)
})
export const blockUserFailure = (state, error) => state.merge({ fetching: false, error: error.error})

export const unblockUser = (state, action) => {
  ChatAPI.send({
    type: "UNBLOCK_USER",
    userId: action.data.userId,
    roomId: action.data.roomId
  })
  return state
}
export const unblockUserSuccess = (state, action) => state.merge({
  rooms: state.rooms.map(room=>room.id === action.roomId ?
    {...room, users: room.users.map(
      user=> user.id === action.userId ?
        {...user, blocked: false} : user)} : room)
})
export const unblockUserFailure = (state, error) => state.merge({ fetching: false, error: error.error})

export const chatLogout = (state, action) => state.merge(INITIAL_STATE)
export const sendMessage = (state, action) => {
  ChatAPI.send({
    type:"SEND_MESSAGE",
    roomId:action.roomId,
    user:action.username,
    content:action.message.content,
    rModel: action.rModel,
    mModel: action.mModel
  })
  return state
}
export const createFileMessageSuccess = (state, action) => state.merge({fetching: false, success: action.data.success})
export const createFileMessageFailure = (state, error) => state.merge({fetching: false, error })

export const receiveMessages = (state,action) => {
  var _rooms = action.rooms;
  var _message = action.message;
  var _messages = action.messages;
  var _r_messages = [];

  if(_rooms !== undefined){
    _rooms = state.rooms.map(
    room=>{
      if(room.id === action.roomId){
       _r_messages.concat(room.messages);
       _r_messages.unshift(action.message);
       return {...room, active: true, messages: _r_messages}
      }else{ return room}
    })
  }else if(_messages !== undefined){
    _rooms = state.rooms.map(
    room=>{
        if(room.id === action.roomId){
        _r_messages = _r_messages.concat(room.messages);
        _r_messages = _r_messages.concat(_messages);
          if(action.messages.length >0 ){
            return {...room, messages: _r_messages, end:false}
          }else{ return {...room, end: true}}
        }else{return room }
    })
  }else if(_message !== undefined){
    _rooms = state.rooms.map(
    room=>{
      if(room.id === action.message.roomId){
        _r_messages = _r_messages.concat(room.messages);
        _r_messages.unshift(action.message)
        return {...room, active:true, messages: _r_messages}
       }else{ return room}
    })
  }
  return state.merge({ fetching: false, error: null, rooms: _rooms })
}

export const setRoomContent = (state, action) => state.merge({
  fetching: false,
  rooms: state.rooms.map(room =>
    room.id === action.roomId ?
      {...room, content: action.content !== "" ?
        action.content : undefined } : room )
  })

export const sendRoomIsTyping = ( state,action ) => {
  ChatAPI.send({type:"SET_ROOM_IS_TYPING", isTyping: action.isTyping, roomId: action.roomId})
  return state; // nothing to do for client
}

export const setRoomIsTyping = (state,action) =>
  state.merge({
    rooms:state.rooms.map(
      room => room.id === action.roomId ?
        { ...room, isTyping:action.isTyping, active: action.isTyping}
        : room)
  })

export const sendRoomActive = (state,action) =>{
    ChatAPI.send({
      type:"SET_ROOM_ACTIVE",
      roomId: action.roomId,
      user: action.username,
      rModel: action.rModel
    })
    return state;
  }
export const setGroupUserIsTyping = (state, action) => {
  // const currentRoom = state.group_rooms.find((el)=>{ return el.id === action.roomId}
  return state.merge({
    group_rooms: state.group_rooms.map(room => room.id === action.roomId ?
      {...room, users: users.map(
        (user) => user.username === action.user ?
          {...user, isTyping: action.isTyping, active:action.isTyping} :
          user
        )
      }
      : room)
  })
}
export const createChatRoom = (state, action) => {
  ChatAPI.send({
    type: "CREATE_CHAT_ROOM",
    ...action,
  })
  return state.merge({fetching: true})
}
export const createChatRoomSuccess = (state,action) => state.merge({ rooms: state.rooms.concat(action.room), currentRoom: action.room })
export const createChatRoomFailure = (state,action) => state.merge({ error: action.error })

export const setAllRoomsInactiveSuccess = (state, action) =>{
  const actionRoom = action.data.room;
  const stateRoom = state.rooms.find(room=>room.id===actionRoom.id);
  const stateSearchRoom = state.search_rooms.find(r=>r.id===actionRoom.id);

  if (stateRoom !== undefined){
    const searchRooms = stateSearchRoom !== undefined ? state.search_rooms.map(
      (r,idx)=>r.id===actionRoom.id ? state.rooms.splice(idx,1): r
    ) : state.search_rooms ;
    return state.merge({
      fetching:false,
      rooms: state.rooms.map(
        (room,idx) => room.id === actionRoom.id ?
          state.rooms.splice(idx, 1) : room
        ),
      search_rooms: searchRooms
    })
  }
  return state.merge({
    fetching: false,
    //TODO: sort by last_activity .sort((a,b)=>a.users[0].last_activity)
    })
}
export const setRoomActive= (state,action) =>
  state.merge({ rooms:state.rooms.map(room => room.id === action.roomId ? { ...room, active:true } : room)})

export const setRoomInactive= (state,action) =>
  state.merge({ rooms:state.rooms.map(room => room.id === action.roomId ? { ...room, active:false } : room)})

export const loadPreviousMessages = (state, action) => {
  const firstMessage = _.minBy(state.rooms.find(room=>room.id === action.roomId).messages, (m) => m.id);
  ChatAPI.send({type:"REQUEST_MESSAGES", firstMessageId:firstMessage.id, user: action.username, roomId: action.roomId })
  return state.merge({ fetching: true,
     rooms:state.rooms.map(
      room => room.id === action.roomId ?
        { ...room, loading:true} : room)
  })

}

export const setRoomInactiveInterval = (state, action) =>{
		// need to send to the websocket to update the other user's room
		// activity
		if(!action.WS) {
			 return state.merge({ rooms: state.rooms.map(
			    room=>room.id === action.roomId ? {...room, active: false}: room)
			})
		}else{
			if(action.both){
				ChatAPI.send({
					type: "SET_ROOM_INACTIVE",
					roomId:action.roomId,
					user:action.username
				});
			 return state.merge({ rooms: state.rooms.map(
			  room=>room.id === action.roomId ? {...room, active: false}: room)
			 })
			}else{
				ChatAPI.send({
					type: "SET_ROOM_INACTIVE",
					roomId: action.roomId,
					user:action.username
				});
				return state;
			}
		}
}
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SEARCH_ROOMS]: performSearch,

  [Types.CANCEL_ROOMS_SEARCH]: cancelSearch,

  [Types.RESET_ROOMS]: resetRooms,

  [Types.FETCH_ROOMS_REQUEST]: request,
  [Types.FETCH_ROOMS_SUCCESS]: success,
  [Types.FETCH_ROOMS_FAILURE]: failure,

  [Types.REPORT_USER]: request,
  [Types.REPORT_USER_SUCCESS]: reportSuccess,
  [Types.REPORT_USER_FAILURE]: reportFailure,

  [Types.CHAT_LOGIN]: request,

  [Types.RECEIVE_ROOMS]: success,

  [Types.SEND_MESSAGE]: sendMessage,

  [Types.CREATE_FILE_MESSAGE]: request,
  [Types.CREATE_FILE_MESSAGE_SUCCESS]: createFileMessageSuccess,
  [Types.CREATE_FILE_MESSAGE_FAILURE]: createFileMessageFailure,

  [Types.FLAG_MESSAGE]: request,
  [Types.FLAG_MESSAGE_SUCCESS]: flagMessageSuccess,
  [Types.FLAG_MESSAGE_FAILURE]: reportFailure,

  [Types.REMOVE_MESSAGE_FLAG]: request,
  [Types.REMOVE_MESSAGE_FLAG_SUCCESS]: removeMessageFlagSuccess,
  [Types.REMOVE_MESSAGE_FLAG_FAILURE]: reportFailure,

  [Types.RECEIVE_MESSAGES]: receiveMessages,
  //[Types.RECEIVE_MESSAGES_FAILURE]: receiveMessagesFailure,

  [Types.SET_ROOM_CONTENT]: setRoomContent,
  //[Types.SET_ROOM_CONTENT_FAILURE]: setRoomContentFailure,

  [Types.SET_ROOM_IS_TYPING]: setRoomIsTyping,

  [Types.SEND_ROOM_IS_TYPING]: sendRoomIsTyping,

  //[Types.SET_ROOM_IS_TYPING_FAILURE]: setRoomIsTypingFailure,

  [Types.CREATE_CHAT_ROOM]: createChatRoom,
  [Types.CREATE_CHAT_ROOM_SUCCESS]: createChatRoomSuccess,
  [Types.CREATE_CHAT_ROOM_FAILURE]: createChatRoomFailure,

  [Types.UNMATCH_USER]: unmatchUser,

  [Types.DELETE_CHAT_ROOM_SUCCESS]: deleteChatRoomSuccess,
  [Types.DELETE_CHAT_ROOM_FAILURE]: deleteChatRoomFailure,

  [Types.UNBLOCK_USER]: unblockUser,
  [Types.UNBLOCK_USER_SUCCESS]: unblockUserSuccess,
  [Types.UNBLOCK_USER_FAILURE]: unblockUserFailure,

  [Types.BLOCK_USER]: blockUser,
  [Types.BLOCK_USER_SUCCESS]: blockUserSuccess,
  [Types.BLOCK_USER_FAILURE]: blockUserFailure,

  [Types.SET_ROOM_ACTIVE]: setRoomActive,

  [Types.SEND_ROOM_ACTIVE]: sendRoomActive,

  [Types.SET_ROOM_INACTIVE]: setRoomInactive,

  [Types.SET_ROOM_INACTIVE_INTERVAL]: setRoomInactiveInterval,

  [Types.LOAD_PREVIOUS_MESSAGES]: loadPreviousMessages,

  [Types.CHAT_LOGOUT]: chatLogout,

})
