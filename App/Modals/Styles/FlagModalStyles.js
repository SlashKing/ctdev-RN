import { StyleSheet } from 'react-native'
import { Fonts, Colors } from '../../Themes/'

export default StyleSheet.create({
  overlayStyle:{
    backgroundColor: Colors.charcoalLight,
    justifyContent:'center',
    flex:1,
  },
  flagInput:{
    margin: 12,
    height:150,
    backgroundColor: Colors.snow,
    borderRadius: 6,
    borderWidth: 0.4,
    borderColor: Colors.steel,
  },
  flagButton:{
    backgroundColor: Colors.indian,
    alignSelf: 'center'
  },
  flagButtonText:{
    color: Colors.snow,
    ...Fonts.style.lobsterMd,
  },
  dropdownText: {
    color: Colors.snow,
    ...Fonts.style.lobsterMd,
    textAlign: 'center',
  },
})
