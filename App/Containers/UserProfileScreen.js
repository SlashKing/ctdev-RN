import React from "react";
import { connect } from "react-redux";
import { Alert, PanResponder, RefreshControl, StatusBar, Animated, Platform, StyleSheet, Image, BackHandler, Dimensions, ScrollView, TouchableOpacity, findNodeHandle } from "react-native";
import {
	Card,
	CardItem,
	Text,
	View,
	Thumbnail,
	Content,
	Label,
	Title,
	Button,
	Left,
	Right,
	Body,
} from "native-base";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalDropdown from 'react-native-modal-dropdown';
import SlideUpPanel from '../Components/SlideUpPanel';
import ProfileImagesComponent from '../Components/ProfileImagesComponent'
import ProfileImageSwitcher from '../Components/ProfileImageSwitcher'
import AppConfig from '../Config/AppConfig';
import UserReportModal from '../Modals/UserReportModal';
import ChatActions from '../Redux/ChatRedux';
import LoginActions from '../Redux/LoginRedux';

const RCTUIManager = require('NativeModules').UIManager;

import I18n from '../I18n';
import _styles from './Styles/UserProfileScreenStyles'
// import Icon from 'react-native-vector-icons/Ionicons'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

class UserProfileScreen extends React.Component {
	constructor(props){
		super(props)
		this.state ={
		  ...this.props.navigation.state.params,
		  profile: props.isCurrentUser ? props.currentUser.profile : this.props.navigation.state.params.profile,
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
      scrollViewSize:0,
      scrollViewSize2:0,
      upDownIcon: 'arrow-expand-up',
      refreshing: false,
		}
	}
	componentDidMount() {
		BackHandler.addEventListener("hardwareBackPress", () => {
			this.props.navigation.goBack();
			return true;
		});
	}
  _onDropdownSelect(idx, value, user, roomId){
    switch (idx){
      case "0": // Block User
        const bText = this._blockedText(user.blocked);
        Alert.alert(bText, `${I18n.t('youSure')} ${bText.toLowerCase()} ${user.username}`,
        [
          {text: bText, onPress:()=>this._blockedFunc(user.blocked, roomId, user.id)},
          {text: I18n.t('cancel'), onPress:()=>null},
        ])
        break;
      case "1": // Report User
        this.userReportModal.onDropdownSelect(user)
        break;
      case "2": // Unmatch with User
        Alert.alert(I18n.t('removeMatch'), `${I18n.t('youSure')} ${I18n.t('unmatch')} ${user.username}`,
                [
                  {text: I18n.t('unmatch'), onPress:()=>this.props.unmatchUser(roomId, user.profile.id)},
                  {text: I18n.t('cancel'), onPress:()=>null},
                ])
        break;
      default:
        break;
    }
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
  _onDrag = (value) =>{
    if (value >= 400 && this.state.upDownIcon === 'arrow-expand-up') {
      this.setState({ upDownIcon: 'arrow-collapse-down' })
    }
    else if (value <= 60 && this.state.upDownIcon === 'arrow-collapse-down'){
      this.setState({ upDownIcon: 'arrow-expand-up'})
    }else{return;}

  }
  _renderSlideUpPanel=(dragHandlers)=>{
    const { isCurrentUser, hasVoted, navigation, room } = this.props
    const user = room !== undefined && room.users[0];
    const options = [this._blockedText(user.blocked), I18n.t('report'), I18n.t('unmatch')];
    return (
        <View style={styles.footer}>
          <View style={styles.panelHeader}>
            {!isCurrentUser && hasVoted &&(
              <ModalDropdown style={{flex:1}} options={options} onSelect={(idx, value) => this._onDropdownSelect(idx, value, user, room.id)}>
                <Icon name={'dots-vertical'} style={{textAlign:'center'}} size={25}/>
              </ModalDropdown>)
            }
             <Animated.View style={{flex:3}}{...dragHandlers}><Icon name={this.state.upDownIcon} size={25} style={{color: '#FFF', textAlign:'center'}}/></Animated.View>
            {!isCurrentUser && hasVoted && (<TouchableOpacity  style={{flex:1}} onPress={()=>navigation.navigate("ChatRoomScreen", {room:{...room}})}>
            <Icon style={{ textAlign:'center'}} name={'comment-outline'} size={25}/></TouchableOpacity>)}
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
            {this._renderProfileAbout()}
          </Animated.ScrollView>
        </View>
    )

  }
  _renderProfileAbout(){
    const { profile } = this.state
    const aboutMe = profile.about_me == null ? '' : `\t${profile.about_me}`;
    return (<View style={_styles.info}>
             <Label>About Me</Label>
             <Text style={_styles.aboutText}>{ aboutMe }</Text>
             <ProfileImageSwitcher
               navigation={this.props.navigation}
               setPriority={this.props.switchPriority}
               images={this.props.isCurrentUser ? this.props.currentUser.profile.images : profile.images}
               success={this.props.profileSuccess}
               resetSuccess={this.props.resetLoginSuccess}/>
           </View>)
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
    let {profile, username, layout, scrollViewSize, scrollViewSize2} = this.state
	  const cover = profile.cover_image_url
	  const noBorders = {borderLeftWidth:0, borderRightWidth:0,borderTopWidth:0}

	  const scrollY = Animated.add(
      this.state.scrollY,
      Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
    );
	  const footerScrollY = Animated.add(
      this.state.footerScrollY,
      Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
    );

    const headerTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });
    const footerTranslate = scrollY.interpolate({
      inputRange: [scrollViewSize>0 ? Math.abs(scrollViewSize/2) :0 , scrollViewSize > 0 ? scrollViewSize : 0],
      outputRange: [0, -HEADER_MAX_HEIGHT],
      extrapolate: 'clamp',
    });
    const footerHeightTranslate = footerScrollY.interpolate({
      inputRange: [0, scrollViewSize2],
      outputRange: [-40, -400],
      extrapolate: 'clamp',
    });
    console.log(scrollViewSize, scrollViewSize2)
    const imageOpacity = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
    const imageTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    const titleScale = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0.8],
      extrapolate: 'clamp',
    });
    const titleTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [-60, 0, HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });
		return (
		<View style={styles.fill} onLayout={this._onLayout}>
		  <Animated.ScrollView
        style={styles.fill}
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
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
			<Card style={_styles.card} ref={el=>this.scrollView=el} width={layout.width-4}>
        <ProfileImagesComponent images={profile.images} layout={layout}/>
      </Card>
			</Animated.ScrollView>
			<Animated.View
        style={[
          styles.header,
          { transform: [{translateY: headerTranslate }] },
        ]}
      >
      <Animated.Image
        style={[
          styles.backgroundImage,
          {
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslate }],
          },
        ]}
        source={{uri: cover}}
      />
        <Animated.View
          style={[
            styles.bar,
            {
              transform: [
                //{ scale: titleScale },
                { translateY: titleTranslate },
              ],
            },
          ]}
        >
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
        </Animated.View>
      </Animated.View>
        <SlideUpPanel
          visible showBackdrop={false}
          draggableRange={{
            top: 400,
            bottom: 40
          }}
          onDrag={this._onDrag}
          height={400}
          startCollapsed={true}
          children={this._renderSlideUpPanel}
        />
        <UserReportModal
          ref={el => this.userReportModal = el}
          success={this.props.success}
          reportUser={this.props.reportUser}
          resetReport={this.props.resetReport} />
		</View>
		);
					}
}/*           <Animated.View
                      ref={el=>this.tab = el}
                      style={[
                        styles.footer,
                        {

                          transform: [
                            //{ translateY: footerHeightTranslate },
                          ],
                        },
                      ]}
                      {...this._panResponder.panHandlers}
                    >
                      </Animated.View>        <Left style={{position:'absolute',transform: [{'translate':[0,0,1]}] , height:45,width:45,backgroundColor:'red',top:0, left:0,borderRadius: 25}}>
           //						<Button onPress={() => this.props.navigation.goBack()}>
           //							<Icon name="ios-menu" />
           //						</Button>
           //					</Left>*/

const mapStateToProps = (state, props) => {
	return {
		isCurrentUser : state.login.currentUser.profile.id === props.navigation.state.params.profile.id,
		currentUser: state.login.currentUser,
		hasVoted: props.navigation.state.params.profile.swipe !== 0,
		room: state.chat.rooms !== null ? state.chat.rooms.find(room=>room.users[0].profile.id === props.navigation.state.params.profile.id): undefined,
		success: state.chat.success,
		profileSuccess: state.login.success,
	};
};
const mapDispatchToProps = dispatch => {
  return {
    unblockUser: (roomId, userId) => dispatch(ChatActions.unblockUser({ roomId, userId })),
    blockUser: (roomId, userId) => dispatch(ChatActions.blockUser({ roomId, userId })),
    unmatchUser: (roomId, userId) => dispatch(ChatActions.unmatchUser({ roomId, userId })),
    reportUser: (userId, report_type, comment) => dispatch(
      ChatActions.reportUser({
        userId,
        report_type,
        comment
      })),
    resetReport: () => dispatch(ChatActions.reportUserSuccess({success: null})),
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
    borderTopLeftRadius: 5,
    borderTopRightRadius:5,
    marginHorizontal:5,
    borderWidth: 0.4,
    borderColor: '#c3c3c3'
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
export default connect(mapStateToProps, mapDispatchToProps)(UserProfileScreen);
