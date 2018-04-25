import {StyleSheet,Dimensions} from 'react-native'
import { Fonts, Metrics } from '../../Themes/'
export default StyleSheet.create({
    card: { flex: 1,flexGrow:1, borderLeftWidth:0, borderRightWidth:0,borderTopWidth:0 },
    aboutText: { flex: 1, flexGrow: 1 },
    ageText: { flex:1, flexGrow:1, fontSize:10 },
    kmText: { flex:1, flexGrow:1, fontSize:10 },
    usernameText: {paddingLeft: 4 , fontFamily: Fonts.type.lobster},
    profileLeft: {flex:3},
    ageDistanceAside: {
      flex:1,
      flexDirection:'column',
      justifyContent:'flex-end',
      alignItems:'flex-start'
    },
    coverImage: { flex:1, flexGrow:1, flexShrink:0, borderTopRightRadius:2, borderTopLeftRadius:2},
    info2: {
      height:60,
      elevation:9,
      backgroundColor:'white',
      borderBottomWidth:1,
      borderColor: '#ddd',
      overflow:'visible',
      paddingLeft:5,
      paddingRight:5,
      flex:1,
      flexGrow:1,
      flexShrink:0,
      alignItems:'center',
      flexDirection:'row'
    },
})
