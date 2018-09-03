import React from 'react'
import {View, Animated, Dimensions, TouchableOpacity, Image, Orientation} from 'react-native'
import {Card,CardItem,Thumbnail,Icon,Text,Button} from 'native-base'
import styles from './Styles/SwipeCardStyles'
const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height
/*
{this.props.overlays !== undefined && this.props.overlays.renderNope()}
		            {this.props.overlays !== undefined && this.props.overlays.renderMaybe()}
		            {this.props.overlays !== undefined && this.props.overlays.renderYup()}
*/
export default class SwipeCard extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        width:deviceWidth,
        height:deviceHeight
    }
  }
  _goToProfile=()=> {
    this.props.navigation.navigate('UserProfileScreen',{...this.props})
  }
  _handleYup(){

  }
  componentWillUnmount(){
  }
  /* TODO: Not sure this should be done in render, Performance?
   * Only way I could make this component responsive
   ^ May need to look into adjusting the react-swipe-cards library
   */
  render() {
  let isPortrait = this.props.layout.width < this.props.layout.height
  let width = isPortrait ? this.props.layout.width : this.props.layout.width/2;
  const about = this.props.profile.about_me == null ?
    'No profile information':
    this.props.profile.about_me.substring(0,25) + '...';
    return (
            <View style={styles.card}>
    					<View style={styles.inner}>
    					  <View style={styles.cardImageWrapper}>
    						  <Image style={[styles.cardImage,{width:width - 12, flex:1, height:width - 4 }]} resizeMode={'cover'}
    						    source={{uri: this.props.profile.profile_image}} />
    							<TouchableOpacity activeOpacity={0.8} style={styles.goToProfile} onPress={this._goToProfile}>
    							  <Thumbnail source={{uri: this.props.profile.profile_image }} />
    							</TouchableOpacity>
    						</View>
    					  <View style={styles.info}>
                   <Text style={styles.usernameText}>{`\t${this.props.username}`}</Text>
    					    <View style={styles.ageDistanceAside}>
    					  	  <Text style={styles.ageText}>{this.props.profile.age}</Text>
    					      <Text style={styles.kmText}>{`${this.props.profile.distance} km away`}</Text>
    					    </View>
    					  </View>
    						{/*
    						<View style={styles.info}>this.props.likes == null ? <Text>Nothing liked on Facebook? Weird</Text> :
                    ''
                    TODO:loop through facebook likes, truncate at 3,
                       TODO: match the current user's likes using javascript sorting function

                   <Text style={styles.aboutText}>
                     {about}
                   </Text>
    					  </View>*/ }

    					</View>
    				</View>
    )
  }
}
