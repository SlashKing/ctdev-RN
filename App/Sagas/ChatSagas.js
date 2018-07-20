import { call, put } from 'redux-saga/effects';
import {ChatAPI} from '../Services/ChatAPI';
import ChatActions from '../Redux/ChatRedux';
import _ from 'lodash';


/* #############################################################
 *
 *                         flagMessage
 *
 *
 *
 * ############################################################# */
export function * flagMessage(api, action){
  const { data } = action
  const response = yield call(api.flagMessage, data)
  if(response.ok){
    yield put(ChatActions.flagMessageSuccess({...response.data, ...data}))
  }else{
    yield put(ChatActions.flagMessageFailure(response.data))
  }
}


/* #############################################################
 *
 *                      removeMessageFlag
 *
 *
 *
 * ############################################################# */
export function * removeMessageFlag(api, action){
  const { data } = action
  const response = yield call(api.removeMessageFlag, data)
  if(response.ok){
    yield put(ChatActions.removeMessageFlagSuccess({...response.data, ...data}))
  }else{
    yield put(ChatActions.removeMessageFlagFailure(response.data))
  }
}


/* #############################################################
 *
 *                        reportUser
 *
 *
 *
 * ############################################################# */
export function * reportUser(api, action){
  const { data } = action
  const response = yield call(api.reportUser, data)
  if(response.ok){
    yield put(ChatActions.reportUserSuccess(response.data))
  }else{
    yield put(ChatActions.reportUserFailure(response.data))
  }
}


/* #############################################################
 *
 *                      setEndOfRoomResults
 *
 *
 *
 * ############################################################# */
export function * setEndOfRoomResults(action) {
	 yield put(ChatActions.setEndofRoomResults(action.roomId, action.end))
}


/* #############################################################
 *
 *                        loadingMessages
 *
 *
 *
 * ############################################################# */
export function * loadingMessages(loading) {
		 yield put(ChatActions.setFetching(action.fetching))
}


/* #############################################################
 *
 *                          loginUser
 *
 *
 *
 * ############################################################# */
export function * loginUser (action){
  ChatAPI.send({type:"CHAT_LOGIN", user: action.username})
}


/* #############################################################
 *
 *                        setRoomIsTyping
 *
 *
 *
 * ############################################################# */
export function * setRoomIsTyping(action){
  ChatAPI.send({
    type:"SET_ROOM_IS_TYPING",
    roomId: action.roomId,
    isTyping: action.isTyping
  })
}


/* #############################################################
 *
 *                  requestPriorMessages
 *
 *
 *
 * ############################################################# */
export function * requestPriorMessages(action) {
  const firstMessage = _.minBy(action.messages, (m) => m.id);
  ChatAPI.send({
    type: "REQUEST_MESSAGES",
    firstMessageId: firstMessage.id,
    roomId: action.room.id,
    user: action.user.username,
  });
}


/* #############################################################
 *
 *                      unmatchUser
 *
 *
 *
 * ############################################################# */
export function * unmatchUser(api, action){
  const { userId } = action
  const response = yield call(api.unmatchUser, userId)
  if(response.ok){
    ChatAPI.send({
      ...action,
      type: "DELETE_CHAT_ROOM"
    })
  }else{
    yield put(ChatActions.deleteChatRoomFailure(response.data))
  }
}


/* #############################################################
 *
 *                      sendMessage
 *
 *
 *
 * ############################################################# */
export function * sendMessage(api, action){
  const { data } = action
  // make the call to the api
  const response = yield call(api.createFileMessage, data)

  // success?
  if (response.ok) {
    console.log(response.data)
    yield put(ChatActions.createFileMessageSuccess(response.data))
    ChatAPI.send({
	  	type: "SEND_MESSAGE",
	  	...response.data
	  });
  } else {
    yield put(ChatActions.createFileMessageFailure(response.data))
  }
}


/* #############################################################
 *
 *                      createRoom
 *
 *
 *
 * ############################################################# */
export function * createRoom(action) {
  ChatAPI.send({
    type: "CREATE_CHAT_ROOM",
    ...action
  })
}


/* #############################################################
 *
 *                markRoomMessageNotificationsRead
 *
 *
 *
 * ############################################################# */
export function * markRoomMessageNotificationsRead (api, action) {
  const { roomId } = action
  console.log(action)
  // make the call to the api
  const response = yield call(api.markAllRoomNotificationsRead, roomId)

  // success?
  if (response.ok) {
    yield put(ChatActions.markRoomMessageNotificationsReadSuccess(response.data))
  } else {
    yield put(ChatActions.markRoomMessageNotificationsReadFailure(response.data))
  }
}


/* #############################################################
 *
 *                fetchRooms
 *
 *
 *
 * ############################################################# */
export function * fetchRooms (api, action) {
  const { data } = action
  // make the call to the api
  const response = yield call(api.fetchRooms, data)

  // success?
  if (response.ok) {
    yield put(ChatActions.fetchRoomsSuccess(response.data))
  } else {
    yield put(ChatActions.fetchRoomsFailure(response.data))
  }
}
