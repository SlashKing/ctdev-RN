'use strict'

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Modal, TouchableOpacity, Text, View, Animated, InteractionManager, Dimensions } from 'react-native';
import { Root, Container, Form,Item, Textarea, Label, Button, Thumbnail, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SlideUpPanel from '../Components/SlideUpPanel';
import MultiSelect from '../Components/MultiSelect';
import styles from './Styles/SendRequestToJoinModalStyles';
import I18n from '../I18n';

const layout = Dimensions.get('window');
export default class SendRequestToJoinModal extends Component {

  static propTypes={
    goToRoom: PropTypes.func.isRequired,
    sendRequestToJoin: PropTypes.func.isRequired,
    resetCurrentRequestToJoin: PropTypes.func.isRequired,
    currentRequestToJoin: PropTypes.object,
    sendToUsers: PropTypes.array,
    fetchChatUsers: PropTypes.func,
    currentUser: PropTypes.number.isRequired,
    resetSuccess: PropTypes.func.isRequired,
    success: PropTypes.string,
    containerStyle: PropTypes.object,
  }

  static defaultProps={
    goToRoom: ()=>null,
    sendRequestToJoin: ()=>null,
    resetCurrentRequestToJoin: ()=>null,
    currentRequestToJoin: null,
    sendToUsers: [],
    fetchChatUsers: ()=>null,
    currentUser: -1,
    resetSuccess: ()=>null,
    success:null,
    containerStyle: {}
  }

  constructor(props){
    super(props);
    console.log(props.currentUser, props.currentRequestToJoin.join_requests)
    const { currentRequestToJoin, sendToUsers, currentUser } = props;
    this.state = {
      isOpen: currentRequestToJoin !== null ? true : false,
      inviteMessageText: '',
      invitePlaceHolderText: currentRequestToJoin.im_admin ? 'Add a message to your invitation...' : 'Add a message to catch their attention...',
      currentUser: null,
      hasRequested: !currentRequestToJoin.im_admin ? // if not admin, check if request exists else undefined
        currentRequestToJoin.join_requests.find(jr=>jr.requester===currentUser && jr) : undefined,
      hasBeenRequested: !currentRequestToJoin.im_admin ?
        currentRequestToJoin.join_requests.find(jr=>jr.requested===currentUser && jr) : undefined,
      sendToUsers: sendToUsers,
      roomTitle:currentRequestToJoin.name,
      footerScrollY: new Animated.Value(-100)
    };

    // if not admin check if a to or from join request exists in the room else false
    this.requestExists = !props.currentRequestToJoin.im_admin ?
                         (this.state.hasRequested  || this.state.hasBeenRequested) && true :
                         false;
    this.enter = new Animated.Value(0) // 0 -> 1
  }

  setModalVis(isOpen){
    this.setState({ isOpen });
  }

  openModal(){
    this.setModalVis(true);
  }

  closeModal(){
    this.setModalVis(false);
  }

  resetModal = () =>{
    this.closeModal();
    this.props.resetCurrentRequestToJoin();
    this.props.resetSuccess();
  }

  componentDidMount(){
    this.props.currentRequestToJoin.im_admin && this.props.fetchChatUsers(this.props.currentRequestToJoin.id)

    InteractionManager.runAfterInteractions(()=>Animated.spring(this.enter,
        {
          toValue:1,
          friction:4,
          useNativeDriver:true
        }).start(()=>console.log('animation callback')))
  }

  componentWillReceiveProps(nextProps){
    console.log(this.props,nextProps)
    if (nextProps.currentRequestToJoin !== this.props.currentRequestToJoin  ){

      const hasRequested = !nextProps.currentRequestToJoin.im_admin ? // if not admin, check if request exists else undefined
        nextProps.currentRequestToJoin.join_requests.find(jr=>jr.requester===this.props.currentUser && jr) : undefined
      const hasBeenRequested = !nextProps.currentRequestToJoin.im_admin ?
        nextProps.currentRequestToJoin.join_requests.find(jr=>jr.requested===this.props.currentUser && jr) : undefined

      this.setState({
        hasRequested: hasRequested,
        hasBeenRequested: hasBeenRequested,

      })
      // if not admin check if a to or from join request exists in the room else false
      this.requestExists = !nextProps.currentRequestToJoin.im_admin ?
                           (hasRequested  || hasBeenRequested) && true : false

      this.setModalVis(true);
    }
    // a request was sent to users and the available users needs updated
    // TODO: when another admin sends a request, we can just send the data via websocket, receive in redux
    // TODO: this is unnecessary, do it in redux, update currentRequestable users and currentRequestToJoin on Success and component will be updated
    if (nextProps.currentRequestToJoin.users.length !== this.props.currentRequestToJoin.users.length){
      //this.props.fetchChatUsers(this.props.currentRequestToJoin.id);
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

  _cancelJoinRequestClick = () => {
    this.props.cancelJoinRequest(
      this.props.currentRequestToJoin.id, // room id
      this.state.hasRequested.id // join request id
    )
    this._resetInviteMessage()
  }

  _rejectJoinRequestClick = () => {
    this.props.rejectJoinRequest(
      this.props.currentRequestToJoin.id, // room id
      this.state.hasBeenRequested.id // join request id
    )
  }

  _acceptJoinRequestClick = () => {
    this.props.acceptJoinRequest(
      this.props.currentRequestToJoin.id, // room id
      this.state.hasBeenRequested.id // join request id
    )
    // this.resetModal()
    // this.props.goToRoom(this.props.currentRequestToJoin)
  }

  _renderRequestToJoinButton(){
    if(this.requestExists) {
      if(this.state.hasRequested){
        if(this.state.hasRequested.is_rejected){
          return (
            <Button disabled={false}
              style={[ styles.button, styles.buttonRight, styles.danger]}
              onPress={ this._cancelJoinRequestClick}
              >
              <Text style={styles.buttonText}>Cancel Request</Text>
            </Button>
          )
        }
        return (
          <Button style={[ styles.button, styles.buttonRight, styles.danger]}
            onPress={ this._cancelJoinRequestClick}>
            <Text style={styles.buttonText}>Cancel Request</Text>
          </Button>
        )
      }
      // has been requested to be in the room
      if(this.state.hasBeenRequested){
        // rejected
        // if already rejected, give option to accept
        if (this.state.hasBeenRequested.is_rejected){
          return (
            <Button style={[ styles.button, styles.buttonRight]}
              onPress={ this._acceptJoinRequestClick}>
              <Text style={styles.buttonText}>Accept Request</Text>
            </Button>
          )
        }
        // not rejected
        // options: reject or accept
        return (
        <View style={{flex:2, flexDirection:'row'}}>
          <Button style={[ styles.button, styles.buttonRight, styles.danger]}
            danger onPress={ this._rejectJoinRequestClick}>
            <Text style={styles.buttonText}>Reject Request</Text>
          </Button>
          <Button style={[ styles.button, styles.buttonRight]}
            onPress={ this._acceptJoinRequestClick}>
            <Text style={styles.buttonText}>Accept Request</Text>
          </Button>
        </View>
        )
      }
    }
    // we are an admin user
    return (
      <Button style={[ styles.button, styles.buttonRight]}
        info onPress={ this.requestToJoinClick}>
        <Text style={styles.buttonText}>Send Request</Text>
      </Button>
    )
  }

  requestToJoinClick = () => {
  console.log(this.state.sendToUsers)
    this.props.sendRequestToJoin(
      this.props.currentRequestToJoin.id, // roomId
      this.props.currentRequestToJoin.im_admin, // admin ? is this the admin of the group
      this.state.inviteMessageText, // message
      this.props.currentRequestToJoin.im_admin ? this.usersMultiSelect.selectedData : []
    );
    this.props.currentRequestToJoin.im_admin && this.usersMultiSelect.resetSelected();
    this._resetInviteMessage()
  }

  _resetInviteMessage(){
    this.setState({ inviteMessageText:'' })
  }

  handleInviteMessageText = (inviteMessageText) => this.setState({ inviteMessageText });

  _renderTextarea(label, value, onChangeText){
    return (
        <Item rounded>
          <Textarea
            rowSpan={5}
            style={styles._textarea}
            placeholder={this.state.invitePlaceHolderText}
            value={ value }
            onChangeText={onChangeText}
          />
        </Item>
    )
  }

  _renderForm(){
  console.log(this.state.hasBeenRequested, this.state.hasRequested, this.requestExists)
    return (
      <Form style={styles.flexCenter}>
        <Text style={styles.matchText}>{ this.props.currentRequestToJoin.name }</Text>
        { this.state.hasBeenRequested && <Text style={styles.usernameText}>{this.state.hasBeenRequested.message}</Text> }
        { this.state.hasRequested && <Text style={styles.usernameText}>{this.state.hasRequested.message}</Text> }
        { !this.requestExists &&
          this._renderTextarea("Invite Message", this.state.inviteMessageText, this.handleInviteMessageText)
        }
      </Form>
    )
  }

  _renderSlideUpPanel=(dragHandlers)=>{
    const { navigation } = this.props
    let topIconViews = []
    return (
          <View style={styles.footer} >
            <Animated.View {...dragHandlers}  style={styles.panelHeader}>

              <View
                style={{flex:1}}>
                <Icon name={'swap-vertical'} size={25} style={{color: '#FFF', textAlign:'center'}}/>
              </View>
            </Animated.View>
            <Animated.ScrollView style={[
              styles.bottomInfo,
              {
                transform: [
                    //{ translateY: footerHeightTranslate},
                ],
              }]
             }ref={el=>this.scrollView2=el}
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.footerScrollY } } }],
                { useNativeDriver: true },
              )}>
              <MultiSelect
                ref={el=>this.usersMultiSelect=el}
                choices={this.props.currentRequestableUsers}
                onItemSelected={this._onUserSelected}
                numColumns={4}/>
            </Animated.ScrollView>
          </View>
    )

  }
  _onUserSelected = (data) =>{
    this.setState({sendToUsers: data})
  }
  _renderInnerContent(currentRoom){
  if ( currentRoom.im_admin ) {
    return null
  }

  }
  renderModal(){
    let { currentRequestToJoin } = this.props
    if(currentRequestToJoin !== null){
      let { sendRequestToJoin, goToRoom, containerStyle } = this.props;
      return (
        <View style={[styles.overlayStyle, {backgroundColor:'#00000080'}]}>
          <View style={styles.innerStyle}>
            <View style={styles.wrapper} >
              <TouchableOpacity style={styles.avatar} onPress={ currentRequestToJoin.im_admin ? goToRoom : ()=>null } >
                <Animated.Image
                  source={{ uri: this.state.currentUser ?
                    this.state.currentUser.profile.profile_image :
                    currentRequestToJoin.users[0].profile.profile_image
                  }}
                  style={[styles.avatar, {
                    transform:[
                      { scale: this.enter }
                    ]}
                  ]}
                />
              </TouchableOpacity>
              { this._renderForm() }
            </View>
          </View>
          {currentRequestToJoin.im_admin && <SlideUpPanel
              ref={el=>this._slidePanel=el}
              visible showBackdrop={true}
              draggableRange={{
                top: layout.height,
                bottom: 100
              }}
              height={layout.height}
              startCollapsed={false}
              onRequestClose={()=>this._slidePanel.transitionTo(-100)}
              children={this._renderSlideUpPanel}
            /> }
          <View style={styles.buttonRow}>
            <Button disabled={false} style={styles.button} onPress={ this.resetModal}>
              <Text style={styles.buttonText}>Return to Meet Map</Text>
            </Button>
            { this._renderRequestToJoinButton() }
          </View>
        </View>
      )
    }
    return null
  }
  render(){
    return (
      <Root>
          <Modal
            onRequestClose={this.resetModal}
            transparent={true}
            animationType={'slide'}
            visible={this.state.isOpen}>
              {this.renderModal()}
          </Modal>
      </Root>
    )
  }
}
