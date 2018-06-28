import { call, put } from 'redux-saga/effects';
import {ChatAPI} from '../Services/ChatAPI';
import ChatActions from '../Redux/ChatRedux';
import _ from 'lodash';

export function * flagMessage(api, action){
  const { data } = action
  const response = yield call(api.flagMessage, data)
  if(response.ok){
    yield put(ChatActions.flagMessageSuccess({...response.data, ...data}))
  }else{
    yield put(ChatActions.flagMessageFailure(response.data))
  }
}

export function * removeMessageFlag(api, action){
  const { data } = action
  const response = yield call(api.removeMessageFlag, data)
  if(response.ok){
    yield put(ChatActions.removeMessageFlagSuccess({...response.data, ...data}))
  }else{
    yield put(ChatActions.removeMessageFlagFailure(response.data))
  }
}

export function * reportUser(api, action){
  const { data } = action
  const response = yield call(api.reportUser, data)
  if(response.ok){
    yield put(ChatActions.reportUserSuccess(response.data))
  }else{
    yield put(ChatActions.reportUserFailure(response.data))
  }
}

export function * setEndOfRoomResults(action) {
	 yield put(ChatActions.setEndofRoomResults(action.roomId, action.end))
}

export function * loadingMessages(loading) {
		 yield put(ChatActions.setFetching(action.fetching))
}

export function * loginUser (action){
  ChatAPI.send({type:"CHAT_LOGIN", user: action.username})
}

export function * setRoomIsTyping(action){
  ChatAPI.send({
    type:"SET_ROOM_IS_TYPING",
    roomId: action.roomId,
    isTyping: action.isTyping
  })
}

export function * requestPriorMessages(action) {
  const firstMessage = _.minBy(action.messages, (m) => m.id);
  ChatAPI.send({
    type: "REQUEST_MESSAGES",
    firstMessageId: firstMessage.id,
    roomId: action.room.id,
    user: action.user.username,
  });
}

export function * unmatchUser(api, action){
  const { data } = action
  const response = yield call(api.unmatchUser, data.userId)
  if(response.ok){
    ChatAPI.send({
      type: "DELETE_CHAT_ROOM",
      roomId: data.roomId,
    })
  }else{
    yield put(ChatActions.deleteChatRoomFailure(response.data))
  }
}

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

export function * createRoom(action) {
  ChatAPI.send({
    type: "CREATE_CHAT_ROOM",
    ...action
  })
}

export function * fetchRooms (api, action) {
  const { data } = action
  // make the call to the api
  const response = yield call(api.fetchRooms, data)

  // success?
  if (response.ok) {
    yield put(ChatActions.fetchRoomsSuccess(response.data))
  } else {
    yield put(ChatActions.fetchRoomsFailure())
  }
}
