/**
  getCoordinates

  @param  that (required component instance)
  @param  watch (optional bool)
  @param  dispatch (optional bool)

  @description  Pass the component instance so we have access to the dispatch and state props when
               necessary. Setting watch to true will add a watch id to state that should be cleared
                using clearInterval(watchId)


**/
import {Toast} from 'native-base'
const WATCH_THRESHOLD = 100
function getCoordinates(that, watch=false){
  var geoOptions = {
    timeout: 50 * 1000,
    enableHighAccuracy: true,
    maximumAge: 10000,
    distanceFilter:watch ? WATCH_THRESHOLD : undefined,
  };
  var geoSuccess = function(position) {
   if(that._mounted){
      that.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          locationRetries: 0,
          error: null,
      });
    }
    that.props.updateLocation(that.props.currentProfileId, that.state.latitude, that.state.longitude);
    __DEV__ && console.log(position,that);
  };
  var geoError = function(error) {
    __DEV__ && console.log('Error occurred while retrieving the location. Error code: ' + error.code);
    if (that._mounted) {
      if (that.state.locationRetries < 2){
        that.setState({
          error: error.message ,
          locationRetrievalFailed:true,
          locationRetries: that.state.locationRetries + 1
        });
        setTimeout(()=>that.setState({locationRetrievalFailed: false}),2300);
        Toast.show({
            text: error.message,
            position: 'bottom',
            buttonText: 'Okay',
            duration: 2500
        })
        getPosition(that, watch, geoSuccess, geoError,geoOptions); // recursion till it works
        // error.code can be:
        //   0: unknown error
        //   1: permission denied
        //   2: position unavailable (error response from location provider)
        //   3: timed out / GPS provider not available
      }else{
        that.setState({
          latitude: that.props.currentUser.profile.location.latitude,
          longitude: that.props.currentUser.profile.location.longitude
        })
      }
    }

  };
  getPosition(that, watch, geoSuccess, geoError,geoOptions);
}
getPosition = (that, watch, geoSuccess, geoError,geoOptions) => {
  // set the watch id state if watch is true, otherwise, make a single geolocation request
    if(watch){
      that.setState({ watchId : navigator.geolocation.watchPosition(geoSuccess, geoError,geoOptions)})
      } else{
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError,geoOptions);
    }
}
function run(watch=false){

}
export { getCoordinates }
