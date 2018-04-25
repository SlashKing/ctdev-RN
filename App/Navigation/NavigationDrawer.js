import React from "react";
import { DrawerNavigator,StackNavigator} from "react-navigation";
import ChatRoomScreen from '../Containers/ChatRoomScreen'
import ChatScreen from '../Containers/ChatScreen'
import SwipeScreen from "../Containers/SwipeScreen";
import MeetMeScreen from "../Containers/MeetMeScreen";
import DrawerContent from "../Containers/DrawerContent";
import LoginScreen from "../Containers/DrawerContent";

import styles from "./Styles/NavigationStyles";
const NavigationDrawer = DrawerNavigator({
    ChatScreen: { screen: ChatScreen },
		SwipeScreen: { screen: SwipeScreen },
		MeetMeScreen: { screen: MeetMeScreen}
	},
	{
		initialRouteName: "SwipeScreen",
		contentComponent: props => <DrawerContent {...props} />
	}
);

export default NavigationDrawer;
