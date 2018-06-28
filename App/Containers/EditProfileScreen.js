import React from "react";
import { connect } from "react-redux";
import {
  Alert,
  PanResponder,
  RefreshControl,
  StatusBar,
  Animated,
  Platform,
  StyleSheet,
  Image,
  BackHandler,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  findNodeHandle,
  Slider,
} from "react-native";
import {
	Card,
	CardItem,
	Text,
	View,
	Thumbnail,
	Content,
	Label,
	Form,
	Item,
	Textarea,
	Title,
	Button,
	Left,
	Right,
	Body,
} from "native-base";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-datepicker';
import MultiSelect from '../Components/MultiSelect';
import ModalDropdown from 'react-native-modal-dropdown';
import SlideUpPanel from '../Components/SlideUpPanel';
import ProfileImagesComponent from '../Components/ProfileImagesComponent'
import ProfileImageSwitcher from '../Components/ProfileImageSwitcher'
import AppConfig from '../Config/AppConfig';
import AnimatedProfileHeader from '../Components/AnimatedProfileHeader'
import ChatActions from '../Redux/ChatRedux';
import LoginActions from '../Redux/LoginRedux';
import SwipeActions from '../Redux/SwipeRedux';

const RCTUIManager = require('NativeModules').UIManager;

import I18n from '../I18n';
import _styles from './Styles/EditProfileScreenStyles'
// import Icon from 'react-native-vector-icons/Ionicons'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

import LEGAL_AGE from '../Config/SettingsConfig'
import { Fonts } from '../Themes'

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

var dateObj = new Date();
const MONTH = dateObj.getUTCMonth() + 1; //months from 1-12
const DAY = dateObj.getUTCDate();
const YEAR = dateObj.getUTCFullYear() - LEGAL_AGE;

class EditProfileScreen extends React.Component {
	constructor(props){
		super(props)
		this.screenChoices = {
		  aboutMe: 0,
		  imageSwitcher: 1,
		  interestedIn: 2,
		  gender: 3,
		  birthday: 4,
		  privacy: 5,
		  maxDistance: 6,
		  resetSwipe:7,
		  generalSettings: 8,

		}
		this.state ={
		  ...props.navigation.state.params,
		  layout:{
         height:deviceHeight,
         width:deviceWidth,
      },
      scrollY: new Animated.Value(
        // iOS has negative initial scroll value because content inset...
        Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
      ),
      footerScrollY: new Animated.Value(
        // iOS has negative initial scroll value because content inset...
        Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
      ),
      currentScreen: this.screenChoices.aboutMe,
      scrollViewSize:0,
      scrollViewSize2:0,
      currentDistance: props.currentUser.profile.max_distance,
      startDistance: props.currentUser.profile.max_distance,
      aboutMe: props.currentUser.profile.about_me,
      upDownIcon: 'swap-vertical',
      refreshing: false,
		}
	}
	componentDidMount() {
		BackHandler.addEventListener("hardwareBackPress", () => {
			this.props.navigation.goBack();
			return true;
		});
	}
  _blockedFunc(blocked, roomId, userId){
    return blocked ? this.props.unblockUser(roomId, userId) : this.props.blockUser(roomId, userId)
  }

  _blockedText(blocked){
    return blocked ? I18n.t('unblock') : I18n.t('block');
  }

  _onLayout = event => {
    this.setState({
      layout:{
        height:event.nativeEvent.layout.height,
        width:event.nativeEvent.layout.width,
      }
    });
    this.measureScrollView()
  }

  _renderScrollView(){
    return null
  }

  _renderHeader(){
    return null
  }

  _renderFooter(){
    return null
  }
  //_onDrag = (value) =>{
  //}

  changeScreen(currentScreen){
    this.setState({currentScreen});
  }

  _renderCurrentSlideUpPanelView(){
    switch (this.state.currentScreen) {
      case this.screenChoices.aboutMe:
        return this._renderProfileAbout();
        break;

      case this.screenChoices.imageSwitcher:
        return this._renderImageSwitcher();
        break;

      case this.screenChoices.interestedIn:
        return this._renderInterestedInSelect();
        break;

      case this.screenChoices.gender:
        return this._renderGenderSelect();
        break;

      case this.screenChoices.birthday:
        return this._renderBirthday();
        break;

      case this.screenChoices.privacy:
        return this._renderPrivacySelect();
        break;

      case this.screenChoices.maxDistance:
        return this._renderMaxDistanceSlider();
        break;

      case this.screenChoices.resetSwipe:
        return this._renderSwipeReset();
        break;

      default:
        break;
    }
    return null;
  }

  _renderSlideUpPanel=(dragHandlers)=>{
    const { navigation } = this.props
    let topIconViews = []
    return (
          <View style={styles.footer} >
            <View style={styles.panelHeader}>
              { this._renderGeneralSettingsDropdown() }
              <Animated.View
                style={{flex:4}} {...dragHandlers}>
                <Icon name={this.state.upDownIcon} size={25} style={{color: '#FFF', textAlign:'center'}}/>
              </Animated.View>
              <TouchableOpacity style={{flex:1}} onPress={()=>this.changeScreen(this.screenChoices.imageSwitcher)}>
                <Icon name={'image-filter'} style={{textAlign:'center'}} size={25}/>
              </TouchableOpacity>
            </View>
            <Animated.ScrollView style={[
              styles.bottomInfo,
              {
                transform: [
                    //{ translateY: footerHeightTranslate},
                ],
              }]
             }ref={el=>this.scrollView2=el}
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.footerScrollY } } }],
                { useNativeDriver: true },
              )}>
              {this._renderCurrentSlideUpPanelView()}
            </Animated.ScrollView>
          </View>
    )

  }

  _renderForm(){
    return null
  }

  handleAboutMeText = (text) => this.setState({ aboutMe: text });

  _renderProfileAbout(){
    return (
      <Form style={_styles.info}>
          <Label style={_styles.usernameText}>About Me</Label>
          <Textarea bordered
            rowSpan={5}
            style={styles.textarea}
            value={ this.state.aboutMe }
            onChangeText={this.handleAboutMeText}
            />
      </Form>
    )
  }

  _renderImageSwitcher(){
    return (
      <ProfileImageSwitcher
        navigation={this.props.navigation}
        setPriority={this.props.switchPriority}
        images={this.props.currentUser.profile.images }
        success={this.props.profileSuccess}
        resetSuccess={this.props.resetLoginSuccess}/>
    )
  }
  _renderDropdownIcon(){
      let icon = null;
      switch (this.state.currentScreen) {
        case this.screenChoices.aboutMe:
          icon = <Icon style={{textAlign:'center'}} name="comment-outline" size={25}/>;
          break;

        case this.screenChoices.imageSwitcher:
          icon = <Icon style={{textAlign:'center'}} name="image-filter" size={25}/>;
          break;

        case this.screenChoices.interestedIn:
          icon = <Icon style={{textAlign:'center'}} name="human-male-female" size={25}/>;
          break;

        case this.screenChoices.gender:
          icon = <Icon style={{textAlign:'center'}} name="gender-male-female" size={25}/>;
          break;

        case this.screenChoices.birthday:
          icon = <Icon style={{textAlign:'center'}} name="cake-variant" size={25}/>;
          break;

        case this.screenChoices.privacy:
          icon = <Icon style={{textAlign:'center'}} name="incognito" size={25}/>;
          break;

        case this.screenChoices.maxDistance:
          icon = <Icon style={{textAlign:'center'}} name="airplane" size={25}/>;
          break;

        case this.screenChoices.resetSwipe:
          icon = <Icon style={{textAlign:'center'}} name="cards" size={25}/>;
          break;

        default:
          icon = <Icon style={{textAlign:'center'}} name="settings" size={25}/>;
          break;
      }
      return icon;
    }

  _renderGeneralSettingsDropdown(){
  const options = ['Bio','Interested In', 'Gender', 'Birthday', 'Privacy', 'Max Distance', 'Reset Swipes'];
    return (
      <ModalDropdown
        style={{flex:1}}
        dropdownStyle={{ width:180 }}
        options={options}
        defaultIndex={0}
        onSelect={(idx, value) => this._onDropdownSelect(idx, value)}>
        { this._renderDropdownIcon() }
      </ModalDropdown>
    )
  }

  _onDropdownSelect(idx, value){
  console.log(idx, value)
    switch (idx){
      case "0": // about me
        this.changeScreen(this.screenChoices.aboutMe)
        break;
      case "1": // interested in
        this.changeScreen(this.screenChoices.interestedIn);
        break;
      case "2": // gender
        this.changeScreen(this.screenChoices.gender);
        break;
      case "3": // birthday
        this.changeScreen(this.screenChoices.birthday);
        break;
      case "4": // privacy
        this.changeScreen(this.screenChoices.privacy);
        break;
      case "5": // max distance
        this.changeScreen(this.screenChoices.maxDistance);
        break;
      case "6": // reset swipes
        this.changeScreen(this.screenChoices.resetSwipe);
        break;
      default:
        break;
    }
  }
  _renderInterestedInSelect(){
    return (
      <MultiSelect key={'interested_multi'}
        selected={this.props.currentUser.profile.interested_in}
        onItemSelected={ (data)=>this.props.patchProfile({p_id: this.props.currentUser.profile.id, interested_in: data})}
        isMulti={true}
      />
    )
  }

  _renderGenderSelect(){
    return (
      <MultiSelect key={'gender_multi'}
        selected={this.props.currentUser.profile.gender}
        onItemSelected={ (data)=>this.props.patchProfile({p_id: this.props.currentUser.profile.id, gender: data}) }
        isMulti={false}
      />
    )
  }

  _renderPrivacySelect(){
    return (
      <MultiSelect key={'privacy_multi'}
        selected={this.props.currentUser.profile.is_private ? 1 : 0}
        choices={[{key: 1, label:'Incognito', icon: 'incognito'}]}
        onItemSelected={ (data)=>this.props.patchProfile({p_id: this.props.currentUser.profile.id, is_private: data}) }
        isTF={true}
        isMulti={false}
      />
    )
  }
  setMaxDistance=(distance)=> {
    // only save if the value has actually changed
    distance !== this.state.startDistance && this.props.patchProfile({p_id: this.props.currentUser.profile.id, max_distance:distance})
    this.setState({startDistance:distance})
  };
  setCurrentDistance=(distance)=>{
    this.setState({currentDistance: distance});
  }
  _renderMaxDistanceSlider(){
    return (
    <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
      <Slider
        key={'max_distance_slider'}
        style={{ width: 300, marginVertical: 25, alignSelf: 'center' }}
        minimumValue={0}
        maximumValue={250}
        onValueChange={this.setCurrentDistance}
        onSlidingComplete={this.setMaxDistance}
        step={25.00}
        disabled={false}
      />
      <Text style={styles.usernameText}>{ `${this.state.currentDistance} kms` }</Text>
    </View>
    )
  }

  _renderBirthday(){
    const { birthday } = this.props;
    return (
      <DatePicker
        style={{alignSelf:'center', width: 200, margin:30}}
        date={birthday}
        mode="date"
        placeholder={"Select Date"}
        format="YYYY-MM-DD"
        minDate="1917-05-01"
        maxDate= {`${YEAR}-${MONTH}-${DAY}`}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        //iconComponent={<Icon style={_styles.dateIcon} name="cake-variant" size={40} />}
        showIcon={false}
        customStyles={{
          dateInput: {
            textAlign:'center',
            backgroundColor:'white',
            borderRadius:2,
          },
          dateText:{
            ...Fonts.style.lobsterMd,
            ...Fonts.shadow.sm,
          },
          placeholderText:{
            ...Fonts.style.lobsterMd,
          },
        }}
        onDateChange={this._dateChanged}
      />
    )
  }

  _dateChanged=(date)=>{
    this.props.patchProfile({
      p_id: this.props.currentUser.profile.id,
      date_of_birth: `${date} 00:00:00`
    })
  }

  _handleSwipeReset=()=>{
    Alert.alert('Reset Swipe Deck', 'Are you sure you want to reset all of your user likes?',
    [
      {text: 'Cancel', onPress: ()=>null, style: 'cancel'},
      {text: 'Do it!', onPress: ()=>this.props.resetSwipes({ p_id: this.props.currentUser.profile.id })
      }
    ])
  }

  _renderSwipeReset(){
    return (
      <TouchableOpacity
        onPress={this._handleSwipeReset}
        style={
          {
            height:150,
            width:150,
            alignSelf: 'center',
            alignItems:'center',
            justifyContent:'center',
            backgroundColor:'white',
            elevation:7,
            borderRadius:75,
            margin:15,
          }
        }
        activeOpacity={0.8} >
        <Icon size={100} style={
          {
            color: 'indianred',
            textAlign:'center'
          }
        }
        name={'alert'} />
      </TouchableOpacity>
    )
  }
  measureScrollView() {
    // Use RCTUIManager and findNodeHandle because of a bug that results in the measure
    // function missing on initialized components.
    RCTUIManager.measure(findNodeHandle(this.scrollView), this.setScrollViewSize);
    RCTUIManager.measure(findNodeHandle(this.scrollView2), this.setScrollView2Size);
  }

  setScrollViewSize= (ox, oy, width, height, px, py) =>{
    __DEV__ && console.log({ox, oy, width, height, px, py});
    this.setState({ scrollViewSize: height - py - (HEADER_MAX_HEIGHT*2) - (HEADER_MIN_HEIGHT*2) -10});
  }
  setScrollView2Size= (ox, oy, width, height, px, py) =>{
       __DEV__ && console.log({ox, oy, width, height, px, py});
       this.setState({ scrollViewSize2: height });
     }
	render() {
    let {layout, scrollViewSize, scrollViewSize2, scrollY} = this.state;
    const { username, profile } = this.props.currentUser;
	  const cover = profile.cover_image_url
	  const noBorders = {borderLeftWidth:0, borderRightWidth:0,borderTopWidth:0}

	  const scrollYAnim = Animated.add(
      this.state.scrollY,
      Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
    );

	  const footerScrollY = Animated.add(
      this.state.footerScrollY,
      Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
    );

		return (
		<View style={styles.fill} onLayout={this._onLayout}>
		  <Animated.ScrollView
        style={styles.fill}
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        //refreshControl={
        //  <RefreshControl
        //    refreshing={this.state.refreshing}
        //    onRefresh={() => {
        //      this.setState({ refreshing: true });
        //      setTimeout(() => this.setState({ refreshing: false }), 1000);
        //    }}
        //    // Android offset for RefreshControl
        //    progressViewOffset={HEADER_MAX_HEIGHT}
        //  />
        //}
        // iOS offset for RefreshControl
        contentInset={{
          top: HEADER_MAX_HEIGHT,
        }}
        contentOffset={{
          y: -HEADER_MAX_HEIGHT,
        }}
		    >
			  <Card
        ref={el=>this.scrollView=el} style={_styles.card} width={layout.width-4}>
          <ProfileImagesComponent images={profile.images} layout={layout}/>
        </Card>
			</Animated.ScrollView>
			<AnimatedProfileHeader coverImage={cover} scrollViewSize={scrollViewSize} scrollY={scrollYAnim}>
			  <View style={_styles.info2}>
          <Left style={_styles.profileLeft}>
            <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
             <Thumbnail style={{height:45,width:45}} source={{uri: profile.profile_image}}/>
            </TouchableOpacity>
            <Text style={_styles.usernameText}>{ `\t${username}` }</Text>
          </Left>
          <Right>
            <View style={_styles.ageDistanceAside}>
              <Text style={_styles.ageText}>{ profile.age }</Text>
              <Text style={_styles.kmText}>{ `${profile.distance} km away` }</Text>
            </View>
          </Right>
        </View>
      </AnimatedProfileHeader>
      <SlideUpPanel
        ref={el=>this._slidePanel=el}
        visible showBackdrop={true}
        draggableRange={{
          top: layout.height,
          bottom: 60
        }}
        height={layout.height}
        startCollapsed={true}
        onRequestClose={()=>this._slidePanel.transitionTo(-HEADER_MIN_HEIGHT)}
        children={this._renderSlideUpPanel}
      />
		</View>
		);
  }
}
const mapStateToProps = (state, props) => {
	return {
		currentUser: state.login.currentUser,
    birthday: state.login.currentUser !== null && state.login.currentUser.profile.date_of_birth.split("T")[0],
		success: state.chat.success,
		profileSuccess: state.login.success,
	};
};
const mapDispatchToProps = dispatch => {
  return {
    resetSwipes: (data) => dispatch(SwipeActions.deleteVotesRequest(data)),
    patchProfile: (data) => dispatch(LoginActions.patchProfileRequest(data)),
    switchPriority: (picture, image_to_switch)=> dispatch(LoginActions.switchPriorityRequest({picture, image_to_switch})),
    resetLoginSuccess: () => dispatch(LoginActions.resetLoginSuccess()),

  }
}
const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  textarea:{
    backgroundColor: 'white'
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  bar: {
    backgroundColor: 'transparent',
    //marginTop: Platform.OS === 'ios' ? 28 : 38,
    minHeight: HEADER_MIN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  footer: {
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    marginHorizontal:5,
    borderWidth: 0.4,
    borderColor: '#c3c3c3',
    overflow:'visible'
  },
  bottomInfo:{
    position: 'relative',
    width: null,
    elevation:9,
  },
  panelHeader: {
    flexGrow:1,
    flexDirection:'row',
    justifyContent:'center',
    height:60,
    width:null,
    alignItems:'center',
    maxHeight:60,
    borderTopLeftRadius: 5,
    borderTopRightRadius:5,
    backgroundColor: '#b197fc',
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
