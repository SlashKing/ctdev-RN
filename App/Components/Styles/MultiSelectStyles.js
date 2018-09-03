import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(69,85,117,0.7)'
  },
  container:{
    flexGrow:1,
    justifyContent:'center',
    alignItems:'center',
    margin:2,
    minHeight:80,
    padding:10,
    alignContent:'center'  },
  icon:{fontSize:60, textAlign:'center'},
  image: { height:36, width:36, borderRadius:18 }
});
