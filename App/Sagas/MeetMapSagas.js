/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/

import { call, put } from 'redux-saga/effects'
import MeetMapActions from '../Redux/MeetMapRedux'

/**
Fetch users that are looking for a meet up, friends will appear on the map but fetched in FriendsSagas
*/
export function * fetchMeetMapUsers (api, action) {
  const { data } = action
  // make the call to the api
  const response = yield call(api.fetchMeetMapUsers, data)

  // success?
  if (response.ok) {
    yield put(MeetMapActions.meetMapSuccess(response.data))
  } else {
    yield put(MeetMapActions.meetMapFailure())
  }
}

export function * markGroupRoomMessageNotificationsRead (api, action) {
  const { roomId } = action
  // make the call to the api
  const response = yield call(api.markAllGroupRoomNotificationsRead, roomId)

  // success?
  if (response.ok) {
    yield put(ChatActions.markGroupRoomMessageNotificationsReadSuccess(response.data))
  } else {
    yield put(ChatActions.markGroupRoomMessageNotificationsReadFailure(response.data))
  }
}

export function * fetchBareBoneChatUsers (api, action) {
  const { data } = action
  // make the call to the api
  const response = yield call(api.fetchBareBoneChatUsers, data)

  // success?
  if (response.ok) {
    yield put(MeetMapActions.fetchBareBoneChatUsersSuccess(response.data))
  } else {
    yield put(MeetMapActions.fetchBareBoneChatUsersFailure())
  }
}
