'use strict'

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Modal, TouchableOpacity, Text, View } from 'react-native';
import { Container, Content, Form, Textarea, Label, Item, Button, Thumbnail, Toast } from 'native-base';
import MaterialSwitch from 'react-native-material-switch'

import styles from './Styles/MeetMapCreateModalStyles'
import I18n from '../I18n';

export default class MeetMapCreateModal extends Component {

  static propTypes={
    createRoom: PropTypes.func.isRequired,
    goToRoom: PropTypes.func.isRequired,
    resetCreatedRoom: PropTypes.func.isRequired,
    setCurrentRoom: PropTypes.func.isRequired,
    createdRoom: PropTypes.object,
    currentLocation: PropTypes.object,
    fetchChatUsers: PropTypes.func,
    currentUser: PropTypes.number.isRequired,
    resetSuccess: PropTypes.func.isRequired,
    success: PropTypes.string,
    containerStyle: PropTypes.object,
    isPoi: PropTypes.bool.isRequired,
  }

  static defaultProps={
    goToRoom: ()=>null,
    resetCreatedRoom: ()=>null,
    setCurrentRoom: ()=>null,
    createdRoom: null,
    currentLocation: null,
    fetchChatUsers: ()=>null,
    currentUser: -1,
    resetSuccess: ()=>null,
    success:null,
    containerStyle: {},
    isPoi: false
  }

  constructor(props){
    super(props);
    this.state = {
      isOpen: false,
      currentLocation: props.currentLocation,
      inviteMessageText: '',
      roomTitle:'',
      privacy: false,
    };
  }
  componentDidMount(){
    //this.props.fetchChatUsers(0)
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps)
    if (nextProps.currentLocation !== this.props.currentLocation  ){
      this.props.fetchChatUsers(0)
      this.setModalVis(true);
    }
    if( nextProps.createdRoom !== this.props.createdRoom){
      //this.setState({ roomCreated: nextProps.createdRoom == null ? false : true});
      if(nextProps.createdRoom == null){
        this.setModalVis(false);
      }else{
        this.resetModal()
        this.props.setCurrentRoom(nextProps.createdRoom);
      }
    }
  /*
    if (this.props.currentRequestApprovals.length < nextProps.currentRequestApprovals.length) {
      // if a requestApproval comes in short succession of another, we remove the timeout to add the users
      // ** Performance and UX enhancement, reduces the calls made to add users to the group
      //  IE. imagine 20 or 100 requests coming in a matter of 10 seconds, this would get called 20 to 100 times.
      //  However, the way this is engineered, as long as those requests came within the timeout set, subsequent requests
      //  would be batched together while adding users. The timeout is short because if we wait too long, the UX
      //  would suffer.

      if (this._approvalsTimeout !== null) clearTimeout(this._approvalsTimeout);
      if (nextProps.currentGroup == null) {
        this.setModalVis(false);
      } else{
        this._approvalsTimeout = setTimeout(()=>{
          this.setModalVis(true);
          this._approvalsTimeout = null;
        },2000)
      }
    }
  */
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

  setCurrentLocation(currentLocation){
    this.setState({currentLocation});
  }

  resetModal = () =>{
    this.closeModal();
    this.props.resetCreatedRoom();
    //this.props.resetSuccess();
  }

  _renderCreateGroup(){
    return null
  }

  _renderRequestApproval(){
    return null
  }

  setCurrentRequestApprovalsCount(currentRequestApprovalsCount){
    this.setState({ currentRequestApprovalsCount })
  }

  _renderCreateRoomButton(){
    return (
      <Button style={[styles.button, styles.buttonRight]} onPress={ this.createRoomClick}>
        <Text style={styles.buttonText}>Create Room</Text>
      </Button>
    )
  }
  _renderGoToRoomButton(goToRoom){
    return (
      <Button style={[styles.button, styles.buttonRight]} onPress={ goToRoom}>
        <Text style={styles.buttonText}>Go To Room</Text>
      </Button>
    )
  }
  createRoomClick = () => {
    console.log(this.props.currentLocation)
    this.props.createRoom(this.state.title,this.props.currentLocation,[], this.state.privacy)
  }

  handleInviteMessageText = (inviteMessageText) => this.setState({ inviteMessageText });

  handleTitleText = (title) => this.setState({ title });

  _renderTextarea(label, value, onChangeText, rowSpan=1){
    return (
      <View>
        <Label style={styles.usernameText}>{ label }</Label>
        <Textarea bordered
          rowSpan={rowSpan}
          style={styles.textarea}
          value={ value }
          onChangeText={onChangeText}
        />
      </View>
    )
  }
  _renderForm(){
    return (
      <Form style={{flexGrow:1, justifyContent:'center', alignItems:'center', alignContent:'center'}}>
        <Label style={styles.matchText}>Create New Group!</Label>
        { this._renderTextarea("Room Name", this.state.title, this.handleTitleText)}
          <Label style={styles.matchText}>Room is private?</Label>
          <MaterialSwitch
             onActivate={()=>null}
             onDeactivate={()=>null}
             onChangeState={(state) => this.setState({privacy:state})}/>
        { this._renderTextarea("Invite Message", this.state.inviteMessageText, this.handleInviteMessageText, 5)}

      </Form>
    )
  }

  renderModal(){
    let {currentLocation} = this.props
    console.log(currentLocation)
    if(currentLocation !== null){
      let { createRoom, createdRoom, navigation, goToRoom, containerStyle } = this.props;
      return (
        <View style={[styles.overlayStyle, {backgroundColor:'#00000080'}]}>
          <View style={styles.innerStyle}>
            { createdRoom !== null ?
              <TouchableOpacity style={styles.wrapper} onPress={ goToRoom } >
                <View style={styles.avatar}>
                  <Thumbnail
                    source={{uri: createdRoom.users[0].profile.profile_image}}
                    style={styles.avatar}/>
                </View>
              </TouchableOpacity> : this._renderForm()
            }
          </View>
          <View style={styles.buttonRow}>
            <Button style={styles.button} onPress={ this.resetModal}>
              <Text style={styles.buttonText}>Return to Meet Map</Text>
            </Button>
            {
              createdRoom !== null ?
                this._renderGoToRoomButton(goToRoom) :
                 this._renderCreateRoomButton()
            }
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
