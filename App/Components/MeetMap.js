'use strict'

import React from 'react';
import {connect} from 'react-redux';
import { View } from 'react-native';
import MapView from 'react-native-maps';
import MeetMapMarker from './MeetMapMarker';
import Styles from './Styles/MeetMapStyles';
import MeetMapCreateModal from '../Modals/MeetMapCreateModal';
import MeetMapCurrentRoomModal from '../Modals/MeetMapCurrentRoomModal';
import SendRequestToJoinModal from '../Modals/SendRequestToJoinModal';
//import SendJoinRequestModal from '../Modals/SendJoinRequestModal';
import MeetMapActions from '../Redux/MeetMapRedux';
// Generate this MapHelpers file with `ignite generate map-utilities`
// You must have Ramda as a dev dependency to use this.
// import { calculateRegion } from '../Lib/MapHelpers'

/* ***********************************************************
* IMPORTANT!!! Before you get started, if you are going to support Android,
* PLEASE generate your own API key and add it to android/app/src/main/AndroidManifest.xml
* https://console.developers.google.com/apis/credentials
* Also, you'll need to enable Google Maps Android API for your project:
* https://console.developers.google.com/apis/api/maps_android_backend/
*************************************************************/

class MeetMap extends React.Component {

  constructor (props) {
    super(props)
    /* ***********************************************************
    * STEP 1
    * Set the array of locations to be displayed on the meet map. We add the necessities suchas
    * latitude, longitude, their respective deltas, a picture to show on the marker, a title
    * as well as the room TODO: why are we passing the entire room then splitting it up and adding to the top level, redundancy at its best
    *************************************************************/
    let locations = []

    props.groupRooms.forEach((r,index)=> {
      const numUsers = r.users.length;
      const adminUser = r.users.find(u=>u.admin);
      locations.push({
        room: r,
        id: r.id,
        title: r.name,
        picture: r.users.length > 0 && adminUser !== undefined ? adminUser.profile.profile_image : '',
        users: r.users,
        latitude: r.location.latitude,
        longitude: r.location.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1
      })
      }
    )
    /* ***********************************************************
    * STEP 2
    * Set your initial region either by dynamically calculating from a list of locations (as below)
    * or as a fixed point, eg: { latitude: 123, longitude: 123, latitudeDelta: 0.1, longitudeDelta: 0.1}
    * You can generate a handy `calculateRegion` function with
    * `ignite generate map-utilities`
    *************************************************************/
    console.log(locations)
    // const region = calculateRegion(locations, { latPadding: 0.05, longPadding: 0.05 })
    const region = { latitude: props.latitude, longitude: props.longitude, latitudeDelta: 0.1, longitudeDelta: 0.1}
    this.state = {
      region,
      locations,
      showUserLocation: true,
      isPoi: false
    }
    this.renderMapMarkers = this.renderMapMarkers.bind(this)
    this.onRegionChange = this.onRegionChange.bind(this)
  }

  componentWillReceiveProps (newProps) {
    /* ***********************************************************
    * STEP 3
    * If you wish to recenter the map on new locations any time the
    * props change, do something like this:
    *************************************************************/
    // this.setState({
    //   region: calculateRegion(newProps.locations, { latPadding: 0.1, longPadding: 0.1 })
    // })

    /* *******
     * When a new group is added to the groupRooms prop through ws or from group creation, we add to the map
    *********/

    if ( newProps.groupRooms.length > this.props.groupRooms.length){
      const room = newProps.groupRooms[newProps.groupRooms.length-1];
      this.setState({
        locations: this.state.locations.concat({
          room,
          id: room.id,
          title: room.name,
          picture: room.users[0].profile.profile_image,
          users: room.users,
          latitude: room.location.latitude,
          longitude: room.location.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        })
      });
    }
    console.log(newProps);
  }

  onRegionChange (newRegion) {
    /* ***********************************************************
    * STEP 4
    * If you wish to fetch new locations when the user changes the
    * currently visible region, do something like this:
    *************************************************************/
    // const searchRegion = {
    //   ne_lat: newRegion.latitude + newRegion.latitudeDelta / 2,
    //   ne_long: newRegion.longitude + newRegion.longitudeDelta / 2,
    //   sw_lat: newRegion.latitude - newRegion.latitudeDelta / 2,
    //   sw_long: newRegion.longitude - newRegion.longitudeDelta / 2
    // }
    // Fetch new data...
    console.log(newRegion)
  }

  calloutPress (location) {
    /* ***********************************************************
    * STEP 5
    * Configure what will happen (if anything) when the user
    * presses your callout.
    *************************************************************/
    console.log(location)
    this.setState({ region : location})
    this.props.setCurrentRoom(location.room);
  }

  renderMapMarkers (location) {
    /* ***********************************************************
    * STEP 6
    * Customize the appearance and location of the map marker.
    * Customize the callout in ./MeetMapCallout.js
    *************************************************************/
    return (
      <MeetMapMarker
          key={`marker_${location.id}`}
          location={location}
          onCalloutPress={()=>this.calloutPress(location)}
      />
    )
  }

  goToRoom = () => {
    this.modalRef.resetModal();
    this.props.navigation.navigate("MeetMeChatRoomScreen", {room: this.props.createdRoom});
  }

  goToGroupChat = () => {
    this.props.navigation.navigate("MeetMeChatScreen", {});
  }

  goToCurrentRoom = () => {
    this.props.navigation.navigate("MeetMeChatRoomScreen", {room: this.props.currentRoom});
    this.modalRef.resetModal();
  }

  goToCurrentRequestToJoinRoom = () => {
    this.props.navigation.navigate("MeetMeChatRoomScreen", {room: this.props.currentRequestToJoin});
    this.modalRef.resetModal();
  }

  onLongPress = (e) => {
    this.setState({region: {...e.nativeEvent.coordinate, latitudeDelta:0.1, longitudeDelta:0.1}})
    console.log(e.nativeEvent, this.state.region);
  }

  onPoiClick = e => {
    this.setState({isPoi: true})
    console.log(e.nativeEvent)
  }

  _renderModal(){
    const {
      currentUser, currentRoom, createdRoom, currentRequestToJoin, currentJoinRequest, fetchChatUsers, currentRequestableUsers,
      resetCurrentRoom, setCurrentRoom, resetMeetMapSuccess, resetCurrentJoinRequest, resetCurrentRequestToJoin,
      createMeetMapRoom, setCurrentRequestToJoin, setCurrentJoinRequest, requestToJoin, sendJoinRequest,
      cancelJoinRequest, acceptJoinRequest, rejectJoinRequest, success
    } = this.props;
    const { isPoi, region } = this.state;
    let modal = null;
    if (currentRoom !== null) {
      modal = <MeetMapCurrentRoomModal
                ref={ el =>this.modalRef = el }
                currentRoom={currentRoom}
                fetchChatUsers={fetchChatUsers}
                setCurrentRequestToJoin={setCurrentRequestToJoin}
                setCurrentJoinRequest={setCurrentJoinRequest}
                resetCurrentRoom={resetCurrentRoom}
                goToRoom={this.goToCurrentRoom}
                resetSuccess={resetMeetMapSuccess}
                success={success}
              />
    }else if(currentRequestToJoin !== null){
      modal = <SendRequestToJoinModal
                ref={ el =>this.modalRef = el }
                goToRoom={this.goToCurrentRequestToJoinRoom}
                fetchChatUsers={fetchChatUsers}
                currentUser={currentUser.id}
                currentRequestToJoin={currentRequestToJoin}
                currentRequestableUsers={currentRequestableUsers}
                sendRequestToJoin={requestToJoin}
                cancelJoinRequest={cancelJoinRequest}
                acceptJoinRequest={acceptJoinRequest}
                rejectJoinRequest={rejectJoinRequest}
                resetCurrentRequestToJoin={resetCurrentRequestToJoin}
                resetSuccess={resetMeetMapSuccess}
                success={success}
              />
    }else if(currentJoinRequest !== null){
    /*
      modal = <SendJoinRequestModal
                ref={ el =>this.modalRef = el }
                goToRoom={this.goToCurrentRequestToJoinRoom}
                currentJoinRequest={currentJoinRequest}
                resetCurrentJoinRequest={resetCurrentJoinRequest}
                resetSuccess={resetSuccess}
                success={success}
              />
    */
    }else{
      modal = <MeetMapCreateModal
                  ref={ el =>this.modalRef = el }
                  createRoom={createMeetMapRoom}
                  fetchChatUsers={fetchChatUsers}
                  goToRoom={this.goToRoom}
                  setCurrentRoom={setCurrentRoom}
                  currentRequestableUsers={currentRequestableUsers}
                  createdRoom={createdRoom}
                  currentLocation={region}
                  resetSuccess={resetMeetMapSuccess}
                  success={success}
                  isPoi={isPoi}
              />
    }
    return modal;
  }
  render () {
    const { currentRoom } = this.props;
    const { locations, region, showUserLocation } = this.state;

    return (
      <View style={[Styles.container]}>
        <MapView
          style={Styles.map}
          initialRegion={region}
          onRegionChangeComplete={this.onRegionChange}
          showsUserLocation={showUserLocation}
          onLongPress={this.onLongPress}
          //onPress={this.onLongPress}
          onPoiClick={this.onLongPress}
        >
          {locations.map((location) => this.renderMapMarkers(location))}
        </MapView>
        { this._renderModal() }
       <View style={Styles.mapDrawerOverlay} />
     </View>
    )
  }
}
const mapStateToProps= (state) =>{
  return{
    currentUser: state.login.currentUser,
    latitude: state.login.currentUser.profile.location.latitude,
    longitude: state.login.currentUser.profile.location.longitude,
    groupRooms: state.meet_map.group_rooms,
    currentRequestableUsers: state.meet_map.currentRequestableUsers,
    currentJoinRequest: state.meet_map.currentJoinRequest,
    currentRequestToJoin: state.meet_map.currentRequestToJoin,
    currentRoom: state.meet_map.currentRoom,
    createdRoom: state.meet_map.createdRoom,
    success: state.meet_map.success,
    loading: state.meet_map.loading
  }

}
const mapDispatchToProps= (dispatch) =>{
  return{
      fetchChatUsers: (room) => dispatch(MeetMapActions.fetchBareBoneChatUsers({room})),
      setCurrentRoom: (room) => dispatch(MeetMapActions.setCurrentMeetMapRoom({room})),
      setCurrentJoinRequest: (room) => dispatch(MeetMapActions.setCurrentJoinRequest({room})),
      setCurrentRequestToJoin: (room) => dispatch(MeetMapActions.setCurrentRequestToJoin({room})),
      resetMeetMapSuccess: () => dispatch(MeetMapActions.resetMeetMapSuccess()),
      resetCurrentJoinRequest: () => dispatch(MeetMapActions.resetCurrentJoinRequest()),
      resetCurrentRequestToJoin: () => dispatch(MeetMapActions.resetCurrentRequestToJoin()),
      requestToJoin: (roomId, admin, message, sendToUsers) => dispatch(MeetMapActions.requestToJoin({ roomId, admin, message, sendToUsers })),
      cancelJoinRequest: (roomId, jrId) => dispatch(MeetMapActions.cancelJoinRequest(roomId, jrId)),
      rejectJoinRequest: (roomId, jrId) => dispatch(MeetMapActions.rejectJoinRequest(roomId, jrId )),
      acceptJoinRequest: (roomId, jrId) => dispatch (MeetMapActions.acceptJoinRequest(roomId, jrId )),
      createMeetMapRoom: (title, currentLocation, users, privacy) => dispatch(MeetMapActions.createMeetMapRoom({
          title,
          location: {latitude: currentLocation.latitude, longitude: currentLocation.longitude},
          users,
          private: privacy,
        })
      ),
      resetCurrentRoom: () => dispatch(MeetMapActions.resetMeetMapCurrentRoom()),
      // updateLocation: (currentUserId, lat, lon) =>dispatch(LoginActions.updateLocation(currentUserId, lat, lon),
    }

}
export default connect(mapStateToProps, mapDispatchToProps)(MeetMap)

