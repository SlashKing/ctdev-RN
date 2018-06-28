import { StyleSheet } from 'react-native'
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
    flex:2,
    flexGrow:1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button:{
    flex:1,
    borderTopWidth:0.3,
    borderBottomWidth:0.3,
    borderLeftWidth: 0,
    borderRightWidth:0.3,
    borderColor: Colors.coal,
    borderRadius:0,
    backgroundColor: Colors.steel,
    alignSelf: 'center'
  },
  buttonRight:{
    flex:1,
    borderTopWidth:0.3,
    borderBottomWidth:0.3,
    borderLeftWidth: 0,
    borderRightWidth:0,
    borderColor: Colors.coal,
    borderRadius:0,
    backgroundColor: Colors.steel,
    alignSelf: 'center'
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
