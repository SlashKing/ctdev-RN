import React from "react";
import { DrawerNavigator, StackNavigator} from "react-navigation";

//Swipe Stack
import SwipeScreen from "../Containers/SwipeScreen";
import UserProfileScreen from "../Containers/UserProfileScreen";

//Group/Meet Stack TODO: implement group meeting capabilities in back and front-end
import MeetMeScreen from "../Containers/MeetMeScreen";

//Chat Stack
import ChatScreen from "../Containers/ChatScreen";
import ChatRoomScreen from "../Containers/ChatRoomScreen";
import CameraScreen from "../Containers/CameraScreen";


//User Logged In Stack
import EditProfileScreen from "../Containers/EditProfileScreen";
import ProfileCameraScreen from "../Containers/ProfileCameraScreen";

//Drawer
import DrawerContent from "../Containers/DrawerContent";

//Auth Stack
import LoginScreen from "../Containers/LoginScreen";
import SocialSignupScreen from "../Containers/SocialSignupScreen";
import SignupScreen from "../Containers/SignupScreen";

import styles from "./Styles/NavigationStyles";

const ChatStack = StackNavigator({
    ChatScreen: {screen:ChatScreen},
    ChatRoomScreen: {screen:ChatRoomScreen},
    UserProfileScreen: {screen:UserProfileScreen}, // duplicate in ChatStack to allow back navigation within stack
    CameraScreen: {screen: CameraScreen}
  },
  {
    initialRouteName: "ChatScreen",
    headerMode: "none"
  }
)
const SwipeStack = StackNavigator({
    SwipeScreen: {screen:SwipeScreen},
    UserProfileScreen: {screen:UserProfileScreen}
  },
	{
	  initialRouteName: "SwipeScreen",
	  headerMode:"none"
	}
);
const UserStack = StackNavigator({
    EditProfileScreen: {screen:EditProfileScreen},
    ProfileCameraScreen: {screen:ProfileCameraScreen}
  },
  {
	  initialRouteName: "EditProfileScreen",
	  headerMode:"none"
  }
);

const MeetMeStack = StackNavigator({
    MeetMeScreen: {screen:MeetMeScreen},
    MeetMeChatScreen: {screen:ChatScreen},//TODO:
    MeetMeChatRoomScreen: {screen:ChatRoomScreen},//TODO:
    UserProfileScreen: {screen:UserProfileScreen},
  },
  {
	  initialRouteName: "MeetMeScreen",
	  headerMode:"none"
  }
);

const NavigationDrawer = DrawerNavigator({
    //LoginScreen: { screen: AuthStack},
    ChatStack: { screen: ChatStack },
		SwipeStack: { screen: SwipeStack },
		UserStack: { screen: UserStack},
		MeetMeScreen: { screen: MeetMeScreen}
	},
	{
		initialRouteName: "SwipeStack",
		contentComponent: props => <DrawerContent {...props} />
	}
);

export default NavigationDrawer;
