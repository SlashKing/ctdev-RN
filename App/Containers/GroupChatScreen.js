import React, { Component } from 'react'
import { View, FlatList, BackHandler, Image } from 'react-native'
import { ListItem, Thumbnail, List,Content, Card, CardItem,Container, Header, Left, Right, Body, Button, Text, Title, Icon, Footer, FooterTab } from 'native-base'
import { connect } from 'react-redux'
import ChatRoomScreen from './ChatRoomScreen'
import AppConfig from '../Config/AppConfig'
import RippleLoader from '../Components/RippleLoader'
import {backListener} from '../Wrappers/BackListener'
// Styles
import styles from './Styles/ChatScreenStyle'

class GroupChatScreen extends Component {
  _renderItem = ({ item }) => {
      const user = item.users[0];
      const p_image = user.profile.profile_image;
      return (

        <Card style={{ flex: 0 , flexDirection:'row'}}>
        						<CardItem>
        							<Thumbnail
        								source={{ uri: p_image }}
        							/>
        						</CardItem>
        						<CardItem>
        							<Button onPress={()=>this.props.navigation.navigate("ChatRoomScreen", {room: {...item}})} transparent>
        								<Text>{user.username}</Text>
        							</Button>
        						</CardItem>
        						{item.isTyping ?
                      <CardItem >
                        <RippleLoader size={20}/>
                      </CardItem> : undefined
                    }
        					</Card>
      );
    };
  render () {
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title> </Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <FlatList data={this.props.rooms} keyExtractor={item => item.users[0].username} renderItem={this._renderItem} />
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
      rooms: state.chat.rooms,
      // friends: state.chat.payload.friends,

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    //getFriends:(user) => dispatch(ChatActions.fetchFriends(user)));
    //getChatRooms:(user)=> dispatch(ChatActions.fetchChatRooms(room));
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(backListener(ChatScreen))
