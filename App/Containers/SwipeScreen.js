'use strict'
import React from 'react';
import { connect } from 'react-redux';
import {BackHandler, Text, View, Image, Dimensions,Alert, TouchableOpacity, Modal} from 'react-native';
import {Toast, Container, Thumbnail, Button} from 'native-base';
import styles from './Styles/SwipeScreenStyles';
import SwipeActions from '../Redux/SwipeRedux';
import LoginActions from '../Redux/LoginRedux';
import ChatActions from '../Redux/ChatRedux';
import SwipeCards from '../Components/SwipeCards';
import SwipeCard from '../Components/SwipeCard';
import {geoWrap} from '../Wrappers/GeoWrapper';
//import {backListener} from '../Wrappers/BackListener';
import { Colors } from '../Themes';
import RippleLoader from '../Components/RippleLoader';
import {getCoordinates} from '../Lib/LocationUtils';
import MatchedModal from '../Modals/MatchedModal';
import { I18n } from '../I18n';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class NoMoreCards extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.noMoreCards}>
        <Text>No more cards</Text>
      </View>
    );
  }
}

class SwipeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
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
    if (this.state.latitude !== null && nextProps.latitude !== this.state.latitude){
      //await this.props.fetchUsers();
    }
  }

  componentWillUnmount(){
    if(this.state.isOpen) this.setModalVis(false);
  }

  handleYup (card, swipe, currentProfileId) {
    swipe({
        vote: 1,
        this_user: currentProfileId,
        user: card,
        content_type: card.profile.content_type
      })
  }

  handleNope (card, swipe, currentProfileId) {
    swipe({
        vote: -1,
        this_user: currentProfileId,
        user: card,
        content_type: card.profile.content_type
      })
  }

  handleMaybe (card, swipe, currentProfileId) {
    swipe({
        vote: 2,
        this_user: currentProfileId,
        user: card,
        content_type: card.profile.content_type
      })
  };

  setModalVis(vis = null) {
    this.setState({isOpen: vis == null ? !this.state.isOpen : vis});
  };

  cardRemoved =(index)=> {
    __DEV__ && console.log(`The index is ${index}`);

    let CARD_REFRESH_LIMIT = 1

    if (this.props.users.length - index <= CARD_REFRESH_LIMIT + 1) {
      __DEV__ && console.log(`There are only ${this.props.users.length - index - 1} cards left.`);
      this.props.fetchUsers();
    }
  };

  renderLocationFailure(){
    return (
      <View style={styles.noMoreCards}>
       <Text>Failed to Retrieve Location</Text>
      </View>
    )
  };

  renderLoader(){
    return (
      <View style={styles.noMoreCards}>
        <RippleLoader size={80} />
      </View>
    )
  };

  renderMatchModal(){
    let {
      createChatRoom,
      resetMatch,
      mega_match,
      currentMatch,
      currentRoom,
      navigation
    } = this.props;

    return (
      <MatchedModal
        ref={el=>this.matchModal = el}
        containerStyle={{ backgroundColor: mega_match ? Colors.loGreen : Colors.loBlue }}
        resetMatch={resetMatch}
        currentMatch={currentMatch}
        currentRoom={currentRoom}
        createChatRoom={createChatRoom}
        megaMatch={mega_match}
        goToChatRoom={()=>{
            resetMatch();
            navigation.navigate("ChatRoomScreen", {room: currentRoom});
          }
        }
      />
    )
  };

  renderSwipeCards(){
    let {
      users,
      swipe,
      currentProfileId,
      navigation
    } = this.props;

    __DEV__ && console.log(users);

    return (
      <SwipeCards
        stackOffsetX={0}
        stackDepth={2}
        cards={users}
        loop={false}
        smoothTransition={true}
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
      />
    )
  };
  render() {
    let {
      loading,
      locationRetrievalFailed,
      users
    } = this.props;

    let { layout } = this.state;

    return (
      (users == null || loading  ) ? locationRetrievalFailed ?
        this.renderLocationFailure() : this.renderLoader() : (
        <View onLayout={this._onLayout}  style={{ flex:1, width:layout.width  }}>
          { this.renderMatchModal() }
          { this.renderSwipeCards()}
        </View>
      )
    )
  };
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.login.currentUser,
    currentProfileId: state.login.currentUser == null ? undefined : state.login.currentUser.profile.id,
    users: state.swipe.results,
    loading: state.login.fetching,
    matched: state.swipe.matched,
    mega_match: state.swipe.mega_match,
    currentMatch: state.swipe.currentMatch,
    currentRoom: state.chat.currentRoom
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    swipe:(vote, this_user, user, content_type)=> dispatch(SwipeActions.swipeRequest(vote, this_user, user, content_type)),
    resetMatch: () => dispatch(SwipeActions.resetMatchSuccess()),
    fetchUsers:() => dispatch(SwipeActions.fetchUsersRequest()),
    updateLocation: (id, latitude, longitude) => dispatch(
          LoginActions.locationRequest({
            p_id: id,
            latitude,
            longitude})),
    createChatRoom: (users) => dispatch(ChatActions.createChatRoom([users])),

  }
};

export default connect(mapStateToProps, mapDispatchToProps)(geoWrap(SwipeScreen))
