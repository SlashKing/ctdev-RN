import React, { Component } from "react";
import {connect} from 'react-redux'
import { ScrollView, Image, BackHandler,TouchableOpacity } from "react-native";
import { List, ListItem, Text, View, Thumbnail, Content } from "native-base";
import LoginActions from '../Redux/LoginRedux'
import styles from "./Styles/DrawerContentStyles";
import { Images } from "../Themes";

class DrawerContent extends Component {
  constructor(props){
    super(props)
    let {items} = props;
    // check if link to LoginScreen (logout) is present in the items arrays
    // add a mock item with custom onPress
		!items.find(item=>item.key === "LoginScreen") &&
		  items.push({key: "LoginScreen", routeName: "LoginScreen", onPress: (nav)=> this.props.logout(nav)})
  }
  _renderListItem(item, navigation){
    let route = "";
    // setting nice names
    // TODO: Use fancy animated icons for different sections
    // TODO: TabNavigator? The Drawer will accomodate more links; maybe a combination of the two
   switch(item.routeName){
      case "ChatStack":
       route = "Chat";
       break;
      case "SwipeStack":
       route = "Find";
       break;
      case "MeetMeScreen":
       route = "Meet Map";
       break;
      case "UserStack":
        return null;
        break;
      default:
       route = "Logout";
       break;
    }
    return (
      <ListItem onPress={() => {
           item.onPress !== undefined ? item.onPress(navigation) :  navigation.navigate(item.routeName)
         }}>
       	<Text>{route}</Text>
      </ListItem>)
  }
	render() {
		let { screenProps, navigation, items, user } = this.props;
		return (
			<View style={styles.container}>
			<TouchableOpacity onPress={()=>navigation.navigate("UserStack")}>
				<Thumbnail large source={{uri: user !== null ? user.profile.profile_image:""}} style={styles.logo} />
			</TouchableOpacity>
				<Content >
					<List
						dataArray={items}
						renderRow={item => this._renderListItem(item, navigation)}
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
  // currentChatNotifications: state.chat.notifications, TODO TODO
  currentRequestApprovals: state.meet_map.currentRequestApprovals,
});
const mapDispatchToProps = dispatch => ({
  logout:(navigation)=> dispatch(LoginActions.logoutRequest(navigation)),
  // setAllChatNotificationsViewed: () => dispatch(ChatActions.setAllChatNotificationsViewed()),
})
export default connect(mapStateToProps,mapDispatchToProps)(DrawerContent);
