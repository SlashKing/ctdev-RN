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
  },
  textarea:{
    backgroundColor: 'white'
  },
  usernameText: {paddingLeft: 4 , fontFamily: Fonts.type.lobster,},
  avatar:{
    height:150,
    width: 150,
    borderRadius:75,
  },
  wrapper:{
    flex:1,
    paddingTop:60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonRow:{
    flexDirection:'row',
    justifyContent: 'space-around'
  },
  button:{
    flex:1,
    flexDirection:'column',
    borderTopWidth:0.3,
    borderBottomWidth:0.3,
    borderRightWidth: 0,
    borderRightWidth:0.3,
    borderColor: Colors.coal,
    borderRadius:0,
    backgroundColor: Colors.steel,
    justifyContent:'center',
    alignItems:'center'
  },
  editButton:{
    ...StyleSheet.absoluteFillObject,
    top:0,
    width:Dimensions.get('window').width,
    height: 60,
    backgroundColor:'red',
    borderBottomWidth:0.3,
    borderColor: Colors.coal,
    borderRadius:0,
    backgroundColor: Colors.steel,
    alignItems: 'center'
  },
  buttonRight:{
    borderLeftWidth:0,
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
