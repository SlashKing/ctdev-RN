import { call, put } from 'redux-saga/effects'
import { path } from 'ramda'
import GithubActions from '../Redux/GithubRedux'

export function * getUserAvatar (api, action) {
  const { username } = action
  console.log(api,action)
  // make the call to the api
  const response = yield call(api.getUser, username)

  if (response.ok) {
  console.log(action,response)
    const profileImage = action.profile.profile_image_url

    // do data conversion here if needed
    yield put(GithubActions.userSuccess(profileImage))
  } else {
  console.log(action,response)
    yield put(GithubActions.userFailure())
  }
}
