import React from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { Callout } from 'react-native-maps'
import { Thumbnail } from 'native-base'
import Styles from './Styles/MeetMapCalloutStyles'

export default MeetMapCallout = props => {
    /* ***********************************************************
    * Customize the appearance of the callout that opens when the user interacts with a marker.
    * Note: if you don't want your callout surrounded by the default tooltip, pass `tooltip={true}` to `Callout`
    *************************************************************/
    const { location, onPress } = props
    let users = []
    location.users.map(u=>users.push(
          <Thumbnail key={u.id} style={{width:30,height:30}} source={{uri: u.profile.profile_image}} />
      )
    )
    return (
      <Callout onPress={onPress} style={[Styles.callout,{elevation:6}]}>
        <View style={{flex:1, elevation:6}}>
          {users}
          <Text style={{}}>{location.room.name}</Text>
        </View>
      </Callout>
    )
}
