import React, { Component } from 'react';
import { BackHandler, View, TouchableOpacity, Clipboard, Modal, Alert } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { backListener} from '../Wrappers/BackListener';
import { Content, Container,Card, CardItem, Thumbnail, Header, Left, Right, Body, Button, Text, Title, Icon, Footer, FooterTab } from 'native-base';
import { connect } from 'react-redux';
import InputToolbar from '../Components/InputToolbar';
import Video from 'react-native-video';
import ExpandableVideo from '../Components/ExpandableVideo';
import FlagModal from '../Modals/FlagModal'
import {Fonts, Colors} from '../Themes';

// Chat Reducer
import ChatActions from '../Redux/ChatRedux';

import I18n from '../I18n';

// Styles
import styles from './Styles/ChatRoomScreenStyle';

import AppConfig from '../Config/AppConfig';
import RippleLoader from '../Components/RippleLoader';

class ChatRoomScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      intervalId: -1,
      lastTyped: 0,
      content: props.navigation.state.params.content || '',
    }
  }

  _loadPreviousMessages(roomId, username){
    this.props.loadPreviousMessages(roomId,username);
  }

  onSend(messages = [],roomId,username,user) {
    const message = {...messages[0], user , content: messages[0].text};
    this.props.sendMessage(roomId, username, message.content);
  }

  isCloseToTop({ layoutMeasurement, contentOffset, contentSize }){
      const paddingToTop = 80;
      return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y;
  }

  _onInputTextChanged(content, roomId, username){
    //console.log(this.state)
    const time = new Date() - this.state.lastTyped;
    time > 12000 && this.props.sendRoomIsTyping( true, roomId ) && this.props.sendRoomActive(roomId, username)
    this.state.intervalId !== -1 && clearTimeout( this.state.intervalId )
    this.setState( {
        intervalId:
        setTimeout(() => {
            // set the typing param to false for the other user
            this.props.sendRoomIsTyping( false, roomId ) && this.props.setRoomInactiveInterval( roomId, username);
            clearTimeout( this.state.intervalId )
        }
            , 2200 )
    } );
    this.setState( { lastTyped: new Date(), content } )
  }

  _cameraScreenNav = () =>{
  console.log('onPress')
    return this.props.navigation.navigate("CameraScreen",{
      ...this.props.navigation.state.params,
      content: this.state.content,
      backRoute: false
    })
  }

  renderAccessory(props){
  console.log(props);
    return (
      <TouchableOpacity onPress={this._cameraScreenNav}
        style={styles.camAccessory}>
        <Icon style={styles.camAccessoryIcon} name="camera" />
      </TouchableOpacity>)
  }

  renderCustomView(props){
    if(props.currentMessage.video == null){
      return null
    }
    return(
      <ExpandableVideo src={props.currentMessage.video} />
    )
  }
  renderLoading(){
    return (<View style={styles.ripple}><RippleLoader /></View> )
  }
  onLongPress = (context, currentMessage) => {
    if (currentMessage !== undefined) {
      const flagText = currentMessage.has_flagged ? `${I18n.t('remove')} ${I18n.t('flag')}` : I18n.t('flag')
      const options = [flagText, 'Copy Text', I18n.t('cancel')];
      const cancelButtonIndex = options.length - 1;
      const roomId = this.props.navigation.state.params.room.id;
      context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              // Open a Modal
              if(currentMessage.has_flagged){
                this.flagModal.removeFlagAlert(currentMessage.id, roomId)
              }else{
                this.flagModal.openModal(currentMessage.id, roomId, false)
              }
              break;
            case 1:
              Clipboard.setString(currentMessage.text);
              break;
            default:
              break;
          }
        },
      );
    }
  }
  componentDidMount() {
          // Print component dimensions to console
          this.flagModal.measure( (fx, fy, width, height, px, py) => {
              console.log('Component width is: ' + width)
              console.log('Component height is: ' + height)
              console.log('X offset to frame: ' + fx)
              console.log('Y offset to frame: ' + fy)
              console.log('X offset to page: ' + px)
              console.log('Y offset to page: ' + py)
          })
      }
  render () {
    let { navigation, currentUser, messages, room, fetching }= this.props
    // ugly hack to avoid crash when logging out because the redux store gets cleared in stages
    const user = currentUser !== null ? room.users[0] : null
    /*let messages = []
    room.messages.map((message)=>{
          messages.push(<Card key={`__room_message_${message.id}`}>
             <CardItem>
               <Thumbnail source={{uri:message.user.profile.profile_image}}/>
               <Text>{message.content}</Text>
              </CardItem>
             </Card>)
           })*/
    return (
      currentUser == null ? <Container><Text>Loading</Text></Container>:
      <Container>
        <Header style={styles.header}>
          <Left>
            <Button
              transparent
              onPress={() => navigation.goBack()}
            >
              <Icon style={{color:'black'}} name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title style={styles.headerTitle}>{ `\t${room.name}`}</Title>
          </Body>
          <Right>{room.active ?
            <View style={[styles.activityIndicator, styles.active]}/>:
            <View style={[styles.activityIndicator, styles.inactive]}/>
          }</Right>

        </Header>
          <GiftedChat
            messages={messages}
            loadEarlier={true}
            isLoadingEarlier={fetching}
            renderLoadEarlier={()=> fetching ? this.renderLoading() : undefined}
            renderFooter={()=>room.isTyping ? this.renderLoading() : undefined}
            renderCustomView={props=>this.renderCustomView(props)}
            onSend={messages => this.onSend(messages, room.id, currentUser.username,user)}
            user={{ id: currentUser.id, profile:{profile_image: currentUser.profile_image}}}
            roomId={room.id}
            listViewProps={{
             scrollEventThrottle: 400,
             onScroll: ({ nativeEvent }) => {
              if (this.isCloseToTop(nativeEvent) && !fetching && !room.end ) {
                this._loadPreviousMessages(room.id, currentUser.username)
                }
              }
            }}
            onLongPress={this.onLongPress}
            isAnimated={true}
            renderAccessory={(props)=>this.renderAccessory(props)}
            renderInputToolbar={(toolbarProps)=><InputToolbar  {...toolbarProps}/>}
            onInputTextChanged={(content)=>this._onInputTextChanged(content, room.id, currentUser.username)}
          >
          </GiftedChat>
          <FlagModal
            ref={el=>this.flagModal = el}
            success={this.props.success}
            flagMessage={this.props.flagMessage}
            removeMessageFlag={this.props.removeMessageFlag}
            resetFlag={this.props.resetFlag}
          />
      </Container>

    )
  }
}

const mapStateToProps = (state,props) => {
  return {
    currentUser: state.login.currentUser,
    fetching: state.chat.fetching,
    room: state.chat.rooms !== null ? state.chat.rooms.find(room=>room.id === props.navigation.state.params.room.id): undefined,
    messages: state.chat.rooms !== null ? state.chat.rooms.find(
      room=>room.id === props.navigation.state.params.room.id).messages
        : undefined,
    success: state.chat.success
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadPreviousMessages: (roomId, username) => dispatch(ChatActions.loadPreviousMessages(roomId, username)),
    sendMessage:(roomId, user, content) => dispatch(ChatActions.sendMessage(roomId, user, content)),
    setRoomActive:(roomId, user) => dispatch(ChatActions.setRoomActive(roomId,user)),
    sendRoomActive:(roomId, user) => dispatch(ChatActions.sendRoomActive(roomId,user)),
    setRoomInactive: (roomId, user) => dispatch(ChatActions.setRoomInactive(roomId,user)),
    setRoomInactiveInterval: (roomId, user) => dispatch(ChatActions.setRoomInactiveInterval(roomId,user,true, false)),
    setRoomIsTyping: (roomId, user, isTyping) => dispatch(ChatActions.setRoomIsTyping(isTyping)),
    sendRoomIsTyping: (isTyping,roomId) => dispatch(ChatActions.sendRoomIsTyping(isTyping,roomId)),
    flagMessage: (id, reason, comment, roomId) => dispatch(ChatActions.flagMessage({id, reason, comment, roomId})),
    removeMessageFlag: (id, roomId) => dispatch(ChatActions.removeMessageFlag({id, roomId})),
    resetFlag: () => dispatch(ChatActions.flagMessageSuccess({success:null}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(backListener(ChatRoomScreen))
