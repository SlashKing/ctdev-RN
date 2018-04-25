import React from 'react';
import { connect } from 'react-redux'
import {BackHandler, Text, View, Image, Dimensions,Alert, TouchableOpacity} from 'react-native'
import {Toast} from 'native-base'
import styles from './Styles/SwipeScreenStyles'
import SwipeActions from '../Redux/SwipeRedux'
import LoginActions from '../Redux/LoginRedux'
import SwipeCards from '../Components/SwipeCards'
import SwipeCard from '../Components/SwipeCard'
import {geoWrap} from '../Wrappers/GeoWrapper'
import {backListener} from '../Wrappers/BackListener'
const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height
import RippleLoader from '../Components/RippleLoader'

class NoMoreCards extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.noMoreCards}>
        <Text>No more cards</Text>
      </View>
    )
  }
}

class SwipeScreen extends React.Component {
  constructor(props,context) {
    super(props,context);
    this.state = {
      layout:{
        height:deviceHeight,
        width:deviceWidth,
      },
      outOfCards: false
    }
  }
  _onLayout = event => {
    this.setState({
      layout:{
        height:Dimensions.get('window').height,
        width:Dimensions.get('window').width,
      }
    });
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.latitude !== null && nextProps.latitude !== this.props.latitude){
    console.log('gothere')
      this.props.updateLocation(this.props.currentProfileId, nextProps.latitude, nextProps.longitude);
      //await this.props.fetchUsers();
    }
    nextProps.locationRetrievalFailed !== this.props.locationRetrievalFailed &&
      Toast.show({
        text: nextProps.error,
        position: 'bottom',
        buttonText: 'Okay',
        duration: 2500
      })
  }
  componentDidMount(){ }
  componentWillUnmount(){ }
  handleYup (card, swipe, currentProfileId) {
   swipe(1, currentProfileId, card.profile.id, card.profile.content_type)
  }

  handleNope (card, swipe, currentProfileId) {
   swipe(-1, currentProfileId, card.profile.id, card.profile.content_type)
  }
  handleMaybe (card, swipe, currentProfileId) {
   swipe(2, currentProfileId, card.profile.id, card.profile.content_type)
  }

  cardRemoved =(index)=> {
    __DEV__ && console.log(`The index is ${index}`);

    let CARD_REFRESH_LIMIT = 1

    if (this.props.users.length - index <= CARD_REFRESH_LIMIT + 1) {
      __DEV__ && console.log(`There are only ${this.props.users.length - index - 1} cards left.`);
      this.props.fetchUsers();

    }

  }

  render() {
  let {loading,loadingUsers, users, swipe, currentProfileId, locationRetrievalFailed} = this.props;
  return (
    (users == null || loading || loadingUsers ) ? locationRetrievalFailed ?
      ( <View style={styles.noMoreCards}>
       <Text>Failed to Retrieve Location</Text>
      </View> ) : (
    <View style={styles.noMoreCards}>
      <RippleLoader/>
    </View>): (
      <View onLayout={this._onLayout}  style={{ flex:1, width:this.state.layout.width  }}>
      <SwipeCards
        stackOffsetX={0}
        stackDepth={2}
        cards={this.props.users}
        loop={false}
        smoothTransition={false}
        renderCard={(card, overlays) => <SwipeCard
          layout={this.state.layout} navigation={this.props.navigation} overlays={overlays}
          {...card}/>}
        renderNoMoreCards={() => <NoMoreCards />}
        showYup={true}
        showNope={true}
        hasMaybeAction={true}
        stack={true}
        onClickHandler={()=>{return false}}
        handleMaybe={ (card)=>this.handleMaybe(card,swipe,currentProfileId)}
        handleYup={(card)=>this.handleYup(card,swipe,currentProfileId)}
        handleNope={(card)=>this.handleNope(card,swipe,currentProfileId)}
        cardRemoved={this.cardRemoved}
      /></View>
    )
  )}
}

const mapStateToProps = (state) => {
  return {
       currentProfileId: state.login.currentUser == null ? undefined : state.login.currentUser.profile.id,
       users: state.swipe.results,
       loading: state.login.fetching,
       loadingUsers: state.swipe.fetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    swipe:(vote, this_user, user, content_type)=> dispatch(SwipeActions.swipeRequest(vote, this_user, user, content_type)),
    fetchUsers:() => dispatch(SwipeActions.fetchUsersRequest()),
    updateLocation: (id, latitude, longitude) => dispatch(
          LoginActions.locationRequest({
            p_id: id,
            latitude,
            longitude}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(backListener(geoWrap(SwipeScreen,false)))
