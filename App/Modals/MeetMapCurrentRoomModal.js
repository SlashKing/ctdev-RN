'use strict'

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Modal, TouchableOpacity, Text, View, Animated } from 'react-native';
import { Container, Content, Form, Textarea, Label, Button, Thumbnail, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PagedHorizontalFlatList from '../Components/PagedHorizontalFlatList';

import styles from './Styles/MeetMapCurrentRoomModalStyles'
import I18n from '../I18n';

export default class MeetMapCurrentRoomModal extends Component {
  static propTypes={
    goToProfile: PropTypes.func.isRequired,
    goToRoom: PropTypes.func.isRequired,
    patchRoom: PropTypes.func.isRequired,
    resetCurrentRoom: PropTypes.func.isRequired,
    setCurrentRequestToJoin: PropTypes.func.isRequired,
    setCurrentJoinRequest: PropTypes.func.isRequired,
    currentRoom: PropTypes.object,
    resetSuccess: PropTypes.func.isRequired,
    success: PropTypes.string,
    containerStyle: PropTypes.object
  }

  static defaultProps={
    goToRoom: ()=>null,
    setCurrentRequestToJoin: ()=> null,
    setCurrentJoinRequest: ()=> null,
    goToProfile: ()=>null,
    patchRoom: ()=>null,
    resetCurrentRoom: ()=>null,
    resetSuccess: ()=>null,
    success:null,
    currentRoom: null,
    containerStyle: {}
  }

  constructor(props){
    super(props);
    this.state = {
      isOpen: props.currentRoom == null ? false : true,
      editing: false,
      roomTitle: props.currentRoom == null ? '': props.currentRoom.name,
    };
  }

  setModalVis(isOpen){
    this.setState({ isOpen});
  }

  openModal(){
    this.setModalVis(true);
  }

  closeModal(){
    this.setModalVis(false);
  }

  resetModal = () =>{
    this.props.resetCurrentRoom();
    if (this.props.success !== null) this.props.resetSuccess();
    this.closeModal();
  }

  componentWillReceiveProps(nextProps){
    if ( nextProps.currentRoom !== this.props.currentRoom ) {
      if(nextProps.currentRoom !== null){
        this.setTitle(nextProps.currentRoom.name);
        this.setModalVis(true);
      }else{
        this.state.isOpen && this.setModalVis(false);
      }
    }
    //if (nextProps.success !== null && this.props.success !== nextProps.success){
    //    Toast.show({
    //        text: nextProps.success,
    //        position: 'bottom',
    //        buttonText: 'Okay',
    //        duration: 2500,
    //        onClose:()=>this.props.resetSuccess() // reset redux success text but don't close modal
    //    });
    //}
  }
  _renderGoToRoomButton(){
    return (
      <Button style={[styles.button, styles.buttonRight]} onPress={ this.props.goToRoom}>
        <Text style={styles.buttonText}>Go To Room</Text>
      </Button>
    )
  }
  _renderPatchRoomButton(patchRoom){
    return (
      <Button style={[styles.button, styles.buttonRight]} onPress={ patchRoom}>
        <Text style={styles.buttonText}>Save Edits</Text>
      </Button>
    )
  }
  //patchRoomClick = () => {
  //  console.log(this.props.currentLocation)
  //  this.props.createRoom(this.state.title,this.props.currentLocation,[])
  //}

  handleInviteMessageText = (inviteMessageText) => this.setState({ inviteMessageText });

  setTitle(title){
    this.setState({title})
  }

  handleTitleText = (title) => this.setTitle(title);

  _renderTextarea(label, value, onChangeText){
    return (
      <View>
        <Label style={styles.usernameText}>{ label }</Label>
        <Textarea bordered
        rowSpan={5}
        style={styles.textarea}
        value={ value }
        onChangeText={onChangeText}
        />
      </View>
    )
  }

  _renderRequestToJoinButton(currentRoom:Object, editing:Boolean){
    return (
      <Button full style={styles.editButton}
        onPress={ ()=>{
        console.log('pressed')
          this.resetModal()
          this.props.setCurrentRequestToJoin(currentRoom);
        }
      }>

          <Animated.Text style={styles.buttonText}>
            {currentRoom.name}
          </Animated.Text>
      </Button>
    )
  }

  _renderHeader(currentRoom, editing){
  console.log(currentRoom)
    return this._renderRequestToJoinButton(currentRoom, editing);
  }

  renderModal(){
    let {currentRoom} = this.props
    console.log(currentRoom)
    if(currentRoom !== null){
      let { goToRoom, patchRoom, containerStyle } = this.props;
      const { editing } = this.state;
      return (
        <View style={[styles.overlayStyle, {backgroundColor:'#00000080'}]}>
          <View style={styles.innerStyle}>
            <PagedHorizontalFlatList ref={ el=> this.userFlatList=el }
            users={currentRoom.users.filter(u=>u.activated)} />
            <View style={styles.buttonRow}>
              <Button style={styles.button} onPress={ this.resetModal}>
                <Text style={styles.buttonText}>Return to Meet Map</Text>
              </Button>
              {
                this.state.editing !== null ?
                  this._renderGoToRoomButton() :
                   this._renderPatchRoomButton(patchRoom)
              }
            </View>
            { this._renderHeader(currentRoom, editing) }
          </View>
        </View>
      )
    }
    return null
  }
  render(){
    return (
          <Modal
            onRequestClose={this.resetModal}
            transparent={true}
            animationType={'slide'}
            visible={this.state.isOpen}>
              {this.renderModal()}
          </Modal>
    )
  }
}
