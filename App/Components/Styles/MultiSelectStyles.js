import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(69,85,117,0.7)'
  },
  container:{flex:1, justifyContent:'center', alignItems:'center', margin:2, minHeight:80},
  icon:{fontSize:60, textAlign:'center'}
});
