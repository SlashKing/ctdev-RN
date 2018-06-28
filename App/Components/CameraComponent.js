'use strict'
import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { ScrollView, Text, Image, View, TouchableOpacity, Slider, InteractionManager, CameraRoll, Alert, Modal, BackHandler } from 'react-native';
import { Container, Button, Footer, Left, Right, Text as NBText, Body } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Images } from '../Themes';
import {RNCamera} from 'react-native-camera';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
import { whiteBalance, flash } from '../Transforms/CameraIcons';
import { flashModeOrder, wbOrder } from '../Transforms/CameraOrders'
import RippleLoader from '../Components/RippleLoader';
// Styles
import styles from "./Styles/CameraComponentStyles";

import I18n from '../I18n'

const landmarkSize = 2;
const imageQuality = 0.5; //TODO: provide crisper images for premium members?
const videoQuality = RNCamera.Constants.VideoQuality['480p'];
const maxVideoLength = 5; // seconds
const zoomStrength = 0.05;

export default class CameraComponent extends React.Component {
  static propTypes = {
    canUseVideo: PropTypes.bool,
    cropModal: PropTypes.func,
    renderMessage: PropTypes.func,
    addProfilePicture: PropTypes.func,
    sendVideoMessage: PropTypes.func,
    sendPictureMessage: PropTypes.func,
    navigation: PropTypes.object,
    backScreen: PropTypes.string,
    hasBackRoute: PropTypes.bool,
    success: PropTypes.string
  }

  static defaultProps = {
    hasBackRoute: true,
    backScreen: "ChatRoomScreen",
    renderMessage: ()=>null,
    canUseVideo: false,
    cropModal: ()=>null,
    sendVideoMessage : ()=>null,
    sendPictureMessage : ()=>null,
    success: ''
  }
  constructor(props){
    super(props)
    this.state = {
        flash: 'off',
        zoom: 0,
        autoFocus: 'on',
        depth: 0,
        type: 'back',
        whiteBalance: 'auto',
        ratio: '16:9',
        ratios: [],
        photoId: -1,
        lastPhoto: "",
        showGallery: false,
        photos: [],
        faces: [],
        isOpen: false,
        captureAudio: true,
        isVideo: props.canUseVideo,
        paused: false,
        loading: true,
        time: 0,
        maxVideoLength: maxVideoLength,
        isRecording: false,
        recorded: false,
        recordedData: null,
        base64: null
      };
  }
  componentWillMount(){
      this.setState({ loading: false });
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this._backListener);
  }

  _alertSuccess(message){
    Alert.alert(
      'Server Response',
      message,
      [
        {text: I18n.t('cancel'), onPress: ()=> this.deleteCache(), style: 'cancel'}
      ]
    );
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.success !== '' && this.props.success !== nextProps.success) this._alertSuccess(nextProps.success);
  }
  _backListener=()=>{
      this.props.hasBackRoute ?
        this.props.navigation.navigate(
          this.props.backScreen,
          {...this.props.navigation.state.params, backRoute: true
        }) :
        this.setModalVis(false)
   	return true;
  }

  componentWillUnmount(){
    BackHandler.removeEventListener("hardwareBackPress", this._backListener);
    // delete any files created from this screen on unmount
    this.deleteCache();
    this.stopTimer(); // stop the timer/stop recording
  }

  componentWillUpdate(nextProps,nextState){
  console.log(this.state, nextState)
    if (!this.state.isOpen && !this.hasPicOrVideo() && this.hasPicOrVideo(nextState)) { this.setModalVis();}
    if (this.state.isOpen && this.hasPicOrVideo() && !this.hasPicOrVideo(nextState)) {this.setModalVis(false);}
  }

  getRatios = async function() {
    const ratios = await this.camera.getSupportedRatiosAsync();
    return ratios;
  }

  toggleView() {
    this.setState({
      showGallery: !this.state.showGallery,
    })
    var options = {
      title: 'Select Avatar',
     // customButtons: [
     //   {name: 'fb', title: 'Choose Photo from Facebook'},
     // ],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info below in README)
     */
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      //else if (response.customButton) {
      //  console.log('User tapped custom button: ', response.customButton);
      //}
      else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          lastPhoto: "file://" + response.path
        });
      }
    });
  };

  toggleIsVideo(){
    this.setState({
      isVideo: !this.state.isVideo,
    })
  };

  togglePaused(){
    this.setState({
      paused: !paused
    })
  }

  toggleFacing() {
    this.setState({
      type: this.state.type === 'back' ? 'front' : 'back',
    });
  };

  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash],
    });
  };

  setRatio(ratio) {
    this.setState({
      ratio,
    });
  };

  toggleWB() {
    this.setState({
      whiteBalance: wbOrder[this.state.whiteBalance],
    });
  };

  toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
    });
  };

  zoomOut() {
    this.setState({
      zoom: this.state.zoom - zoomStrength < 0 ? 0 : this.state.zoom - zoomStrength,
    });
  };

  zoomIn() {
    this.setState({
      zoom: this.state.zoom + zoomStrength > 1 ? 1 : this.state.zoom + zoomStrength,
    });
  };
  setMaxVideoLength(max){
    this.setState({
      maxVideoLength: max,
    });
  };
  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  };

  toggleAudio() {
    this.setState({
      captureAudio: !this.state.captureAudio,
    });
  };

  setModalVis(vis = null) {
    this.setState({isOpen: vis == null ? !this.state.isOpen : vis});
  };

  deleteCache(){
   // this function is called to delete the photo or video that was saved to the cache by the camera
   if(this.state.lastPhoto !== ""){
      RNFS.unlink(this.state.lastPhoto).then(() => {
          this.setState({ lastPhoto:"" })
          console.log('Picture Deleted');
      }).catch((err) => {
        console.log(err.message); // `unlink` will throw an error, if the item to unlink does not exist
      });
    }
   if(this.state.recordedData !== null){
     RNFS.unlink(this.state.recordedData.uri).then(() => {
       this.setState({ recordedData: null })
       console.log('Video Deleted');
     }).catch((err) => {
       console.log(err.message); // `unlink` will throw an error, if the item to unlink does not exist
     });
    }
    if(this.state.isOpen) {this.setModalVis(false);} // if Modal is open, close it
  };

  startTimer = () => {
    this.timer = setInterval(() => {
      // went over the max allowed video length
      if (this.state.time > maxVideoLength - 1) {
         this.camera.stopRecording();// stop recording
         this.setState({ time: 0 }) // reset state
         this.stopTimer(); // clear timer interval
         return
      }
      // else add 1 second to state.time every 1000 ms
      this.setState({ time: this.state.time + 1 });
    }, 1000);
  };

  startRecording = () => {
    this.deleteCache();
    this.startTimer();
    this.setState({
      isRecording: true,
      recorded: false,
      recordedData: null,
    });
  };

  stopTimer = () => {
    if (this.timer) { clearInterval(this.timer);}
  };

  stopRecording = (data) => {
    this.stopTimer(); // fail safe
    this.setState({
      isRecording: false,
      recorded: true,
      recordedData: data,
      time: 0
    });
  };

  isPicture(lastPhoto = null){
    return lastPhoto !== null ? lastPhoto !== "" : this.state.lastPhoto !== "";
  };

  takePicture = async function() {

    if (this.camera) {
      const options = {quality: imageQuality, base64:true,forceUpOrientation: false, fixOrientation: true}
      this.camera.takePictureAsync(options).then(data => {
        console.log('data: ', data);
        this.setState({
          lastPhoto: data.uri,
          base64: data.base64,
        })
      }).catch(err=>{
        alert("Something went wrong while taking the picture! Our bad. Try again.")
      });
    }
  };

  isVideo(recordedData = null){
    return recordedData !== null ? recordedData !== null : this.state.recordedData !== null;
  };

  takeVideo = async function() {
    console.log(this.state.isRecording)
    if (this.camera) {
      const options = {
        quality:videoQuality,
        fixOrientation: true,
      }
      // add mute option if user has turned off the sound using UI button
      options = !this.state.captureAudio && {...options, mute:true};
      this.camera.recordAsync(options).then(data => {
        this.stopRecording(data);
        RNFS.readFile(data.uri, 'base64').then(data=>{
          console.log(data);
          this.setState({base64: data});
        }).catch(err=>console.log(err))
        console.log(data);
      }).catch(err=>{
        alert(err);
      });
      this.startRecording();
    }
  };

  hasPicOrVideo (state = null){
    return state===null ? (this.isPicture() || this.isVideo()) : (this.isPicture(state.lastPhoto) || this.isVideo(state.recordedData));
  };

  saveToCameraRoll() {
    if(!this.hasPicOrVideo()) return;
    const uri = this.isPicture() ? this.state.lastPhoto : this.state.recordedData.uri;
    const alertText = this.isPicture() ? 'Photo' : 'Video'; // TODO: I18n
    CameraRoll.saveToCameraRoll(this.state.lastPhoto)
      .then( Alert.alert('Success', `${alertText} added to camera roll!`))
      .catch(err => console.log('err:', err))
  };

  onFacesDetected = ({ faces }) => this.setState({ faces })

  onFaceDetectionError = state => console.warn('Faces detection error:', state)

  renderFace({ bounds, faceID, rollAngle, yawAngle }){
    return (
      <View
        key={faceID}
        transform={[
          { perspective: 600 },
          { rotateZ: `${rollAngle.toFixed(0)}deg` },
          { rotateY: `${yawAngle.toFixed(0)}deg` },
        ]}
        style={[
          styles.face,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}
      >
        <Text style={styles.faceText}>ID: {faceID}</Text>
        <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
        <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
      </View>
    );
  };

  renderLandmarksOfFace(face) {
    const renderLandmark = position =>
      position && (
        <View
          style={[
            styles.landmark,
            {
              left: position.x - landmarkSize / 2,
              top: position.y - landmarkSize / 2,
            },
          ]}
        />
      );
    return (
      <View key={`landmarks-${face.faceID}`}>
        {renderLandmark(face.leftEyePosition)}
        {renderLandmark(face.rightEyePosition)}
        {renderLandmark(face.leftEarPosition)}
        {renderLandmark(face.rightEarPosition)}
        {renderLandmark(face.leftCheekPosition)}
        {renderLandmark(face.rightCheekPosition)}
        {renderLandmark(face.leftMouthPosition)}
        {renderLandmark(face.mouthPosition)}
        {renderLandmark(face.rightMouthPosition)}
        {renderLandmark(face.noseBasePosition)}
        {renderLandmark(face.bottomMouthPosition)}
      </View>
    );
  };

  renderFaces() {
    return (
      <View style={styles.facesContainer} pointerEvents="none">
        {this.state.faces.map(this.renderFace)}
      </View>
    );
  };

  renderLandmarks() {
    return (
      <View style={styles.facesContainer} pointerEvents="none">
        {this.state.faces.map(this.renderLandmarksOfFace)}
      </View>
    );
  };

  renderTopButtons(){
    const curName = flash(this.state.flash);
    const wb = whiteBalance(this.state.whiteBalance);

    return ( <View style={styles.topButtonsWrapper}>
      <TouchableOpacity style={styles.flipButton} onPress={this.toggleFacing.bind(this)}>
        <Icon name={this.state.type === "front" ? "camera-rear" : "camera-front" } style={styles.flipText}/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.flipButton} onPress={this.toggleFlash.bind(this)}>
        <Icon style={styles.flipText} name={curName} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.flipButton} onPress={this.toggleAudio.bind(this)}>
        <Icon name={this.state.captureAudio ? "microphone-variant-off" : "microphone-variant"} style={styles.flipText} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.flipButton} onPress={this.toggleWB.bind(this)}>
        <Icon name={wb} style={styles.flipText} />
      </TouchableOpacity>
    </View>);
  }

  renderMessage(){
    const content = this.props.navigation.state.params.content
    if (this.props.renderMessage !== undefined) return this.props.renderMessage(content)
    return content !== '' ? (
      <View style={styles.messageWrap}>
        <Text style={styles.message}>{this.props.navigation.state.params.content}</Text>
      </View>) : null
  }

  _renderCaptureButton(){
    return !this.state.isVideo ? (
      <TouchableOpacity
        style={[styles.capture, styles.picButton, { flex: 0, alignSelf: 'flex-end'}]}
        onPress={this.takePicture.bind(this)}
      >
        <Icon style={styles.picText} name="camera" />
      </TouchableOpacity>
    ) :
    (
      <TouchableOpacity
        style={[styles.capture, styles.vidButton, { flex: 0, alignSelf: 'flex-end' }]}
        onPressIn={this.takeVideo.bind(this)}
        onPressOut={()=>this.camera.stopRecording() }
      >
        <Icon style={styles.videoText} name="video" />
      </TouchableOpacity>
    )
  }

  _renderAFSlider(){
    if(this.state.autoFocus === 'off'){
      return (
        <Slider
          style={{ width: 150, marginTop: 15, alignSelf: 'center' }}
          onValueChange={this.setFocusDepth.bind(this)}
          step={0.05}
          disabled={this.state.autoFocus === 'on'}
        />
      )
    }
    return null
  }

  _renderZoomIn(){
    return(
      <TouchableOpacity
        style={styles.zoomButton}
        onPress={this.zoomIn.bind(this)}
      >
        <Icon style={styles.flipText} name="magnify-plus"/>
      </TouchableOpacity>
    )
  }

  _renderZoomOut(){
    return(
      <TouchableOpacity
        style={styles.zoomButton}
        onPress={this.zoomOut.bind(this)}
      >
        <Icon style={styles.flipText} name="magnify-minus"/>
      </TouchableOpacity>
    )
  }

  _renderSmallBottomButtonsLeft(){
    return (
      <Left style={styles.smallBottomButtonsLeft}>
        { this._renderZoomIn() }
        { this._renderZoomOut() }
      </Left>
    )
  }

  _renderGalleryButton(){
    return(
      <TouchableOpacity
        style={[styles.zoomButton, styles.galleryButton]}
        onPress={this.toggleView.bind(this)}
      >
        <Icon style={styles.flipText} name="folder-image" />
      </TouchableOpacity>
    )
  }

  _renderSmallBottomButtonsRight(){
    return (
      <Right>
        { this._renderGalleryButton() }
      </Right>
    )
  }

  _renderSwitchButton(){

    if (!this.props.canUseVideo) return null;
    return(
      <TouchableOpacity
        style={[styles.flipButton, styles.switchButton]}
        onPress={this.toggleIsVideo.bind(this)}
      >
        <Icon style={styles.flipText} name={this.state.isVideo ? "video-switch" : "camera-switch"} />
      </TouchableOpacity>
    )
  }

  renderBottomButtonsBottom(){
    return (
      <View style={styles.smallBottomButtons}>
        { this._renderSmallBottomButtonsLeft()}
        {/*<TouchableOpacity
          style={[styles.flipButton, { flex: 0.25, alignSelf: 'flex-end' }]}
          onPress={this.toggleFocus.bind(this)}
        >
          <Icon style={styles.flipText} name={this.state.autoFocus === "on" ? "eye" : "eye-off"} />
        </TouchableOpacity>*/}
        { this._renderSwitchButton() }
        { this._renderSmallBottomButtonsRight()}
      </View>
    )
  }

  renderBottomButtonsTop(){
    return (
    <View style={styles.bottomButtonsWrapper}>
      { this._renderCaptureButton() }
      { this._renderAFSlider }
    </View>
   )
 }

  handleSendMessage=()=>{
   const isPicture = this.isPicture();
   const { base64 } = this.state;
   const { params } = this.props.navigation.state
   const imageName = isPicture ? 'chat.jpg' : 'chat.mp4'
   const handler = isPicture ? this.props.sendPictureMessage : this.props.sendVideoMessage;
   handler(
      base64,
      imageName,
      params.content,
      params.room.id
    )
  }
  renderCamera() {
    return null
    };

  handleAddProfilePic = () => {
    this.props.addProfilePicture(this.state.base64, 'profile.jpg', this.props.navigation.state.params.priority);
  }

  _isProfile(){
     return this.props.backScreen === "UserProfileScreen"
  }
    renderPreview(){
      const isPicture = this.isPicture();
      console.log(this.state.recordedData, this.state.lastPhoto);
      const isProfile = this._isProfile()

      return (
        <View style={{flex:1}}>
          {isPicture ? <Image style={{flex:1, resizeMode:'contain' }} source={{uri: this.state.lastPhoto}}/>:
           <Video source={{uri: this.state.recordedData.uri, mainVer: 1, patchVer: 0}}
                          rate={1.0}                   // 0 is paused, 1 is normal.
                          volume={1.0}                 // 0 is muted, 1 is normal.
                          muted={false}
                          paused={false}               // Pauses playback entirely.
                          resizeMode="cover"           // Fill the whole screen at aspect ratio.
                          repeat={true}                // Repeat forever.
                          style={{position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,}}
           />
          }
          <TouchableOpacity
            style={[styles.flipButton, { flex: 0.1,position:"absolute", right:10, alignSelf: 'flex-end' }]}
            onPress={this.deleteCache.bind(this)}>
            <Icon name="comment-remove" style={styles.flipText} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flipButton, { flex: 0.1,position:"absolute", left:10, top: 10, alignSelf: 'flex-end' }]}
            onPress={ isProfile ? this.handleAddProfilePic : this.handleSendMessage }>
            <Icon name="send" style={styles.flipText} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flipButton, { flex: 0.1,position:"absolute", bottom:10, alignSelf: 'flex-start' }]}
            onPress={this.saveToCameraRoll.bind(this)}>
            <Icon name="download" style={styles.flipText} />
          </TouchableOpacity>
        </View>
      )
    };
    render() {
      return this.state.loading ? <RippleLoader /> :
                   (
                     <Container>
                     <Modal
                       visible={this.state.isOpen}
                       animationType="slide"
                       transparent={true}
                       onRequestClose={() => {
                         this.deleteCache();
                        }}>{(this.hasPicOrVideo()) && this.renderPreview()}</Modal>
                     <RNCamera
                       ref={ref => {
                         this.camera = ref;
                       }}
                       style={{
                         flex: 1,
                       }}
                       type={this.state.type}
                       flashMode={this.state.flash}
                       autoFocus={this.state.autoFocus}
                       zoom={this.state.zoom}
                       whiteBalance={this.state.whiteBalance}
                       ratio={this.state.ratio}
                       faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
                       onFacesDetected={this.onFacesDetected}
                       onFaceDetectionError={this.onFaceDetectionError}
                       focusDepth={this.state.depth}
                       captureAudio={this.state.captureAudio}
                       permissionDialogTitle={'Permission to use camera'}
                       permissionDialogMessage={'We need your permission to use your phone\'s camera'}
                     >
                       {this.renderTopButtons()}
                       {this.renderMessage()}
                       {this.renderBottomButtonsTop()}
                       {this.renderBottomButtonsBottom()}
                     </RNCamera>
                     </Container>
                   );
    };
};
