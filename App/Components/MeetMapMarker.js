import React from 'react';
import { Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { Thumbnail } from 'native-base';
import MeetMapCallout from '../Components/MeetMapCallout';
import styles from './Styles/MeetMapMarkerStyles';

export default MeetMapMarker = props => {
    /* ***********************************************************
    * Customize the appearance of the callout that opens when the user interacts with a marker.
    * Note: if you don't want your callout surrounded by the default tooltip, pass `tooltip={true}` to `Callout`
    *************************************************************/
    const { location, onCalloutPress } = props
    return (
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude
        }}>
        <View style={[styles.marker,{ elevation:4 }]}>
          <Thumbnail style={styles.marker} source={{uri: location.picture}} />
        </View>
        <MeetMapCallout
          location={location}
          users={location.users}
          onPress={onCalloutPress}
        />
      </Marker>
    )
}
