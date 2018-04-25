import React, { Component } from "react";
import {connect} from 'react-redux'
import { ScrollView, Image, BackHandler,TouchableOpacity } from "react-native";
import { List, ListItem, Text, View, Thumbnail, Content } from "native-base";
import LoginActions from '../Redux/LoginRedux'
import styles from "./Styles/DrawerContentStyles";
import { Images } from "../Themes";

class DrawerContent extends Component {
  constructor(props){
    super(props)
    let {items} = props;
		items.push({key: "LoginScreen", routeName: "LoginScreen", onPress: (nav)=> this.props.logout(nav)})
  }
	render() {
		let { screenProps, navigation, items, user } = this.props;
		return (
			<View style={styles.container}>
			<TouchableOpacity>
				<Thumbnail large source={{uri: user !== null ?user.profile.profile_image:""}} style={styles.logo} />
			</TouchableOpacity>
				<Content>
					<List
						dataArray={items}
						renderRow={item => (
							<ListItem onPress={() => {
							    item.onPress !== undefined ? item.onPress(navigation) :  navigation.navigate(item.routeName)
							  }}>
								<Text>{item.key}</Text>
							</ListItem>
						)}
					/>
				</Content>
			</View>
		);
	}
}

const mapStateToProps = state => ({
  user: state.login.currentUser
});
const mapDispatchToProps = dispatch => ({
  logout:(navigation)=> dispatch(LoginActions.logoutRequest(navigation))
})
export default connect(mapStateToProps,mapDispatchToProps)(DrawerContent);
