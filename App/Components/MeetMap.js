import React from 'react';
import {connect} from 'react-redux';
import { View } from 'react-native';
import MapView from 'react-native-maps';
import MeetMapCallout from './MeetMapCallout';
import Styles from './Styles/MeetMapStyles';
import MeetMapCreateModal from '../Modals/MeetMapCreateModal';
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
    * Set the array of locations to be displayed on your map. You'll need to define at least
    * a latitude and longitude as well as any additional information you wish to display.
    *************************************************************/
    var locations = []
    props.groupRooms.forEach((r,index)=> locations.push({
        room: {...r},
        id: r.id,
        title: r.name,
        picture: r.users[0].profile.profile_image,
        users: r.users,
        latitude: r.location.latitude,
        longitude: r.location.longitude
      })
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
    if ( newProps.groupRooms.length > this.props.groupRooms.length){
      this.setState({
        locations: this.state.locations.map((r,index)=> locations.push({
          room: {...r},
          id: r.id,
          title: r.name,
          picture: r.users[0].profile.profile_image,
          users: r.users,
          latitude: r.location.latitude,
          longitude: r.location.longitude
        }))
      })
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

  calloutPress = (location) => {
    /* ***********************************************************
    * STEP 5
    * Configure what will happen (if anything) when the user
    * presses your callout.
    *************************************************************/
    console.log(location.room)
    this.props.setCurrentRoom(location.room);
  }

  renderMapMarkers (location) {
    /* ***********************************************************
    * STEP 6
    * Customize the appearance and location of the map marker.
    * Customize the callout in ./MeetMapCallout.js
    *************************************************************/
    console.log(location)
    return (
      <MapView.Marker
        key={location.title}
        image={{ uri: location.picture }}
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude
        }}>
        <MeetMapCallout
          location={location}
          users={location.users}
          onPress={this.calloutPress} />
      </MapView.Marker>
    )
  }

  goToRoom = () => this.props.navigation.navigate("MeetMapChatRoomScreen", {room: this.props.createdRoom});
  goToGroupChat = () => this.props.navigation.navigate("MeetMapChatScreen", {});

  onPress = (e) => {
    this.setState({region: {...e.nativeEvent.coordinate, latitudeDelta:0, longitudeDelta:0}})

    console.log(e.nativeEvent, this.state.region);
  }
  onPoiClick = e => {
    this.setState({isPoi: true})
    console.log(e.nativeEvent)
  }

  render () {
    return (
      <View style={[Styles.container]}>
        <MapView
          style={Styles.map}
          initialRegion={this.state.region}
          onRegionChangeComplete={this.onRegionChange}
          showsUserLocation={this.state.showUserLocation}
          onLongPress={this.onPress}
          onPress={this.onPress}
          onPoiClick={this.onPress}
        >
          {this.state.locations.map((location) => this.renderMapMarkers(location))}
        </MapView>
        <MeetMapCreateModal
          createRoom={this.props.createMeetMapRoom}
          goToRoom={this.goToRoom}
          createdRoom={this.props.createdRoom}
          currentRoom={this.props.currentRoom}
          currentLocation={this.state.region}
          isPoi={this.state.isPoi}
        />
       <View style={Styles.mapDrawerOverlay} />
     </View>
    )
  }
}
const mapStateToProps= (state) =>{
  return{
    latitude: state.login.currentUser.profile.location.latitude,
    longitude: state.login.currentUser.profile.location.longitude,
    groupRooms: state.meet_map.group_rooms,
    currentRoom: state.meet_map.currentRoom,
    createdRoom: state.meet_map.createdRoom,
    success: state.meet_map.success,
    loading: state.meet_map.loading
  }

}
const mapDispatchToProps= (dispatch) =>{
  return{
      setCurrentRoom: (room) => dispatch(MeetMapActions.setCurrentMeetMapRoom({room})),
      resetMeetMapSuccess: () => dispatch(MeetMapActions.resetMeetMapSuccess()),
      requestToJoin: (roomId) => dispatch(MeetMapActions.requestToJoin({ roomId })),
      rejectJoinRequest: (roomId) => dispatch (MeetMapActions.rejectJoinRequest({roomId})),
      acceptJoinRequest: (roomId, message) => dispatch (MeetMapActions.rejectJoinRequest({ roomId, message })),
      createMeetMapRoom: (title, currentLocation, users) => dispatch(MeetMapActions.createMeetMapRoom({
          title,
          location: {latitude: currentLocation.latitude, longitude: currentLocation.longitude},
          users
        })
      )
      // updateLocation: (currentUserId, lat, lon) =>dispatch(LoginActions.updateLocation(currentUserId, lat, lon),
    }

}
export default connect(mapStateToProps, mapDispatchToProps)(MeetMap)

