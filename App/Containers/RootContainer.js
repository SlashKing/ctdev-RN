import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import ReduxNavigation from "../Navigation/ReduxNavigation";
import { connect } from "react-redux";
import StartupActions from "../Redux/StartupRedux";
import {getAsync} from "../Lib/StorageUtils";
import ReduxPersist from "../Config/ReduxPersist";

// Styles
import styles from "./Styles/RootContainerStyles";

class RootContainer extends Component {
  constructor(props){
    super(props);
  }
  componentWillMount(){
      // pass the store to connect to chat websocket if the user is already logged in.
			this.props.startup(this.context.store);
  }
	componentDidMount() {
	}

	render() {
		return (
			<View style={styles.applicationView}>
				<StatusBar hidden />
				<ReduxNavigation />
			</View>
		);
	}
}
// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = dispatch => ({
	startup: (store) => dispatch(StartupActions.startup(store)),
});

RootContainer.contextTypes = {
  store: React.PropTypes.object.isRequired
};
export default connect(null, mapDispatchToProps)(RootContainer);
