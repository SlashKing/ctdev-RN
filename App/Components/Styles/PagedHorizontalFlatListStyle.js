import { Dimensions, StyleSheet } from 'react-native';
import { Fonts, Colors} from '../../Themes';

export default StyleSheet.create({
contentContainer:{
    flexGrow:1
  },
  wrapper:{
    width:Dimensions.get('window').width,justifyContent:'center', alignItems:'center'
  },
  image: {
    height: 130,
    width: 130,
    borderRadius:65

  },
  imageWrapper:{
    elevation: 8
  },
  text:{
    ...Fonts.style.h1, color: Colors.snow, ...Fonts.shadow.medium
  }
})
