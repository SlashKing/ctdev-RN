'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TextInput, View, ImageEditor, Alert } from 'react-native';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageCrop from '@remobile/react-native-image-crop';
import CameraComponent from '../Components/CameraComponent';
import styles from './Styles/CropModalStyles';

export default class CropModal extends Component{
  constructor(props){
    super(props)
    state = {
      isOpen: false,
      croppedImageURI: '',
      croppedImageB64: '',
    }
    this.onRequestClose = props.onRequestClose === undefined ?
      ()=>this.setModalVis(false) : props.onRequestClose;
  }
  static propTypes = {
    imageURI: PropTypes.object.isRequired,
    imageB64: PropTypes.object,
    onRequestClose: PropTypes.func,
    addProfileImage: PropTypes.func.isRequired, // redux action
    canUseVideo: PropTypes.bool, // remove crop ability when video is passed through
    success: PropTypes.string, // success message from server through redux
  }

  static defaultProps = {
    canUseVideo: false,
    imageURI: 'http://v1.qzone.cc/avatar/201407/07/00/24/53b9782c444ca987.jpg!200x200.jpg',
    imageB64: null,
  }


  keepOriginal = () => {
    this.setState({
      croppedImageURI: this.props.imageURI
    })
    this.props.addProfileImage({})
  }

  edit = () => {
    const cropData = this.imageCrop.getCropData();
    ImageEditor.cropImage(
      this.props.imageURI,
      cropData,
      (croppedImageURI) => {
          this.setState({croppedImageURI})
      },
      (error) => __DEV__ ? console.log(error) : null //TODO: add Alert on error
    );
  }

  setModalVis(isOpen){
    this.setState({ isOpen });
  }

  renderModal(){
    return (
      <View style={styles.container}>
        <View style={styles.buttonRow}>
          <Button onPress={this.edit}>
            <Text style={styles.button}>Crop</Text>
          </Button>
          <Button onPress={this.keepOriginal}>
            <Text style={styles.buttonRight}>Keep Original</Text>
          </Button>
        </View>
        <ImageCrop
            imageWidth={200}
            imageHeight={200}
            ref={(ref)=>this.imageCrop = ref}
            source={{uri: this.props.imageURI}} />
        <View style={styles.imageContainer}>
            <Image
                source={{uri: this.state.croppedImageURI}}
                style={styles.image}
                />
        </View>
      </View>
    );
  }

  resetModal = () => this.setModalVis(false);

  renderModal(){

    return (
      <Modal
        onRequestClose={this.onRequestClose}
        transparent={true}
        animationType={'slide'}
        visible={this.state.isOpen}>
        { this.renderModal() }
      </Modal>
    )
  }

  render(){
    return this.renderModal()
  }
}

