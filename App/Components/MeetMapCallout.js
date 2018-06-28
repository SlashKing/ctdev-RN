import React from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { Callout } from 'react-native-maps'
import { Thumbnail } from 'native-base'
import Styles from './Styles/MeetMapCalloutStyles'

export default class MeetMapCallout extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    /* ***********************************************************
    * Customize the appearance of the callout that opens when the user interacts with a marker.
    * Note: if you don't want your callout surrounded by the default tooltip, pass `tooltip={true}` to `Callout`
    *************************************************************/
    const { location } = this.props
    let users = []
    location.users.map(u=>users.push(
      <TouchableOpacity key={u.id} onPress={()=>console.log('gothere',u.id)}>
        <Thumbnail style={{width:30,height:30}} source={{uri: u.profile.profile_image}} />
      </TouchableOpacity>
      )
    )
    console.log(location.users[0])
    return (
      <Callout onPress={this.props.onPress} style={Styles.callout,{elevation:10}}>
          {users}
      </Callout>
    )
  }
}
