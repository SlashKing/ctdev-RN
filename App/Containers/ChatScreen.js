'use strict'

import React, { Component } from 'react';
import { Alert, View, FlatList, BackHandler, Text, TouchableOpacity, } from 'react-native';
import { ListItem, Thumbnail, List,Content, Card, CardItem, Badge, Container, Header, Left, Right, Body, Button, Title, Icon, Footer, FooterTab } from 'native-base';
import { connect } from 'react-redux';
import ModalDropdown from 'react-native-modal-dropdown';
import AppConfig from '../Config/AppConfig';
import RippleLoader from '../Components/RippleLoader';
import {backListener} from '../Wrappers/BackListener';
import SearchBar from '../Components/SearchBar';
import ChatActions from '../Redux/ChatRedux';
import I18n from '../I18n';
import UserReportModal from '../Modals/UserReportModal';

import styles from './Styles/ChatScreenStyle';
import { Colors } from '../Themes';

class ChatScreen extends Component {
  constructor(props){
    super(props);
  }
  _onDropdownSelect(idx, value, user, roomId){
    switch (idx){
      case "0": // Block User
        const bText = this._blockedText(user.blocked);
        Alert.alert(bText, `${I18n.t('youSure')} ${bText.toLowerCase()} ${user.username}`,
        [
          {text: bText, onPress:()=>this._blockedFunc(user.blocked, roomId, user.id)},
          {text: I18n.t('cancel'), onPress:()=>null},
        ])
        break;
      case "1": // Report User
        this.userReportModal.onDropdownSelect(user)
        break;
      case "2": // Unmatch with User
        Alert.alert(I18n.t('removeMatch'), `${I18n.t('youSure')} ${I18n.t('unmatch')} ${user.username}`,
                [
                  {text: I18n.t('unmatch'), onPress:()=>this.props.unmatchUser(roomId, user.profile.id)},
                  {text: I18n.t('cancel'), onPress:()=>null},
                ])
        break;
      default:
        break;
    }
  }

  _blockedFunc(blocked, roomId, userId){
    return blocked ? this.props.unblockUser(roomId, userId) : this.props.blockUser(roomId, userId)
  }

  _blockedText(blocked){
    return blocked ? I18n.t('unblock') : I18n.t('block');
  }

  _handleRoomNavigationClick(item){
    this.props.markRoomMessageNotificationsRead(item.id)
    this.props.navigation.navigate("ChatRoomScreen", {room: {...item}})
  }

  _handleProfileNavigationClick(user){
    this.props.navigation.navigate("UserProfileScreen",{...user})
  }

  _renderItem = ({ item }) => {
      const user = item.users[0];
      const p_image = user.profile.profile_image;
      const options = [this._blockedText(user.blocked), I18n.t('report'), I18n.t('unmatch')];
      return (

        <Card style={[styles.card, {backgroundColor: user.blocked ? Colors.lowSalmon : Colors.snow}]}>
          <CardItem style={styles.item}>
        		<TouchableOpacity onPress={()=>this._handleProfileNavigationClick(user)}
        		  style={{alignItems:'center', elevation:10,height:45, width:45, borderRadius:22.5}}>
        		  <Thumbnail style={{height:45,width:45}} source={{ uri: p_image }} />
        		</TouchableOpacity>
        		{ item.notifications_count > 0 &&
                <Badge
                  success>
                  <Text>{item.notifications_count}</Text>
                </Badge>
            }
        	</CardItem>
        	<CardItem style={styles.item}>
        		<Button onPress={()=>this._handleRoomNavigationClick(item)} transparent>
        			<Text style={styles.usernameText}>{`\t${user.username}`}</Text>
        		</Button>
        	</CardItem>
        	{item.isTyping ?
            <CardItem style={styles.item}>
              <RippleLoader size={20}/>
            </CardItem> : undefined
          }
          <Right>
            <CardItem style={styles.item}>
              <ModalDropdown dropdownStyle={{width:180}} options={options} onSelect={(idx, value) => this._onDropdownSelect(idx, value, user, item.id)}>
                <Icon name="cog" />
              </ModalDropdown>
            </CardItem>
          </Right>
        </Card>
     );
   };
  render () {
    return (
      <Container>
        <Header searchBar rounded style={styles.header}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <Icon style={styles.icon} name="menu" />
            </Button>
          </Left>
            <SearchBar
              searching={this.props.searching}
              searchTerm={this.props.searchTerm}
              onSearch={(searchTerm)=>this.props.search(searchTerm)}
              onCancel={()=>this.props.cancelSearch()}
            />
        </Header>
        <Content padder>
          <FlatList
            data={this.props.searching ? this.props.search_rooms : this.props.rooms}
            keyExtractor={item => item.users[0].username}
            renderItem={this._renderItem}
          />
          <UserReportModal
            ref={el => this.userReportModal = el}
            success={this.props.success}
            reportUser={this.props.reportUser}
            resetReport={this.props.resetReport} />
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
      rooms: state.chat.rooms,
      search_rooms: state.chat.search_rooms,
      searchTerm: state.chat.searchTerm,
      searching: state.chat.searching,
      fetching: state.chat.fetching,
      success: state.chat.success,
      error: state.chat.error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    unblockUser: (roomId, userId) => dispatch(ChatActions.unblockUser( roomId, userId )),
    blockUser: (roomId, userId) => dispatch(ChatActions.blockUser( roomId, userId )),
    unmatchUser: (roomId, userId) => dispatch(ChatActions.unmatchUser( roomId, userId )),
    reportUser: (userId, report_type, comment) => dispatch(
      ChatActions.reportUser({
        userId,
        report_type,
        comment
      })),
    markRoomMessageNotificationsRead: (roomId) => dispatch(ChatActions.markRoomMessageNotificationsRead(roomId)),
    resetReport: () => dispatch(ChatActions.reportUserSuccess({success: null})),
    search:(searchTerm) => dispatch(ChatActions.searchRooms(searchTerm)),
    cancelSearch:()=> dispatch(ChatActions.cancelRoomsSearch())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(backListener(ChatScreen))
