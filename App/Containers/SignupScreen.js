import React from "react";
import {PropTypes} from 'prop-types'
import { ScrollView, Text, Image, View, Metrics } from "react-native";
import MaterialSwitch from 'react-native-material-switch'
import { Card, CardItem, Button, Text as NBText, Form, Item, Input, Label,Alert } from "native-base";
import { connect } from "react-redux";
import { Images, Fonts } from "../Themes";
import LoginActions from '../Redux/LoginRedux'
import DatePicker from 'react-native-datepicker'
import {getCoordinates} from '../Lib/LocationUtils'
import SettingsConfig from '../Config/SettingsConfig'
import ModalSelector from 'react-native-modal-selector'
import {geoWrap} from '../Wrappers/GeoWrapper'
import {backListener} from '../Wrappers/BackListener'
import {keyboardListener} from '../Wrappers/KeyboardListener'
import moment from 'moment'
// Styles
import styles from "./Styles/SignupScreenStyles";

class SignupScreen extends React.Component {
  constructor(props){
    super(props);
    // TODO send location parameters to the server and determine what the legal age is in their region/ whether they are allowed to use the application in their region
    // NOTE: Another day, let's move along, set to 420 1969 for giggles
    this.state={
      date: "1969-04-20",
      gender: "FM",
      terms: false,
      ofAge: false,
      username : { val: this.props.currentUser == null ? "" : this.props.currentUser.username, error: null, touched:false},
      pass1 : { val: "", error: null, touched:false},
      pass2 : { val: "", error: null, touched:false},
      email: { val: this.props.currentUser == null ? "" : this.props.currentUser.email, error: null, touched:false},
    }
  }
  componentWillReceiveProps(newProps){
    if(this.props.currentUser !== newProps.currentUser){
      if(this.props.currentUser !== null){
        this._setState(newProps.currentUser.username,"username")
        this._setState(newProps.currentUser.email,"email")
      }
    }
  }
  _setState(value, key){
    this.setState({
      [key]:{val: value, error:this._validate(value,key), touched:true}
    })
  }
  _validate(value,key){
    let str = ""
    switch(key){
      case "username":
        var moreThanFive = value.length > 4;
        var lessThanTwenty = value.length < 20;
        var noSpecialAtFront = new RegExp("^(?![_.-])");
        var noDoubleUnderscoresOrPeriods = new RegExp("^(?!.*[_.-]{2})");
        var noUnderscoreOrPeriodAtEnd = new RegExp("^(?<![_.-])");
        var usernameAllowedChars = /^[a-zA-Z0-9.\-_]{0,30}$/;
        if( !moreThanFive) str  += "Must be more than five characters.\n"
        if( !lessThanTwenty ) str  += "Must be less than twenty characters.\n"
        if ( !noUnderscoreOrPeriodAtEnd.test(value)) str += "No underscores or periods at the end of a username.\n"
        if ( !noDoubleUnderscoresOrPeriods.test(value)) str += "No double underscores or periods.\n"
        if ( !noSpecialAtFront.test(value)) str += "No underscore or period at the beginning of a username.\n"
        if( !usernameAllowedChars.test(value)) str += ". - and _ are allowed special characters for usernames"
        return str !== "" ? str : null;
      case "pass1":
        var moreThanEight = new RegExp( "^(?=.{8,})" );
        var oneUpperOneLower = new RegExp( "^(?=.*[a-z])(?=.*[A-Z])" )
        var specialChar = new RegExp( "^(?=.*[!@#\$%\^&\*])" )
        var oneNumber = new RegExp( "^(?=.*[0-9])" )
        if ( !moreThanEight.test( value ) ) {
            str += 'Must be more than eight characters.\n'
        }
        if ( !oneUpperOneLower.test( value ) ) {
            str += 'Need one upper and one lower case letter.\n'
        }
        if ( !specialChar.test( value ) ) {
            str += 'Need a special character in your password.\n'
        }
        if ( !oneNumber.test( value ) ) {
            str += 'Need at least one number.\n'
        }
        return str !== "" ? str : null;
      case "pass2":
        if(value !== this.pass1.props.value){
          str += "Passwords must match.\n"
        }
        return str !== "" ? str : null;
      case "email":
        // Taken from Chromium
        var emailTest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if( !emailTest.test(value)) str += "Please type a valid email address";
        return str !== '' ? str : null;
      default:
        return null;
    }
  }
  _onUsernameChanged = value => this._setState(value,"username")
  _onPass1Changed = value => this._setState(value,"pass1")
  _onPass2Changed = value => this._setState(value,"pass2")
  _onEmailChanged = value => this._setState(value,"email")
  _displayErrors=()=>{
    let {error} = this.props
    let components = []
    error = error === null ? {} : error
    if(error.hasOwnProperty('error')){
      for (var e in error.error){
      var currentError="";
      var i;
      for(i=0;i<error.error[e].length;i++){
        currentError += error.error[e][i] + "\n"
      }
      components.push(<Text key={`error_${e}_${i}`} style={{color:'red'}}>{`${e}: ${currentError}`}</Text>)
      i=0;
      currentError = ""
      }
    }
    return components
  }

  _renderError=(item)=>{
    let errors = []
    item.error !== null && errors.push(<NBText style={{color:'red'}}>
			  {item.error}
			</NBText>)
		return errors
  }
  _dateChanged = (date) => this.setState({date:date})
  _switchTerms = (value)=> this.setState({terms:value})


	render() {
	  let {username, pass1, pass2, email,latitude, date, longitude, terms, ofAge, gender } = this.state
		return (
			<View style={styles.mainContainer}>
				<Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
				<ScrollView >
					<Card style={styles.logoWrap}>
					  <CardItem style={{borderBottomWidth:0,borderTopWidth:0}} cardBody>
					    <Image source={Images.launch} style={styles.logo} />
					  </CardItem>
					</Card>
					<Form style={styles.centered}>
							<Label style={[styles.label]}> Username </Label>
							{this._renderError(username)}
							<Input
								ref="username"
								value={username.val}
								style={[styles.input,username.error !== null ? {borderColor:'red'}: {borderColor:'grey'}]}
								editable={true}
								keyboardType="default"
								returnKeyType="next"
								autoCapitalize="none"
								autoCorrect={false}
								onChangeText={this._onUsernameChanged}
								underlineColorAndroid="transparent"
							  onSubmitEditing={() => this.pass1._root.focus()}
							/>
							<Label style={[styles.label]}> Password </Label>
							{pass1.error !== null ?
							  <NBText style={{color:'red'}}>
							    {pass1.error}
							  </NBText>: undefined
							}
							<Input
								ref={ref => (this.pass1 = ref)}
								value={pass1.val}
								style={[styles.input,pass1.error !== null ? {borderColor:'red'}: {borderColor:'grey'}]}
								editable={true}
								keyboardType="default"
								returnKeyType="next"
								autoCapitalize="none"
								autoCorrect={false}
								secureTextEntry
								onChangeText={this._onPass1Changed}
								underlineColorAndroid="transparent"
								onSubmitEditing={() => this.pass2._root.focus()}
							/>
							<Label style={[styles.label]}> Password Repeat </Label>
							{pass2.error !== null ?
							  <NBText style={{color:'red'}}>
							    {pass2.error}
							  </NBText>: undefined}
							<Input
								ref={ref => (this.pass2 = ref)}
								value={pass2.val}
								style={[styles.input,pass2.error !== null ? {borderColor:'red'}: {borderColor:'grey'}]}
								editable={true}
								keyboardType="default"
								returnKeyType="next"
								autoCapitalize="none"
								autoCorrect={false}
								secureTextEntry
								onChangeText={this._onPass2Changed}
								underlineColorAndroid="transparent"
								onSubmitEditing={() => this.email._root.focus()}
							/>
            	<Label style={[styles.label]}> Email </Label>
            	{email.error !== null ?
            	  <NBText style={{color:'red'}}>
            	    {email.error}
            	  </NBText>: undefined}
            	<Input
            		ref={ref => (this.email = ref)}
            		value={email.val}
								style={[styles.input,email.error !== null ? {borderColor:'red'}: {borderColor:'grey'}]}
            		editable={true}
            		keyboardType="default"
            		returnKeyType="go"
            		autoCapitalize="none"
            		autoCorrect={false}
            		onChangeText={this._onEmailChanged}
            		underlineColorAndroid="transparent"
            	/>
              <Label style={styles.label}> Gender </Label>
               <ModalSelector
                 data={SettingsConfig.GENDER_CHOICES}
                 initValue="Female"
                 selectStyle={{width:200, elevation:1, backgroundColor:'white'}}
                 onChange={(option)=>{
                  this.setState({gender:option.key})
                 }
               }
             />
                <Label style={styles.label}> Birthday </Label>
                <DatePicker
                        style={{width: 200, marginTop:6}}
                        date={date}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate="1917-05-01"
                        maxDate= "2000-06-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                          dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                          },
                          dateInput: {
                          backgroundColor:'white',
                            marginLeft: 36,
                            borderRadius:4
                          }
                        }}
                        onDateChange={this._dateChanged}
                      />
              <Label style={styles.label}> Agree to Terms </Label>
              <View>
                <MaterialSwitch
                  onActivate={()=>{}}
                  onDeactivate={()=>{}}
                  onChangeState={(state) => this.setState({terms:state})}/>
              </View>
					</Form>
					{this._displayErrors()}
					<Button
						style={{ padding:10, marginTop:10,marginBottom:20,alignSelf: "center", height:66,
						  shadowColor: 'rgba(0, 0, 0, 0.75)',
              shadowOffset: {width: 0, height:2},
              shadowRadius: 24, elevation:5
						 }}
						onPress={()=> {
						  if(username.touched && pass1.touched && pass2.touched && email.touched
						    && username.error === null && pass1.error === null && pass2.error === null && email.error === null
						    && latitude !== null && longitude !== null) {
						      this.props.currentUser == null ? this.props.registerUser(username.val, pass1.val, pass2.val, email.val, date,""+latitude, ""+longitude, this.context.store) :
						      this.props.patchUser({
						        id:this.props.currentUser.id,
						        p_id: this.props.currentUser.profile.id,
						        username: username.val !== this.props.currentUser.username ? username.val : undefined,
						        new_password1: pass1.val,
						        new_password2: pass2.val,
						        gender: gender,
						        has_accepted_tos: terms,
						        date_of_birth: `${date} 00:00:00`
						      })
						  }else{
						    this._setState(username.val,"username")
						    this._setState(email.val,"email")
						    this._setState(pass1.val,"pass1")
						    this._setState(pass2.val,"pass2")
						  }
						}
					}
					>
					  <Text style={styles.label}> Sign Up! </Text>
          </Button>
				</ScrollView>
			</View>
		);
	}
}
const mapStateToProps = state => ({
  isAuthenticated: state.login.isAuthenticated,
  isNew: state.login.isNew,
  currentUser: state.login.currentUser,
  error: state.login.error
})
const mapDispatchToProps = dispatch => ({
	//saveUserInfoByKey: (key, user) => dispatch(LoginActions.saveUserInfoByKey(key, user)),
	patchUser: (data) => dispatch(LoginActions.patchUserRequest(data)),
	patchProfile: (data) => dispatch(LoginActions.patchProfileRequest(data)),
	registerUser: (user, pass1, pass2, email, birthday,latitude, longitude,store) => dispatch(LoginActions.registerRequest(user,pass1, pass2, email, birthday, latitude, longitude,store)),
});

SignupScreen.contextTypes = {
  store: PropTypes.object.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(keyboardListener()(backListener(geoWrap(SignupScreen,false))));
