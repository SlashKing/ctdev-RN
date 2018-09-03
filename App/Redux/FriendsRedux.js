import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  fetchFriendsRequest: null,
  fetchFriendsSuccess: ['data'],
  fetchFriendsFailure: null
})

export const FriendsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  friends: null,
  fetching: null,
  error: null
})

/* ------------- Reducers ------------- */

export const request = (state, { data }) =>
  state.merge({ fetching: true, data, payload: null })

export const success = (state, action) => {
  const { data } = action
  return state.merge({ fetching: false, error: null, friends: data.friends })
}

export const failure = state =>
  state.merge({ fetching: false, error: true, payload: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FETCH_FRIENDS_REQUEST]: request,
  [Types.FETCH_FRIENDS_SUCCESS]: success,
  [Types.FETCH_FRIENDS_FAILURE]: failure
})
