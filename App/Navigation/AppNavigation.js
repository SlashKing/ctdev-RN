import React from "react";
import { StackNavigator } from "react-navigation";
import styles from "./Styles/NavigationStyles";

// screens identified by the router
import LoginScreen from "../Containers/LoginScreen";
import SocialSignupScreen from "../Containers/SocialSignupScreen";
import SignupScreen from "../Containers/SignupScreen";
import UserProfileScreen from "../Containers/UserProfileScreen";
import ChatRoomScreen from "../Containers/ChatRoomScreen";
import NavigationDrawer from "./NavigationDrawer";

const AuthStack = StackNavigator({
		LoginScreen: { screen: LoginScreen },
		SocialSignupScreen: { screen: SocialSignupScreen },
		SignupScreen: { screen: SignupScreen }
		})
const PrimaryNav = StackNavigator(
	{
		LoginScreen: { screen: LoginScreen },
		SocialSignupScreen: { screen: SocialSignupScreen },
		SignupScreen: { screen: SignupScreen },
		NavigationDrawer: { screen: NavigationDrawer },
	  UserProfileScreen: { screen: UserProfileScreen},
	  ChatRoomScreen: {screen: ChatRoomScreen}
	},
	{
		initialRouteName: "LoginScreen",
		headerMode: "none",
	}
);

export default PrimaryNav;
