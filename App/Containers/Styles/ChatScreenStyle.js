import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  card:{
    flex: 1,
    padding: 0,
    flexDirection:'row',
    marginBottom:3,
    marginTop:0,
  },
  item:{ backgroundColor:'transparent'},
  header:{
    backgroundColor: Colors.steel
  },
  icon: {
    color: Colors.charcoal
  },
  usernameText:{
    color: Colors.charcoal,
    ...Fonts.style.lobsterMd
  },
  overlayStyle:{
    backgroundColor: Colors.charcoalLight,
    justifyContent:'center',
    flex:1,
  },
  reportInput:{
    margin: 12,
    height:150,
    backgroundColor: Colors.snow,
    borderRadius: 6,
    borderWidth: 0.4,
    borderColor: Colors.steel,
  },
  reportButton:{
    backgroundColor: Colors.indian,
    alignSelf: 'center'
  },
  reportButtonText:{
    color: Colors.snow,
    ...Fonts.style.lobsterMd,
  },
  dropdownText: {
    color: Colors.snow,
    ...Fonts.style.lobsterMd,
    textAlign: 'center',
  },
})
