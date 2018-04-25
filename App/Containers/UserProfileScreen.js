import React from "react";
import { connect } from "react-redux";
import { Image, BackHandler, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import {
	Card,
	CardItem,
	Text,
	View,
	Thumbnail,
	Content,
	Title,
	Button,
	Left,
	Right,
	Body,
	Icon,
} from "native-base";
import ProfileImagesComponent from '../Components/ProfileImagesComponent'
import AppConfig from '../Config/AppConfig';
import styles from './Styles/UserProfileScreenStyles'
// import Icon from 'react-native-vector-icons/Ionicons'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

class UserProfileScreen extends React.Component {
	constructor(props){
		super(props)
		this.state ={
		  ...this.props.navigation.state.params,
		  layout:{
         height:deviceHeight,
         width:deviceWidth,
      }
		}
	}
	componentDidMount() {
		BackHandler.addEventListener("hardwareBackPress", () => {
			this.props.navigation.goBack();
			return true;
		});
	}
  _onLayout = event => {
    this.setState({
      layout:{
        height:event.nativeEvent.layout.height,
        width:event.nativeEvent.layout.width,
      }
    });
  }

	render() {

    let {profile, username, layout} = this.state
	  const cover = profile.cover_image_url

	  // TODO: new algorithm will be needed if images are stored in an external bucket storage (S3, etc...)

	  const noBorders = {borderLeftWidth:0, borderRightWidth:0,borderTopWidth:0}
		return (
		  <ScrollView onLayout={this._onLayout}>
					<Card style={styles.card} width={layout.width-4}>
						<View>
							<Image
							  resizeMode="cover"
								style={[styles.coverImage, {width:layout.width-4,height:layout.width/2.4}]}
								source={{ uri: cover }}
							/>
						</View>
						<CardItem style={styles.info2}>
               <Left style={styles.profileLeft}>
                 <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                  <Thumbnail style={{height:45,width:45}} source={{uri: profile.profile_image}}/>
                 </TouchableOpacity>
                 <Text style={styles.usernameText}>{username}</Text>
               </Left>
               <Right>
              	    <View style={styles.ageDistanceAside}>
              	  	  <Text style={styles.ageText}>{profile.age}</Text>
              	      <Text style={styles.kmText}>{`${profile.distance} km away`}</Text>
              	    </View>
               </Right>
            </CardItem>
            <ProfileImagesComponent images={profile.images} layout={layout}/>
			  </Card>
			</ScrollView>
		);
					}
}/*                   <Left style={{position:'absolute',transform: [{'translate':[0,0,1]}] , height:45,width:45,backgroundColor:'red',top:0, left:0,borderRadius: 25}}>
           //						<Button onPress={() => this.props.navigation.goBack()}>
           //							<Icon name="ios-menu" />
           //						</Button>
           //					</Left>*/

const mapStateToProps = state => {
	return {
		//currentUser : state.login.currentUser.profile.id
	};
};

export default connect(mapStateToProps)(UserProfileScreen);
