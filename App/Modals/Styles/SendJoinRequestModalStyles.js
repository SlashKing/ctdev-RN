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
    flexGrow:1,
  },
  textarea:{
    width: Dimensions.get('window').width-20,
    backgroundColor: 'white',
    borderRadius:5,
  },
  usernameText: {...Fonts.style.h2, color: Colors.snow, paddingLeft: 4 },
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
    position:'absolute',
    left:0,
    bottom:0,
    margin:0,
    padding:0,
    flex:1,
    flexDirection:'row',
    justifyContent: 'center'
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
    ...Fonts.style.h1,
    textAlign: 'center'
  },
  textWithLabelWrap:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
