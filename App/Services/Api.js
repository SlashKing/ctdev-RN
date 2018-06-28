// a library to wrap and simplify api calls
import apisauce from 'apisauce'
// our "constructor"
const create = (baseURL = 'http://192.168.0.13:8000/') => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      "Accept": "application/json",
    	"Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
    // 10 second timeout...
    timeout: 10000
  })


  /** Fixture **/
  const getRoot = () => api.get('')
  const getRate = () => api.get('rate_limit')

  // Friends
  const fetchFriends = (user) => api.get(`friends/${user}/`,{})

  // Users
  const fetchUsers = () => api.get('api/users/',{limit: 5})
  // TODO: add a custom request that will implement algorithm to choose most likely matches based on matching facebook interests/likes
  // TODO: will save the aforementioned list to an index for more efficient retrieval and less strain on database requests.
  const fetchCurrentUser = () => api.get('api/users/i/',{})
  const getUser = (username) => api.get(`api/users/${username}/`, {})
  const patchUser = (data) => api.patch(`api/users/${data.id}/`,{...data})
  const patchProfile = (data) => api.patch(`api/user_profiles/${data.p_id}/`,{...data})
  const addProfilePicture = (data) => api.post('api/user_profiles/add_profile_picture/', {...data})
  const switchPriority = (data) => api.post('api/user_profiles/switch_priority/', {...data})

  // Swipe
  const swipe = (vote, current_user, user, content_type) => api.post('api/likes/swipe/',{vote:vote, token: current_user, object_id: user, content_type:content_type })
  const deleteVotes = (data) => api.post(`api/user_profiles/${data.p_id}/delete_votes/`,{})

  // Meet Map

  const fetchMeetMapUsers = (lat, lon, distance) => api.get('api/meetmap/',{lat, lon, distance})

  // Notifications
  const fetchNotifications = (user) => api.get(`api/notifications/${user}/`, {})

  // Chat
  const unmatchUser = (user) => api.post(`api/likes/${user}/unmatch`,{})
  const fetchRooms = (user) => api.get(`api/rooms/${user}`,{})
  const createFileMessage = (data) => api.post('api/messages/',{...data})
  const flagMessage = (data) => api.post(`api/messages/${data.id}/add_flag/`,{reason:data.reason, comment: data.comment})
  const removeMessageFlag = (data) => api.post(`api/messages/${data.id}/remove_flag_instances/`,{})
  const reportUser = (data) => api.post(`api/users/${data.userId}/report/`,{report_type:data.report_type, comment: data.comment})

  // Login
  const checkSocialLogin = (accessToken) => api.post('rest-auth/facebook/',{access_token:accessToken})
  const passwordChange = (data) => api.post('rest-auth/password/change/',{new_password1: data.new_password1, new_password2: data.new_password2})
  const passwordReset = (email) => api.post('rest-auth/password/reset/',{email})
  const passwordResetConfirm = (email) => api.post('rest-auth/password/reset/',{email})
  const loginUser = (username,password) => api.post('rest-auth/login/',{username,password})
  const logout = (token) => api.post('rest-auth/logout/',{token})
  const registerUser = (username, password1, password2, email, birthday, latitude, longitude) => api.post('rest-auth/registration/',{username, password1, password2, email, birthday, latitude, longitude})
  const signUp = ({data}) => api.post('users/',{data})
  const setHeader = (key, value)=> api.setHeader(key, value)
  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    swipe,
    setHeader,
    getRoot,
    getRate,
    getUser,
    deleteVotes,
    fetchCurrentUser,
    passwordChange,
    patchUser,
    patchProfile,
    addProfilePicture,
    switchPriority,
    fetchUsers,
    fetchMeetMapUsers,
    fetchFriends,
    unmatchUser,
    fetchRooms,
    createFileMessage,
    flagMessage,
    removeMessageFlag,
    reportUser,
    fetchNotifications,
    checkSocialLogin,
    logout,
    loginUser,
    registerUser,
    signUp,
  }
}
export default {
  create
}
