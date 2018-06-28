import {StyleSheet,Dimensions, Platform} from 'react-native'
import { Fonts, Metrics } from '../../Themes/'
export default StyleSheet.create({
    card: {
      // iOS uses content inset, which acts like padding.
      paddingTop: Platform.OS !== 'ios' ? 200 : 0,
      flex: 1,
      flexGrow:1,
      borderLeftWidth:0,
      borderRightWidth:0,
      borderTopWidth:0,
      transform: [{'translate':[0,0,0]}]
    },
    aboutText: { flexShrink:0,fontSize:18 },
    ageText: { flex:1, flexGrow:1, fontSize:10 },
    kmText: { flex:1, flexGrow:1, fontSize:10 },
    usernameText: {paddingLeft: 4 , fontFamily: Fonts.type.lobster,},
    profileLeft: {flex:3, flexDirection:'row', justifyContent:'flex-start', alignContent:'flex-end', alignItems:'center'},
    ageDistanceAside: {
      flex:1,
      flexDirection:'column',
      justifyContent:'flex-end',
      alignContent:'center',
      alignItems:'flex-end'
    },
    coverImage: { flex:1, flexGrow:1, flexShrink:0, borderTopRightRadius:2, borderTopLeftRadius:2},
    info2: {
      elevation:9,
      backgroundColor:'white',
      borderBottomWidth:1,
      borderColor: '#ddd',
      overflow:'visible',
      paddingTop:5,
      paddingLeft:5,
      paddingRight:5,
      flex:1,
      flexGrow:1,
      flexShrink:0,

      alignItems:'center',
      flexDirection:'row'
    },
    info: {
      overflow:'visible',
      paddingTop:5,
      paddingLeft:5,
      paddingRight:5,
      minHeight:500,
      maxHeight:700,
    },
})
