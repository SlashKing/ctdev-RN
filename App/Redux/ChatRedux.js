import { createReducer, createActions } from 'reduxsauce'
import { ChatAPI } from '../Services/ChatAPI'
import Immutable from 'seamless-immutable'
import { filter } from 'ramda'
import { startsWith } from 'ramdasauce'
import { _isGroup } from '../Lib/ChatAPIUtils'
import _ from 'lodash'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  searchRooms: ['searchTerm', 'rModel'],

  cancelRoomsSearch: null,

  fetchRoomsRequest: null,
  fetchRoomsSuccess: ['data'],
  fetchRoomsFailure: null,

  chatLogin: ['username'],
  //chatLoginSuccess: ['data'], // receive chat username for storage

  receiveRooms: ['data'],

  sendMessage: ['roomId', 'username', 'content', 'rModel', 'mModel'],

  createFileMessage: ['data'],
  createFileMessageSuccess: ['data'],
  createFileMessageFailure: ['error'],

  receiveMessages: ['data'],

  setRoomInactiveInterval: ['roomId', 'user', 'WS', 'both','rModel'],

  sendRoomActive: ['roomId', 'username', 'rModel'],

  setRoomInactive: ['roomId', 'userId', 'rModel'],

  setRoomActive: null,

  setRoomContent: ['roomId','content', 'rModel'],

  setRoomIsTyping: ['isTyping','roomId', 'rModel'],

  setGroupUserIsTyping: ['isTyping','roomId', 'rModel'],

  sendRoomIsTyping: ['isTyping', 'roomId', 'rModel'],

  createChatRoom: ['users', 'rModel'],
  createChatRoomSuccess: ['data'],
  createChatRoomFailure: ['error'],

  blockUser: ['roomId', 'userId', 'uModel'],
  blockUserSuccess: ['data'],
  blockUserFailure: ['error'],

  unblockUser: ['roomId', 'userId', 'uModel'],
  unblockUserSuccess: ['data'],
  unblockUserFailure: ['error'],

  unmatchUser: ['roomId', 'userId', 'uModel'],
  unmatchUserSuccess: ['data'],
  unmatchUserFailure: ['error'],

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

  loadPreviousMessages: ['roomId', 'username', 'rModel', 'mModel'],

  setAllRoomsInactiveSuccess: ['data'],

  chatLogout: null,
  resetRooms: null,

  markRoomMessageNotificationsRead: ['roomId'],
  markRoomMessageNotificationsReadSuccess: ['data'],
  markRoomMessageNotificationsReadFailure: ['error'],
})

export const ChatTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  searchTerm: '',
  searching: false,
  search_rooms: null,
  group_rooms: [], // don't actually use these here, most of the chat actions are inherited in the meet map
  rooms: null,
  friends: null,
  next: null,
  previous: null,
  fetching: null,
  success: null,
  error: null,
  notificationsCount: 0,
  groupNotificationsCount: 0,// also redundant. Chat and MeetMap may need refactored or a new architecture considered
})

/* ------------- Reducers ------------- */
export const markRoomMessageNotificationsReadSuccess = (state, action) =>{
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
    rooms: results,
    notificationsCount: state.notificationsCount - currentRoomNotificationCount
  })
}

export const markRoomMessageNotificationsReadFailure = (state, error) => state.merge({
  fetching: false,
  error: {...error}
})



// request the data from an api
export const request = (state) =>
  state.merge({ fetching: true})

// successful api lookup
export const success = (state, action) => {
  const { rooms, friends, room_notifications_sum } = action
  return state.merge({
    fetching: false,
    error: null,
    rooms,
    friends,
    notificationsCount: room_notifications_sum == null ? state.notificationsCount : room_notifications_sum
  })
}

//export const chatLoginSuccess = (state, action) => state.merge({ username: action.user})

// Something went wrong somewhere.
export const failure = state => state.merge({ fetching: false, error: true });


/* ################################
 *  resetRooms
 *
 *
 ^ ############################### */
export const resetRooms = state => state.merge({ rooms: [], search_rooms: [] });


/* ################################
 *  report | flagMessage | removeFlagMessage
 *
 *
 ^ ############################### */
export const reportSuccess = (state, action) => state.merge({
  fetching:false,
  success: action.data.success
})

export const reportFailure = (state, error) => state.merge({
  fetching:false,
  error: error.errors == null ? error.error : error.errors
})

export const flagMessageSuccess = (state, action) => {
  const isGroup = _isGroup(action.data.rModel)
  let results = isGroup ? state.group_rooms : state.rooms;
  results = results.map(
    room=>room.id===action.data.roomId ?
      {...room, messages: room.messages.map(
        message=>message.id===action.data.id ?
         {...message, has_flagged: true}: message
      )}: room
  )

  return state.merge({
    fetching:false,
    success: action.data.success,
    rooms: isGroup ? state.rooms: results,
    group_rooms: isGroup ? results : state.group_rooms
  })
}

export const removeMessageFlagSuccess = (state, action) => {
  const isGroup = _isGroup(action.data.rModel)
  let results = isGroup ? state.group_rooms : state.rooms;
  results = results.map(
    room=>room.id===action.data.roomId ?
      {...room, messages: room.messages.map(
        message=>message.id===action.data.id ?
         {...message, has_flagged: false}: message
      )}: room
  )

  return state.merge({
    fetching:false,
    success: action.data.success,
    rooms: isGroup ? state.rooms: results,
    group_rooms: isGroup ? results : state.group_rooms
  })
}


/* ################################
 *  performSearch | cancelSearch
 *
 *
 ^ ############################### */
export const performSearch = (state, { searchTerm }) => {
  //const isGroup = _isGroup(action.rModel)
  //let results = isGroup ? state.group_rooms : state.rooms;
  re = new RegExp(searchTerm , "i") // simple regexp that searches for the username in the search term (case insensitive)
  //results = state.rooms.filter(item=> item.users[0].username.match(re) !== null)
  return state.merge({ searching: true, searchTerm, search_rooms: state.rooms.filter(item=> item.users[0].username.match(re) !== null) })
}

export const cancelSearch = (state) => {
  //const isGroup = _isGroup(action.rModel)
  return state.merge({
    searching:false,
    searchTerm: '',
    search_rooms: null,
  })
}

/* ################################
 *  unmatchUser
 *
 *  ChatAPI call handled in ChatSagas. Find the room and remove it from the result set
 ^ ############################### */
export const unmatchUser = (state, action) => {
  //ChatAPI.send({
  //  ...action,
  //  type: "UNMATCH_USER"
 // }) /*** this is handled using a saga
  return state.merge({ fetching: true })
}

export const unmatchUserSuccess = (state, action) => {
  const isGroup = isGroup(action.rModel)
  let results = isGroup ? state.group_rooms : state.rooms;
  results = results.filter(r=>r.id===action.roomId);
  return state.merge({
    success: action.success,
    fetching: false,
    rooms: isGroup ? state.rooms : results,
    group_rooms: isGroup ? results : state.group_rooms
  })
}

export const unmatchUserFailure = (state, error) => state.merge({
  fetching: false,
  error: error.error
})


/* ################################
 *  deleteChatRoom
 *
 *
 ^ ############################### */
export const deleteChatRoomSuccess = (state, action) => {
  const isGroup = _isGroup(action.rModel)
  let results = isGroup ? state.group_rooms : state.rooms;
  results = results.filter(room => room.id !== action.data.roomId)
  return state.merge({
    fetching:false,
    success: action.success,
    rooms: isGroup ? state.rooms : results,
    group_rooms: isGroup ? results : state.group_rooms
  })
 }

export const deleteChatRoomFailure = (state, error) => state.merge({
  fetching: false,
  error: error.error
})


/* ################################
 *  blockUser
 *
 *
 ^ ############################### */
export const blockUser = (state, action) => {
  ChatAPI.send({
    ...action,
    type: "BLOCK_USER",
  })
  return state.merge({fetching:true})
}

export const blockUserSuccess = (state, action) => {
  const isGroup = _isGroup(action.rModel)
  let results = isGroup ? state.group_rooms : state.rooms;
  results = results.map(room=>room.id === action.roomId ?
    {...room, users: room.users.map(
      user=> user.id === action.userId ?
        {...user, blocked: true} :
        user)} :
      room)

  return state.merge({
    fetching:false,
    success: action.success,
    rooms: isGroup ? state.rooms : results,
    group_rooms: isGroup ? results : state.group_rooms
  })
 }

export const blockUserFailure = (state, error) => state.merge({
  fetching: false,
  error: error.error
})


/* ################################
 *  unblockUser
 *
 *
 ^ ############################### */
export const unblockUser = (state, action) => {
  ChatAPI.send({
    ...action,
    type: "UNBLOCK_USER",
  })
  return state.merge({ fetching:true })
}

export const unblockUserSuccess = (state, action) => {
  const isGroup = _isGroup(action.rModel)
  let results = isGroup ? state.group_rooms : state.rooms;
  results = results.map(
    room=>room.id === action.roomId ?
      {...room, users: room.users.map(
        user=> user.id === action.userId ?
          {...user, blocked: false} : user
      )}
    : room
  )

  return state.merge({
    fetching:false,
    success: action.success,
    rooms: isGroup? state.rooms : results,
    group_rooms: isGroup ? results : state.group_rooms
  })
}

export const unblockUserFailure = (state, error) => state.merge({
  fetching: false,
  error: error.error
})


/* ################################
 *  chatLogout
 *
 *
 ^ ############################### */
export const chatLogout = (state, action) => state.merge(INITIAL_STATE)


/* ################################
 *  sendMessage
 *
 *
 ^ ############################### */
export const sendMessage = (state, action) => {
  ChatAPI.send({
    ...action,
    type:"SEND_MESSAGE",
  })
  return state
}


/* ################################
 *  createFileMessage
 *
 *
 ^ ############################### */
export const createFileMessageSuccess = (state, action) => state.merge({
  fetching: false, success: action.data.success
})

export const createFileMessageFailure = (state, error) => state.merge({
  fetching: false,
  error
})


/* ################################
 *  receiveMessages
 *
 *
 ^ ############################### */
export const receiveMessages = (state,action, isSingle=false) => {
  let _rooms = action.rooms;
  let _message = action.message;
  let _messages = action.messages;
  let _r_messages = [];
  let singleMessage = isSingle;
  const isGroup = _isGroup(action.rModel)
  let stateRooms = isGroup ? state.group_rooms : state.rooms

  if(_rooms !== undefined){ // rooms and a message passed that need to be added to the top? Weird
    stateRooms = stateRooms.map(
    room=>{
      if(room.id === action.roomId){
       _r_messages.concat(room.messages);
       _r_messages.unshift(action.message);
       return {...room, active: true, messages: _r_messages}
      }else{ return room}
    })
  }else if(_messages !== undefined){ // array of messages in ws action
    stateRooms = stateRooms.map(
    room=>{
        if(room.id === action.roomId){
        _r_messages = _r_messages.concat(room.messages);
        _r_messages = _r_messages.concat(_messages);
          if(action.messages.length >0 ){
            return {...room, messages: _r_messages, end:false}
          }else{ return {...room, end: true}}
        }else{return room }
    })
  }else if(_message !== undefined){ // single message object in ws action
    singleMessage = true;
    stateRooms = stateRooms.map(
    room=>{
      if(room.id === action.message.roomId){
        _r_messages = _r_messages.concat(room.messages);
        _r_messages.unshift(action.message)
        // don't update the notifications count if
        return {...room, notifications_count: (!isGroup && action.recipient) ? room.notifications_count += 1 : state.notificationsCount, active:true, messages: _r_messages}
       }else{ return room}
    })
  }
  return state.merge({
    fetching: false,
    error: null,
    rooms: !isGroup ? stateRooms : state.rooms,
    notificationsCount: (!isGroup && singleMessage) ? state.notificationsCount +=1 : state.notificationsCount,
    group_rooms: isGroup ? stateRooms : state.group_rooms
  })
}


/* ###############################
 * setRoomContent
 *
 ^ ############################### */
export const setRoomContent = (state, action) => {
  const isGroup = _isGroup(action.rModel);
  let results = isGroup ? state.group_rooms : state.rooms;
  results = results.map(room =>
    room.id === action.roomId ?
      {...room, content: action.content !== "" ?
        action.content : undefined } : room )
  return state.merge({
    fetching: false,
    rooms: isGroup ? state.rooms : results,
    group_rooms: isGroup ? results : state.group_rooms
  })
}


/* ###############################
 * sendRoomIsTyping
 *
 ^ ############################### */
export const sendRoomIsTyping = ( state,action ) => {
  ChatAPI.send({
    ...action,
    type:"SET_ROOM_IS_TYPING",
  })
  return state; // nothing to do for client
}

export const setRoomIsTyping = (state,action) =>{
  const isGroup = _isGroup(action.rModel)
  let results = isGroup ? state.group_rooms : state.rooms;
  results = results.map(
    room => room.id === action.roomId ?
      { ...room, isTyping:action.isTyping, active: action.isTyping}
      : room)
  return state.merge({
    rooms: isGroup ? state.rooms : results,
    group_rooms: isGroup ? results : state.group_rooms
  })
}


export const sendRoomActive = (state,action) =>{
    ChatAPI.send({
      ...action,
      type:"SET_ROOM_ACTIVE",
    })
    return state;
  }


/*
  setGroupUserIsTyping
  ** not implemented
*/
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


/*
  createChatRoom
*/
export const createChatRoom = (state, action) => {
  ChatAPI.send({
    ...action,
    type: "CREATE_CHAT_ROOM",
  })
  return state.merge({fetching: true})
}

export const createChatRoomSuccess = (state,action) => {
  const isGroup = _isGroup(action.rModel);
  let results = isGroup ? state.group_rooms: state.rooms;
  results = results.concat(action.room);

  return state.merge({
    fetching: false,
    rooms: isGroup ? state.rooms : results,
    group_rooms: isGroup ? results : state.group_rooms,
    currentRoom: action.room
  })
}

export const createChatRoomFailure = (state,action) => state.merge({
  fetching: false,
  error: action.error
})

export const setAllRoomsInactiveSuccess = (state, action) =>{
  const isGroup = _isGroup(action.data.rModel);
  let results = isGroup ? state.group_rooms : state.rooms;
  const actionRoom = action.data.room;
  const stateRoom = results.find(room=>room.id===actionRoom.id);
  const stateSearchRoom = state.search_rooms.find(r=>r.id===actionRoom.id);

  if (stateRoom !== undefined){
    const searchRooms = stateSearchRoom !== undefined ?
      state.search_rooms.map(
        (r,idx)=>r.id===actionRoom.id ?
          state.rooms.splice(idx,1)
          : r
      ) : state.search_rooms ;

    return state.merge({
      fetching:false,
      rooms: state.rooms.map(
        (room,idx) => room.id === actionRoom.id ?
          state.rooms.splice(idx, 1)
          : room
        ),
      search_rooms: searchRooms
    })
  }
  return state.merge({
    fetching: false,
    //TODO: sort by last_activity .sort((a,b)=>a.users[0].last_activity)
    })
}
export const setRoomActive= (state,action) =>{
  const isGroup = _isGroup(action.rModel);
  let results = isGroup ? state.group_rooms : state.rooms;
  results = results.map(
    room => room.id === action.roomId ? { ...room, active:true } : room
  )

  return state.merge({
    fetching: false,
    rooms: isGroup ? state.rooms : results,
    group_rooms: isGroup ? results : state.group_rooms
  })
}

export const setRoomInactive= (state,action) =>{
  const isGroup = _isGroup(action.rModel);
  let results = isGroup ? state.group_rooms : state.rooms;
  results = results.map(
    room => room.id === action.roomId ? { ...room, active:false } : room
  )

  return state.merge({
    fetching: false,
    rooms: isGroup ? state.rooms : results,
    group_rooms: isGroup ? results : state.group_rooms
  })
}


export const loadPreviousMessages = (state, action) => {
  const isGroup = _isGroup(action.rModel);
  let results = isGroup ? state.group_rooms : state.rooms;

  const firstMessage = _.minBy(results.find(room=>room.id === action.roomId).messages, (m) => m.id);
  ChatAPI.send({
    type:"REQUEST_MESSAGES",
    firstMessageId: firstMessage.id,
    user: action.username,
    roomId: action.roomId,
    rModel: action.rModel,
    mModel: action.mModel,
    })

  results = results.map(
    room => room.id === action.roomId ?
      { ...room, loading:true}
      : room
  )
  return state.merge({
    fetching: false,
    rooms: isGroup ? state.rooms : results,
    group_rooms: isGroup ? results : state.group_rooms
  })

}

export const setRoomInactiveInterval = (state, action) =>{
    const isGroup = _isGroup(action.rModel);
    let results = isGroup ? state.group_rooms : state.rooms;
		// need to send to the websocket to update the other user's room
		// activity
		if(!action.WS) {
			 return state.merge({ rooms: results.map(
			    room=>room.id === action.roomId ? {...room, active: false}: room)
			})
		}else{
			if(action.both){
				ChatAPI.send({
				  ...action,
					type: "SET_ROOM_INACTIVE"
				});
			 return state.merge({ rooms: results.map(
			  room=>room.id === action.roomId ? {...room, active: false}: room)
			 })
			}else{
				ChatAPI.send({
				  ...action,
					type: "SET_ROOM_INACTIVE"
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

  [Types.SEND_ROOM_IS_TYPING]: sendRoomIsTyping,
  [Types.SET_ROOM_IS_TYPING]: setRoomIsTyping,
  //[Types.SET_ROOM_IS_TYPING_FAILURE]: setRoomIsTypingFailure,

  [Types.CREATE_CHAT_ROOM]: createChatRoom,
  [Types.CREATE_CHAT_ROOM_SUCCESS]: createChatRoomSuccess,
  [Types.CREATE_CHAT_ROOM_FAILURE]: createChatRoomFailure,

  [Types.UNMATCH_USER]: unmatchUser,
  [Types.UNMATCH_USER_SUCCESS]: unmatchUserSuccess,
  [Types.UNMATCH_USER_FAILURE]: unmatchUserFailure,

  [Types.DELETE_CHAT_ROOM_SUCCESS]: deleteChatRoomSuccess,
  [Types.DELETE_CHAT_ROOM_FAILURE]: deleteChatRoomFailure,

  [Types.UNBLOCK_USER]: unblockUser,
  [Types.UNBLOCK_USER_SUCCESS]: unblockUserSuccess,
  [Types.UNBLOCK_USER_FAILURE]: unblockUserFailure,

  [Types.BLOCK_USER]: blockUser,
  [Types.BLOCK_USER_SUCCESS]: blockUserSuccess,
  [Types.BLOCK_USER_FAILURE]: blockUserFailure,

  [Types.SEND_ROOM_ACTIVE]: sendRoomActive,
  [Types.SET_ROOM_ACTIVE]: setRoomActive,


  [Types.SET_ROOM_INACTIVE]: setRoomInactive,
  [Types.SET_ROOM_INACTIVE_INTERVAL]: setRoomInactiveInterval,

  [Types.LOAD_PREVIOUS_MESSAGES]: loadPreviousMessages,

  [Types.CHAT_LOGOUT]: chatLogout,

  [Types.MARK_ROOM_MESSAGE_NOTIFICATIONS_READ]: request,
  [Types.MARK_ROOM_MESSAGE_NOTIFICATIONS_READ_SUCCESS]: markRoomMessageNotificationsReadSuccess,
  [Types.MARK_ROOM_MESSAGE_NOTIFICATIONS_READ_FAILURE]: markRoomMessageNotificationsReadFailure,


})
