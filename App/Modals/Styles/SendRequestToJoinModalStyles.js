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
  _textarea:{
    flexGrow:1,
    //width: Dimensions.get('window').width-20,
    backgroundColor: 'white',
    borderRadius:5,
  },
  usernameText: {...Fonts.style.h2, color: Colors.snow, paddingLeft: 4 },
  avatar:{
    height:110,
    width: 110,
    borderRadius:55,
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
    borderRadius:0,
    backgroundColor: Colors.steel,
    borderColor: Colors.coal,
    justifyContent:'center',
    alignItems:'center'
  },
  buttonRight:{
    borderLeftWidth:0,
  },
  danger:{
    backgroundColor: Colors.indian,
    borderColor: Colors.coal,
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
  buttonText:{
    color: Colors.coal,
    ...Fonts.style.lobsterMd,
    textAlign:'center'
  },
  matchText: {
    color: 'white',
    ...Fonts.style.h1,
    textAlign:'center'
  },
  flexCenter:{
    width: Dimensions.get('window').width - 20,
    justifyContent:'center',
    alignItems:'center'
  },
  fullHeight:{
    height: Dimensions.get('window').height
  },
  headerHeight:{
    height:60
  },
  fill: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  textarea:{
    flexGrow:1,
    backgroundColor: 'white'
  },
  footer: {
    alignItems:'center',
    justifyContent:'center',
    flexGrow:1,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    marginHorizontal:5,
    borderWidth: 0.4,
    borderColor: '#c3c3c3',
    overflow:'visible'
  },
  bottomInfo:{
    position: 'relative',
    flexGrow:1,
    width:null,
    elevation:9,
  },
  panelHeader: {
    flexGrow:1,
    flexDirection:'row',
    justifyContent:'center',
    height:60,
    width:null,
    alignItems:'center',
    maxHeight:60,
    borderTopLeftRadius: 5,
    borderTopRightRadius:5,
    backgroundColor: '#b197fc',
  },
})
