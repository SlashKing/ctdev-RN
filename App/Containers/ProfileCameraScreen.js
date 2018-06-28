'use strict'
import React from 'react';
import {connect} from 'react-redux';

import CameraComponent from '../Components/CameraComponent';
import LoginActions from '../Redux/LoginRedux';

class ProfileCameraScreen extends React.Component {
  render() {
    const {addProfilePicture, success, navigation} = this.props;
    return <CameraComponent
      addProfilePicture={addProfilePicture}
      backScreen={"EditProfileScreen"}
      success={success}
      navigation={navigation}
      canUseVideo={false}
    />
  };
};
const mapStateToProps = (state) => {
  return {
    fetching: state.login.fetching,
    success: state.login.success,
  }
};
const mapDispatchToProps = (dispatch) => {
   return {
    addProfilePicture: (file, filename, priority) => {
      dispatch(LoginActions.addProfilePictureRequest({picture:{ file, filename, priority }}))
    },
 }
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileCameraScreen)
