'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Animated, View, ViewPropTypes, TouchableWithoutFeedback, TouchableOpacity, Modal, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';
import {connect} from 'react-redux';
import styles from './Styles/ExpandedVideoStyles';
import Lightbox from 'react-native-lightbox';
class ExpandableVideo extends Component{
  static propTypes = {
    src: PropTypes.string.isRequired,
    videoStyle: PropTypes.object,
    expVideoStyle: PropTypes.object,
    overlayStyle: PropTypes.number,
    iconStyle: PropTypes.number,
    expIconStyle: PropTypes.number,
  }
  static defaultProps = {
    src: '',
    videoStyle: {},
    expVideoStyle: {},
    overlayStyle: styles.overlayStyle,
    iconStyle: styles.iconStyle,
    expIconStyle: styles.expIconStyle,
  }
  constructor(props){
    super(props);
      this.maxVolume = 1.0;
      this.volumeRate = 0.05;
      this.maxRate = 1.0;
      this.rateRate = 0.05;
      this.state = {
        rate: this.maxRate,
        volume: this.maxVolume,
        paused: true,
        mute:true,
        expanded: false,
        repeat:false,
        duration: 0.0,
        currentTime: 0.0,
      }
  }

  onLoad = (data) => {
    this.setState({duration: data.duration});
  }

  onProgress = (data) => {
    this.setState({currentTime: data.currentTime});
  }

  onEnd = () =>{
    this.replay()
  }

  replay(paused=true){
    this.player.seek(0);
    this.setState({ paused });
  }

  increaseVolume(){
    const {volume} = this.state
    volume < this.maxVolume && this.setState({ volume: volume + this.volumeRate})
  }

  decreaseVolume(){
    const {volume} = this.state
    volume > 0 && this.setState({ volume: volume - this.volumeRate})
  }

  toggleMute(){
    this.setState({ mute: !this.state.mute })
  }

  togglePause(){
    this.setState({ paused: !this.state.paused })
  }

  toggleRepeat(){
    this.setState({ repeat: !this.state.repeat })
  }

  toggleExpanded(){
    const { expanded } = this.state;
    this.setState({  expanded: !expanded, mute: !this.state.mute, paused: !this.state.paused })
  }

  getCurrentTimePercentage() {
    if (this.state.currentTime > 0) {
      return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
    } else {
      return 0;
    }
  }
  bindToggleExpanded = () => this.toggleExpanded();

  _renderVideo(modal=false){
    const flexCompleted = this.getCurrentTimePercentage() * 100;
    const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
    console.log(flexCompleted, flexRemaining)
    const { expanded, rate, volume, paused, mute, repeat } = this.state;
    const { src, videoStyle, overlayStyle, expVideoStyle, expIconStyle} = this.props;
    const style = expanded ? styles.expVideoStyle : styles.videoStyle;
    return (
    <View style={[{ flex:1}, styles.rowItem, overlayStyle]}>
      <Video source={{ uri: src, mainVer: 1, patchVer: 0 }}
        rate={rate}                  // 0 is paused, 1 is normal.
        volume={volume}                 // 0 is muted, 1 is normal.
        muted={mute}
        paused={paused}               // Pauses playback entirely.
        resizeMode="cover"           // Fill the whole screen at aspect ratio.
        repeat={repeat}                // Repeat forever.
        style={style}
        onLoad={this.onLoad}
        onEnd={this.onEnd}
        onProgress={this.onProgress}
        ref={ref =>  this.player = ref }
      />
      <View style={{position:'absolute', height: 100, top:20, left:5, right:5}}>
        <View style={styles.progress}>
          <View style={[styles.innerProgressCompleted, {flex: flexCompleted}]} />
          <View style={[styles.innerProgressRemaining, {flex: flexRemaining}]} />
        </View>
      </View>
      <View style={styles.rowItem}>
        <View style={[{ flex:1}, styles.rowItem]}>
          { volume > 0 && (<TouchableOpacity onPress={()=>this.decreaseVolume()} activeOpacity={0.9} >
              <Icon name='volume-minus' size={30} style={expIconStyle}/>
            </TouchableOpacity>)
          }
          { volume < this.maxVolume && (<TouchableOpacity onPress={()=>this.increaseVolume()} activeOpacity={0.9} >
              <Icon name='volume-plus' size={30} style={expIconStyle}/>
            </TouchableOpacity>)
          }
        </View>
        <View style={[{ flex:1}, styles.rowItem]}>
          <TouchableOpacity onPress={()=>this.togglePause()} activeOpacity={0.9} >
            <Icon name={!paused ? 'pause-circle-outline' : 'play-circle-outline'} size={90} style={expIconStyle}/>
          </TouchableOpacity>
        </View>
        <View style={[{ flex:1}, styles.rowItem]}>
          <TouchableOpacity onPress={()=>this.toggleRepeat()} activeOpacity={0.9} >
            <Icon name={repeat ? 'repeat-off' : 'repeat'} size={30} style={expIconStyle}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.toggleMute()} activeOpacity={0.9} >
            <Icon name={mute ? 'volume-high' : 'volume-off'} size={30} style={expIconStyle}/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    )
  }
  render(){
    const { expanded } = this.state;
    const { overlayStyle, iconStyle } = this.props;
    return(
    <View>
      <Modal visible={expanded} animationType="slide" transparent={true} onRequestClose={this.bindToggleExpanded}>
        {this._renderVideo(true)}
      </Modal>
      <TouchableOpacity onPress={this.bindToggleExpanded}>
        <Icon style={iconStyle} name="camcorder" />
      </TouchableOpacity>
    </View>
    )
  }
}
export default ExpandableVideo
