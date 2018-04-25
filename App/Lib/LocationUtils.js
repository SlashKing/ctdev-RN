/**
  getCoordinates

  @param  that (required component instance)
  @param  watch (optional bool)
  @param  dispatch (optional bool)

  @description  Pass the component instance so we have access to the dispatch and state props when
               necessary. The watch boolean returns an id that


**/
const WATCH_THRESHOLD = 100
function getCoordinates(that, watch=false){
  var geoOptions = {
    timeout: 50 * 1000,
    enableHighAccuracy: true,
    maximumAge: 10000,
    distanceFilter:watch ? WATCH_THRESHOLD : undefined,
  };
  var geoSuccess = function(position) {
    //if(dispatch){
    //  console.log(that)
    //}
      that.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
      });
    __DEV__ && console.log(position,that.state);
  };
  var geoError = function(error) {
    __DEV__ && console.log('Error occurred while retrieving the location. Error code: ' + error.code);
    that.setState({ error: error.message , locationRetrievalFailed:true });
    setTimeout(()=>that.setState({locationRetrievalFailed: false}),2300);
    getPosition(that, watch, geoSuccess, geoError,geoOptions); // recursion till it works
    // error.code can be:
    //   0: unknown error
    //   1: permission denied
    //   2: position unavailable (error response from location provider)
    //   3: timed out / GPS provider not available

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
