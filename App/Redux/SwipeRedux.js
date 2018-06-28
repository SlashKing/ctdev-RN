import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import {ChatAPI} from '../Services/ChatAPI';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  fetchUsersRequest: null,
  fetchUsersSuccess: ['data'],
  fetchUsersFailure: ['error'],

  deleteVotesRequest: ['data'],
  deleteVotesSuccess: ['data'],
  deleteVotesFailure: ['error'],

  swipeRequest: ['data'],
  swipeSuccess: ['data'],
  swipeFailure: ['error'],

  resetMatchSuccess: null,

  swipeLogout: null
})

export const SwipeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  results: null,
  fetching: null,
  currentMatch: null,
  currentRoom: null,
  error: null
})

/* ------------- Reducers ------------- */
export const swipeLogout = (state,action) => state.merge(INITIAL_STATE)
export const swipeRequest = (state) => state.merge({ fetching: true })
export const swipeSuccess = (state, action) => state.merge({ fetching: false, matched: action.data.matched, mega_match: action.data.mega_match, currentMatch: action.data.currentMatch })
export const swipeFailure = (state, error) => state.merge({ fetching: false, error: error})

export const deleteVotesRequest = (state) => state.merge({ fetching: true })
export const deleteVotesSuccess = (state, action) => {
    ChatAPI.send({
      type:"SET_ALL_ROOMS_INACTIVE"
    })
  return state.merge({ fetching: false })
}
export const deleteVotesFailure = (state, error) => state.merge({ fetching: false, error: error})

// request the data from an api
export const fetchUsersRequest = (state) => state.merge({ fetching: true})

// successful api lookup
export const fetchUsersSuccess = (state, action) => state.merge({ fetching: false, results: action.data.results, error: null })

// Something went wrong somewhere.
export const fetchUsersFailure = state =>
  state.merge({ fetching: false, error: true, results: null })

export const resetMatchSuccess = (state) => state.merge({
  fetching: false,
  currentMatch: undefined,
  mega_match: false,
  matched:false,
});
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FETCH_USERS_REQUEST]: fetchUsersRequest,
  [Types.FETCH_USERS_SUCCESS]: fetchUsersSuccess,
  [Types.FETCH_USERS_FAILURE]: fetchUsersFailure,
  [Types.SWIPE_REQUEST]: swipeRequest,
  [Types.SWIPE_SUCCESS]: swipeSuccess,
  [Types.SWIPE_FAILURE]: swipeFailure,
  [Types.DELETE_VOTES_REQUEST]: deleteVotesRequest,
  [Types.DELETE_VOTES_SUCCESS]: deleteVotesSuccess,
  [Types.DELETE_VOTES_FAILURE]: deleteVotesFailure,
  [Types.RESET_MATCH_SUCCESS]: resetMatchSuccess,
  [Types.SWIPE_LOGOUT]: swipeLogout,
})
