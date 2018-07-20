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
import GroupChatScreen from "../Containers/GroupChatScreen";
import GroupChatRoomScreen from "../Containers/GroupChatRoomScreen";
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


/* #########################################
 * ChatStack
 *
 *
 *
 * ######################################### */
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

/* #########################################
 * GroupChatStack
 *
 *
 *
 * ######################################### */
const GroupChatStack = StackNavigator({
    MeetMeChatScreen: {screen:GroupChatScreen},
    MeetMeChatRoomScreen: {screen:GroupChatRoomScreen},
    MeetMeUserProfileScreen: {screen:UserProfileScreen},
    MeetMeCameraScreen: {screen: CameraScreen}
  },
  {
    initialRouteName: "MeetMeChatScreen",
    headerMode: "none"
  }
)

/* #########################################
 *
 * SwipeStack
 *
 *
 * ######################################### */
const SwipeStack = StackNavigator({
    SwipeScreen: {screen:SwipeScreen},
    UserProfileScreen: {screen:UserProfileScreen}
  },
	{
	  initialRouteName: "SwipeScreen",
	  headerMode:"none"
	}
);

/* #########################################
 *
 * UserStack
 *
 *
 * ######################################### */
const UserStack = StackNavigator({
    EditProfileScreen: {screen:EditProfileScreen},
    ProfileCameraScreen: {screen:ProfileCameraScreen}
  },
  {
	  initialRouteName: "EditProfileScreen",
	  headerMode:"none"
  }
);

/* #########################################
 *
 * MeetMeStack
 *
 *
 * ######################################### */
const MeetMeStack = StackNavigator({
    MeetMeScreen: {screen:MeetMeScreen},
  },
  {
	  initialRouteName: "MeetMeScreen",
	  headerMode:"none"
  }
);

const NavigationDrawer = DrawerNavigator({
    //LoginScreen: { screen: AuthStack},
		SwipeStack: { screen: SwipeStack },
    ChatStack: { screen: ChatStack },
		MeetMeStack: { screen: MeetMeStack},
		GroupChatStack: { screen: GroupChatStack},
		UserStack: { screen: UserStack},
	},
	{
		initialRouteName: "SwipeStack",
		contentComponent: props => <DrawerContent {...props} />
	}
);

export default NavigationDrawer;
