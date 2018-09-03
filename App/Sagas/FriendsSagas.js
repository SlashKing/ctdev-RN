import { call, put } from 'redux-saga/effects'
import FriendsActions from '../Redux/FriendsRedux'

/**
* name: fetchFriends
* params: api, action.data
* implements: action.data.id
*
* description: fetch friends to user on MeetMap and Swipe apps
**/
export function * fetchFriends (api, action) {
  const { data } = action
  // make the call to the api
  const response = yield call(api.fetchFriends, data.id)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(FriendsActions.fetchFriendsSuccess(response.data))
  } else {
    yield put(FriendsActions.fetchFriendsFailure())
  }
}
