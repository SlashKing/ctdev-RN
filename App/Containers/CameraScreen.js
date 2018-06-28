'use strict'
import React from 'react';
import {connect} from 'react-redux';

import CameraComponent from '../Components/CameraComponent';
import ChatActions from '../Redux/ChatRedux';
import LoginActions from '../Redux/LoginRedux';

class CameraScreen extends React.Component {
  render() {
    const {sendVideoMessage, sendPictureMessage, success, navigation} = this.props;
    return <CameraComponent
      sendVideoMessage={sendVideoMessage}
      sendPictureMessage={sendPictureMessage}
      success={success}
      navigation={navigation}
      canUseVideo={true}
    />
  };
};
const mapStateToProps = (state) => {
  return {
    fetching: state.chat.fetching,
    success: state.chat.success,

    // matches: state.swipe.matches,
    // room: state.chat.currentRoom,
  }
};
const mapDispatchToProps = (dispatch) => {
   return {
    addProfilePicture: (file, filename) => {
      dispatch(LoginActions.addProfilePicture({picture:{ file, filename }}))
    },
    sendVideoMessage: (file, filename, content, room_id, mModel="Message", rModel="Room") => {
      dispatch(ChatActions.createFileMessage({
        video:{ file, filename }, content, room_id, mModel, rModel
      }))
    },
    sendPictureMessage: (file, filename, content, room_id, mModel="Message", rModel="Room") => {
      dispatch(ChatActions.createFileMessage({
        picture:{ file, filename }, content, room_id, mModel, rModel
      }))
    },
 }
};
export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen)
