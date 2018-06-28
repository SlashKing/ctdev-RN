import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  logo: {
    height: Metrics.screenWidth,
    width: null,
    flex:1
  },
  input:{
    backgroundColor:"white",
    width:250,
    borderRadius:5,
    elevation:6,
    shadowColor: 'rgba(0, 0, 0, 0.75)',
    shadowOffset: {width:0, height: -1},
    shadowRadius: 12,
    borderWidth:0.34,
  },
  logoWrap:{
    flex:0,
    alignSelf:'center',
    width:Metrics.screenWidth+7,
    top:-6,
    left:-3,elevation:10,
    backgroundColor:'transparent'
  },
  label: {
   alignSelf:'center',
   fontFamily: "Lobster13",
   textShadowColor: 'rgba(0, 0, 0, 0.75)',
   textShadowOffset: {width:0, height: -1},
   textShadowRadius: 12,
   fontSize:25, elevation:2,
   color:'white',
   opacity:0.87
  },
  centered: {
    alignItems: 'center'
  }
})
