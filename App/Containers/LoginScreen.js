"use strict"
import React from "react";
import {PropTypes} from 'prop-types'
import { View, ScrollView, Text, TextInput, TouchableOpacity, Image, Keyboard, LayoutAnimation } from "react-native";
import { connect } from "react-redux";
import Styles from "./Styles/LoginScreenStyles";
import { Images, Metrics } from "../Themes";
import LoginActions, {isLoggedIn} from "../Redux/LoginRedux";
import GithubActions from "../Redux/GithubRedux";
import { Button, Text as NBText, Form, Item, Input, Label } from "native-base";
import {keyboardListener} from '../Wrappers/KeyboardListener'
import {LoginManager,AccessToken,LoginButton,GraphRequest, GraphRequestManager} from 'react-native-fbsdk';

class LoginScreen extends React.Component {

	static propTypes = {
		dispatch: PropTypes.func,
		fetching: PropTypes.bool,
		attemptLogin: PropTypes.func,
	};

	isAttempting = false;
	keyboardDidShowListener = {};
	keyboardDidHideListener = {};

	constructor(props) {
		super(props);
		this.state = {
		  error:null,
		  isSigningUp: false,
		  isSocialLogin: false,
			username: "420dev",
			password: "BitchPlz123",
		};
		this.isAttempting = false;
	}

//Create response callback.
_responseInfoCallback(error: ?Object, result: ?Object) {
  if (error) {
    for (var key in error) {
      console.log(error);
    }
  } else {
    for (var key in result) {
      switch(key){
        case "first_name":
        case "last_name":
        case "middle_name":
        case "about":
        case "email":
        case "gender":
        case "age_range":
        case "birthday":
        default:
      }
      // let friendData = friends.data // array of friends who use the app

      // Test user against the database to determine whether they have an account already

      // Redirect to signup page

      // Else open the app, first send the updated information to the database
    }
          console.log(result);

    console.log('Success fetching data: ' + result.name);
  }
 }
 fbAuth = () => {
    const _this = this;

    try{
      // get the access token to test whether they already have an account
      AccessToken.getCurrentAccessToken().then(
          function(result){
            // WARNING UNEXPECTED BEHAVIOUR!!!
            // returns null `result` sometimes... use recursion to try again
            // Nice! Got the golden ticket, now let's see if we have an account for this user id in Django DB

            // request a user from Django with
            result == null ? _this.fbAuth(): _this.props.checkSocialLogin(result.accessToken, result.userID, _this.context.store)

            console.log(result)
            LoginManager.logInWithReadPermissions([
              'public_profile','email','user_friends', 'user_likes']).then(
                  function (result) {
                    if (result.isCancelled) {
                      console.log('Login was cancelled' +result);
                    } else {
                      console.log('Login was successful with permissions: '
                        + result.grantedPermissions.toString());
                        console.log(result);
                        // Create a graph request asking for user information with a callback to handle the response.
                        // TODO: do this in django so we have one source of truth for our graph request api
                         _this._graphRequest()
                    }
                  },
                  function (error) {
                    console.log('Login failed with error: ' + error);
                  }
                );
          },
          function(error){
            // TEST: What happens when the user doesn't have Facebook app installed on their phone
            console.log(error)
          })

    }catch(error){
    console.log(error);
    }
  }
  _graphRequest(){
      const infoRequest = new GraphRequest(
         '/me',
           {
             parameters: {
               fields: {
                 string: 'picture, cover, likes, about, age_range, id, email, name, first_name, middle_name, last_name, gender, relationship_status, interested_in, friends'
               }
             }
           },
         this._responseInfoCallback
       );
     // Start the graph request.
     new GraphRequestManager().addRequest(infoRequest).start();
		  this.props.isNew && this.props.navigation.navigate("SignupScreen")
  }
	componentWillReceiveProps(newProps) {
		// The startup function fetches the user's token from AsyncStorage and sets isAuthenticated
		// if true: let the user into the app without further authentication
		// TODO: could update the user's location while checking loggedin status
		/* TODO: save an expiry time for the token so we know when it needs refreshed without making additional
		         network call everytime the user logs in. Problem with this, is if they use the web application
		         and the token is refreshed, the mobile application will not be recursively updated; oh well.
		*/
		if (newProps.isAuthenticated && !newProps.isNew && this.props.expiry <= Date.now()){
		  this.props.navigation.navigate('SwipeScreen')
		}else if (newProps.isAuthenticated && newProps.isNew && newProps.isSocial){
		  // first time sign up through facebook where no account was found for the access token provided should initiate the sign up screen
		  // let's go to the sign up screen
		   //this.props.navigation.navigate("SignupScreen")
		  /* newProps.isSocial ? this.props.navigation.navigate("SocialSignupScreen") :*/
		}
	}

	componentDidMount() {
      /*** if the values from AsyncStorage tell us that the user has a valid accessToken based on the
            expiry time of the fb and JWT tokens, just navigate straight to the SwipeScreen ***/
      if(this.props.isAuthenticated && !this.props.isNew && this.props.expiry <= Date.now()){
        this.props.navigation.navigate("SwipeScreen")
      }
	}

	componentWillUnmount() {
	  this.watchId !== null && navigator.geolocation.clearWatch(this.watchId);
	}

	handlePressLogin = () => {
		const { username, password } = this.state;
		this.props.attemptLogin(username, password,this.context.store);
	};

	handleChangeUsername = text => {
		this.setState({ username: text });
	};

	handleChangePassword = text => {
		this.setState({ password: text });
	};

	render() {
		const { username, password } = this.state;
		const { fetching, topLogo } = this.props;
		const editable = !fetching;
		const textInputStyle = editable ? Styles.textInput : Styles.textInputReadonly;
		return (
			<ScrollView
				contentContainerStyle={{ justifyContent: "center" }}
				style={[Styles.container, { height: this.state.visibleHeight }]}
				keyboardShouldPersistTaps="always"
			>
				<Image source={Images.launch} style={[Styles.topLogo, {...topLogo}]} />
				<View style={Styles.form}>
					<Form>
						<Item stackedLabel>
							<Label>Username</Label>
							<Input
								ref="username"
								value={username}
								editable={editable}
								keyboardType="default"
								returnKeyType="next"
								autoCapitalize="none"
								autoCorrect={false}
								onChangeText={this.handleChangeUsername}
								underlineColorAndroid="transparent"
							  onSubmitEditing={() => this.password._root.focus()}
							/>
						</Item>
						<Item stackedLabel>
							<Label>Password</Label>
							<Input
								ref={ref => (this.password = ref)}
								value={password}
								editable={editable}
								keyboardType="default"
								returnKeyType="go"
								autoCapitalize="none"
								autoCorrect={false}
								secureTextEntry
								onChangeText={this.handleChangePassword}
								underlineColorAndroid="transparent"
								onSubmitEditing={this.handlePressLogin}
							/>
						</Item>
					</Form>
					<View style={[Styles.loginRow]}>
						<Button style={{ flex: 1, justifyContent: "center" }} full onPress={this.handlePressLogin}>
							<NBText>Sign In</NBText>
						</Button>
						<Button
							style={{ flex: 1, justifyContent: "center" }}
							full
							onPress={() => this.props.navigation.navigate("SignupScreen")}
						>
							<NBText>Sign Up</NBText>
						</Button>
					</View>
					<TouchableOpacity style={{paddingBottom:5}} onPress={this.fbAuth}>
             <Image source={{ uri:"http://192.168.0.13:8000/static/img/fb.png"}} style={{height:40, width:100,alignSelf:'center'}}/>
          </TouchableOpacity>
				</View>
			</ScrollView>
		);
	}
}

const mapStateToProps = state => {
	return {
	  isAuthenticated: state.login.isAuthenticated,
	  isNew: state.login.isNew,
	  isSocial: state.login.isSocial,
	  expiry:state.login.expiry,
		fetching: state.login.fetching,
   };
};

const mapDispatchToProps = dispatch => {
	return {
	  checkSocialLogin: (accessToken,userId,store) => dispatch(LoginActions.checkSocialLoginRequest(accessToken,userId,store)),
		attemptLogin: (username, password,store) => dispatch(LoginActions.loginRequest(username,password,store)),
	};
};

LoginScreen.contextTypes = {
  store: PropTypes.object.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(keyboardListener()(LoginScreen));
