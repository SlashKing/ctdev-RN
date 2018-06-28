import React from "react";
import { StackNavigator } from "react-navigation";
import styles from "./Styles/NavigationStyles";

// screens identified by the router
import LoginScreen from "../Containers/LoginScreen";
import SocialSignupScreen from "../Containers/SocialSignupScreen";
import SignupScreen from "../Containers/SignupScreen";
import NavigationDrawer from "./NavigationDrawer";

const AuthStack = StackNavigator({
		LoginScreen: { screen: LoginScreen },
		SocialSignupScreen: { screen: SocialSignupScreen },
		SignupScreen: { screen: SignupScreen }
	},
	{
	  initialRouteName:"LoginScreen",
	  headerMode:"none"
	}
)
const PrimaryNav = StackNavigator(
	{
	  LoginScreen : { screen: AuthStack},
		NavigationDrawer: { screen: NavigationDrawer },
	},
	{
		initialRouteName: "LoginScreen",
		headerMode: "none",
	}
);

export default PrimaryNav;
