import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text } from 'native-base'
import styles from './Styles/MessageStyle'

export default class Message extends Component {
  // // Prop type warnings
  // static propTypes = {
  //   someProperty: PropTypes.object,
  //   someSetting: PropTypes.bool.isRequired,
  // }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }

  render () {
    return (
      <View style={styles.container}>
        <Text>Message Component</Text>
      </View>
    )
  }
}
