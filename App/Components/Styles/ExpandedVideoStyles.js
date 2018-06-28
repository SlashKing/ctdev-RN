import { StyleSheet, Dimensions } from 'react-native';
import { Colors, ApplicationStyles } from '../../Themes';
export default StyleSheet.create({
  videoStyle: { height: 200, width: 200},
  expVideoStyle: {
    position:'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: Dimensions.get('window').width,
  },
  iconStyle:{
    fontSize: 44,
    color: Colors.snow,
    borderColor: Colors.charcoal,
    backgroundColor: Colors.charcoalLight,
    margin:7,
    textAlign:'center',
    borderWidth: 0.5,
    borderRadius:2,
  },
  rowItem:{
    ...ApplicationStyles.rowAlignBottom
  },
  expIconStyle:{
    color: Colors.snow,
    margin:10,
    textAlign:'center',
  },
  overlayStyle:{
    backgroundColor: Colors.charcoalLight,
  },
  progress: {
      flex: 1,
      flexDirection: 'row',
      borderRadius: 3,
      overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 7,
    backgroundColor: '#cccccc',
  },
  innerProgressRemaining: {
    height: 7,
    backgroundColor: '#2C2C2C',
  },
})
