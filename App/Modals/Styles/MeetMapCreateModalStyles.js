import { StyleSheet, Dimensions } from 'react-native'
import { Fonts, Colors } from '../../Themes/'

export default StyleSheet.create({
  overlayStyle:{
    flex:1,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
  },
  innerStyle:{
    flex:1,
    justifyContent:'center',
    alignItems: 'center'
  },
  textarea:{
    width:Dimensions.get('window').width,
    padding: 10,
    backgroundColor: Colors.snow
  },
  usernameText: {paddingLeft: 4 , color: Colors.steel, fontFamily: Fonts.type.lobster,},
  avatar:{
    height:150,
    width: 150,
    borderRadius:75,
    elevation:7
  },
  wrapper:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonRow:{
    position:'absolute',
    left:0,
    bottom:0,
    margin:0,
    padding:0,
    flex:1,
    flexDirection:'row',
    justifyContent: 'center'
  },
  danger:{
    backgroundColor: Colors.indian,
    borderColor: Colors.coal,
  },
  button:{
    flex:1,
    flexDirection:'column',
    borderTopWidth:0.3,
    borderBottomWidth:0.3,
    borderRightWidth: 0,
    borderRightWidth:0.3,
    borderRadius:0,
    backgroundColor: Colors.steel,
    borderColor: Colors.coal,
    justifyContent:'center',
    alignItems:'center'
  },
  buttonRight:{
    borderLeftWidth:0,
  },
  success:{
    backgroundColor: Colors.loGreen,
    borderColor: Colors.coal,
  },
  buttonText:{
    color: Colors.coal,
    ...Fonts.style.lobsterMd,
    textAlign:'center'
  },
  matchText: {
    color: 'white',
    ...Fonts.style.h1
  },
})
