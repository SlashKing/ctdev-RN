import { StyleSheet,Dimensions } from 'react-native';
import { Colors, Metrics, Fonts } from '../../Themes/'
export default StyleSheet.create({
  card: {
      borderRadius: 8,
      backgroundColor: 'white',
      flex:1,
      padding:0,
      overflow:'visible',
      elevation:5,
      marginLeft:12,
      marginTop:8,
      marginRight:12,
      marginBottom:8,
      left:-6,
      bottom:6,
      //height: Metrics.screenHeight-4,
      //width: Metrics.screenWidth-4,
      flexDirection:'column',
      borderWidth: 0
    },
    profileImage:{
      padding:0,
      margin:0,
    },
    inner: { },
    cardImageWrapper: {
      borderTopLeftRadius:8,
      borderTopRightRadius:8,
      //height: Metrics.screenWidth-4,
    },
    cardImage: {
      //height: null,
      //width:null,
      //flex:7,
      //position:'absolute',
      borderWidth: 0.5,
      borderColor: '#ddd',
      borderTopLeftRadius:8,
      borderTopRightRadius:8,
    },
    info: {
      elevation:4,
      flex:3,
      alignItems:'center',
      paddingTop:10
    },
    info2: {
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
    aboutText: { flex: 1, flexGrow: 1 },
    ageText: { flex:1, flexGrow:1, fontSize:10 },
    kmText: { flex:1, flexGrow:1, fontSize:10 },
    usernameText: {paddingLeft: 7,padding:4,overflow:'visible',flex:3,textAlign:'center', fontFamily: Fonts.type.lobster},
    ageDistanceAside: {
      flex:1,
      flexDirection:'column',
      alignItems:'flex-end'
    },
    goToProfile: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius:500,
      position: 'absolute',
      elevation:5,
      overflow:'visible',
      right:5,
      top:5,
    },
    buttonWrapper: {
      flex:1,
      position:'absolute',
      bottom:50,
      left:(Metrics.screenWidth - 240)/2,
      flexDirection:'row',
      alignContent:'center',
    },
    drawerButton: {
      elevation:15,
      width:70,
      marginLeft:10,
      borderWidth: 4,
      height:70,
      borderRadius:50,
      borderColor: '#ddd',
      shadowOffset:{height:-10,width:0},
      position:'relative',
      backgroundColor:'white',
      bottom:0,
      zIndex:10
    },
    drawerIcon: {
      color:'black',
      alignContent: 'center',
    }
})
