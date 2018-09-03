import React, { Component } from "react";
import {connect} from 'react-redux'
import { Animated, ScrollView, Image, BackHandler,TouchableOpacity, FlatList } from "react-native";
import { List, ListItem, Right, Text, View, Thumbnail, Content, Badge,  } from "native-base";
import LoginActions from '../Redux/LoginRedux'
import styles from "./Styles/DrawerContentStyles";
import { Images } from "../Themes";

class DrawerContent extends Component {
  constructor(props){
    super(props)
    let {items} = props;
    // check if link to LoginScreen (logout) is present in the items arrays
    // add a mock item with custom onPress
    items.push({
      key: "MyJoinRequestsScreen",
      routeName:"Join Requests",
      onPress: nav => this.props.navigation.navigate('MyJoinRequestsScreen')
    })
    items.push({
      key: "MyMatchesScreen",
      routeName:"Matches",
      onPress: nav => this.props.navigation.navigate('MyMatchesScreen')
    })
		!items.find(item=>item.key === "LoginScreen") &&
		  items.push({key: "LoginScreen", routeName: "LoginScreen", onPress: (nav)=> this.props.logout(nav)})

    this.enter = new Animated.Value(0) // 0 >= x >= 1
  }
  componentWillReceiveProps(nextProps){
  }
  keyExtractor = (item, index) => `${item.routeName}-${index}`

  _renderListItem({item}, navigation){
    let route = "";
    let view = null;
    console.log("_renderListItem", this.props, item)
    // setting nice names
    // TODO: Use fancy animated icons for different sections
    // TODO: TabNavigator? The Drawer will accomodate more links; maybe a combination of the two
   switch(item.routeName){
      case "ChatStack":
        view = <View style={styles.row}>
          <Text>Chat</Text>
          <Right>
            <Badge style={styles.end}
              success={this.props.chatNotificationsCount > 0 ? true : undefined}
              info={this.props.chatNotificationsCount === 0 ? true : undefined}>
              <Text>{this.props.chatNotificationsCount}</Text>
            </Badge>
          </Right>
        </View>
       break;
      case "GroupChatStack":
        //route = "Meet Map Chat"
        view = <View style={styles.row}>
          <Text>Chat</Text>
          <Right>
            <Badge style={styles.end}
              success={this.props.meetMapNotificationsCount > 0 ? true : undefined}
              info={this.props.meetMapNotificationsCount === 0 ? true : undefined}>
              <Text>{this.props.meetMapNotificationsCount}</Text>
            </Badge>
          </Right>
        </View>
      break;
      case "SwipeStack":
       route = "Find";
       break;
      case "MeetMeStack":
       route = "Meet Map";
       break;
      case "Join Requests":
        view = <View style={styles.row}>
          <Text>{item.routeName}</Text>
          <Right>
            <Badge style={styles.end}
              success={this.props.currentRequestApprovals > 0 ? true : undefined}
              info={this.props.currentRequestApprovals === 0 ? true : undefined}>
              <Text>{this.props.currentRequestApprovals}</Text>
            </Badge>
          </Right>
        </View>
        break;
      case "Matches":
        view = <View style={styles.row}>
          <Text>{item.routeName}</Text>
            <Right>
            <Badge style={styles.end}
              success={this.props.currentMatches > 0 ? true : undefined}
              info={this.props.currentMatches === 0 ? true : undefined}>
              <Text>{this.props.currentMatches}</Text>
            </Badge>
          </Right>
        </View>
        break;
      case "UserStack":
        return null
      default:
       route = "Logout";
       break;
    }
    return (
      <ListItem onPress={() => {
           item.onPress !== undefined ? item.onPress(navigation) :  navigation.navigate(item.routeName)
         }}>
       	{view == null ? <Text>{route}</Text> : view }
      </ListItem>)
  }
	render() {
		let { screenProps, navigation, items, user } = this.props;
		return (
			<View style={styles.container}>
			<TouchableOpacity style={[styles.logo, styles.logoWrap]}
			  onPress={()=>navigation.navigate("UserStack")}>
				<Thumbnail
				  source={{uri: user !== null ? user.profile.profile_image:""}}
				  style={styles.logo} />
			</TouchableOpacity>
				<Content >
					<FlatList
						data={items}
						extraData={
						  {
						    currentMatches: this.props.currentMatches,
						    chatNotificationsCount: this.props.chatNotificationsCount,
						    meetMapNotificationsCount: this.props.meetMapNotificationsCount
						  }
						}
						renderItem={item => this._renderListItem(item, navigation)}
					/>
				</Content>
			</View>
		);
	}
}

const mapStateToProps = state => ({
  user: state.login.currentUser,
  /*
  * currentRoom gets updated from the websocket to tell the user about a recent room notification
  * It is placed here to update the badge telling how many notifications there are for the meet map
  */
  currentRoom: state.meet_map.currentRoom,
  currentMatches: state.swipe.remainingMatches.length,
  currentRequestApprovals: state.meet_map.currentRequestApprovals.length,
  chatNotificationsCount: state.chat.notificationsCount,
  meetMapNotificationsCount: state.meet_map.notificationsCount
});
const mapDispatchToProps = dispatch => ({
  logout:(navigation)=> dispatch(LoginActions.logoutRequest(navigation)),
  // setAllChatNotificationsViewed: () => dispatch(ChatActions.setAllChatNotificationsViewed()),
})
export default connect(mapStateToProps,mapDispatchToProps)(DrawerContent);
