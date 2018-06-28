import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  locationRequest: ['data'],
  locationSuccess: ['data'],
  locationFailure: ['error']
})

export const LocationTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  latitude: null,
  longitude: null,
  locationRetrievalFailed: false,
  error: null
})

/* ------------- Reducers ------------- */
export const locationRequest = (state) => state.merge({fetching:true})

export const locationSuccess = (state, action) => state.merge({
  fetching: false, locationRetrievalFailed: false,
  latitude: action.data.latitude,
  longitude: action.data.longitude
})

export const locationError = (state, error) => state.merge({
  fetching: false,
  locationRetrievalFailed: true,
  error: error.data
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOCATION_REQUEST]: locationRequest,
  [Types.LOCATION_SUCCESS]: locationSuccess,
  [Types.LOCATION_ERROR]: locationError,
})
