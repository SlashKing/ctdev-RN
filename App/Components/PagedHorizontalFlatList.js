import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import {Animated, FlatList, View, InteractionManager, TouchableOpacity} from 'react-native';
import styles from './Styles/PagedHorizontalFlatListStyle'

export default class PagedHorizontalFlatList extends Component {
  // // Prop type warnings
  // static propTypes = {
  //   users: PropTypes.array.isRequired,
  //   someSetting: PropTypes.bool.isRequired,
  // }
  //
  // // Defaults for props
  // static defaultProps = {
  //   users: []
  //   onItemSelected: ()=>null,
  // }
  constructor(props){
    super(props);
    this.state = {selected: (new Map(): Map<string, boolean>)};
    this.enter = new Animated.Value(0) // 0 >= x >= 1
    this.animatedX = new Animated.Value(0) // 0 >= x >= screenWidth
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(()=>Animated.spring(this.enter,
        {
          toValue:1,
          friction:4,
          useNativeDriver:true
        }).start(()=>console.log('animation callback')))
  }
  _keyExtractor = (item, index) => `room_image_${item.id}`;

  renderItem = ({item, separators}) =>{
    return (
        <View style={styles.wrapper}>
          <TouchableOpacity onPress={ ()=>console.log('pressed')} >
            <View style={[ styles.image, styles.imageWrapper ]}>
              <Animated.Image
                style={[styles.image, { transform: [{scale: this.enter}]}]}
                source={{uri: item.profile.profile_image}} />
            </View>
          </TouchableOpacity>
          <Animated.Text style={styles.text}>{ item.username }</Animated.Text>
          {this.props.children}
        </View>
    )
  }
  render () {
    return (
        <FlatList
          contentContainerStyle={styles.contentContainer}
          pagingEnabled={true}
          centerContent={true}
          horizontal={true}
          initialNumToRender={1}
          data={this.props.users}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderItem}
        />
    )
  }
}
