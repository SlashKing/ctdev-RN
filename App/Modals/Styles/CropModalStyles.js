import { StyleSheet } from 'react-native';

import { Fonts, Colors } from '../../Themes';

export default StyleSheet.create({
  container:{
    flex:1,
  },
  buttonRow:{
    flex:2,
    flexDirection:'row'
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
  },
  buttonRight:{
    flex:1,
    borderTopWidth:0.3,
    borderBottomWidth:0.3,
    borderLeftWidth: 0,
    borderRightWidth:0,
    borderColor: Colors.coal,
    borderRadius:0,
    backgroundColor: Colors.steel
  },
  buttonText:{
    color: Colors.coal,
    ...Fonts.style.lobsterMd,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center'
  },
})
