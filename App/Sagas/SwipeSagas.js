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

import { call, put } from 'redux-saga/effects';
import SwipeActions from '../Redux/SwipeRedux';
import {isLoggedIn} from '../Redux/LoginRedux';

export function * fetchUsers (api, action) {
  const token = yield isLoggedIn(null)
  api.setHeader("Authorization", `JWT ${token}`)
  // make the call to the api
  const response = yield call(api.fetchUsers)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(SwipeActions.fetchUsersSuccess(response.data))
  } else {
    yield put(SwipeActions.fetchUsersFailure(response.data))
  }
}
export function * deleteVotes(api, action){
  const token = yield isLoggedIn(null)
  api.setHeader("Authorization", `JWT ${token}`)

  const response = yield call(api.deleteVotes, action.data)

  if (response.ok){
    console.log(response)
    yield put(SwipeActions.deleteVotesSuccess(response.data))
    yield put(ChatActions.resetRooms())
  }else{
    yield put(SwipeActions.deleteVotesFailure(response.data))
  }
}
export function * swipe (api, action){
  const token = yield isLoggedIn(null)
  api.setHeader("Authorization", `JWT ${token}`)

  const response = yield call(api.swipe, action.data.vote, action.data.this_user, action.data.user.profile.id, action.data.content_type)

  if(response.ok){
    console.log(response)
    yield put(
      SwipeActions.swipeSuccess({
        matched: response.data.matched,
        mega_match: response.data.mega_match,
        currentMatch: (response.data.matched || response.data.mega_match) ? action.data.user : undefined}))
  }else{
    yield put(SwipeActions.swipeFailure(response.data))
  }
}
