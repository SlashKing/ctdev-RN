import { StyleSheet } from 'react-native';


export default StyleSheet.create({
  main:{flex:1},
  container: {
    width: 60,
    height: 60,
    margin:10,
    borderRadius:35,
    elevation:6,
    backgroundColor:'#c3c3c380',
    overflow:'visible'
  },
  image:{
    width:60,
    height:60,
    borderRadius:30
  },
  columnWrapper:{
    flexWrap:'wrap',
    borderRadius:30
  },
  contentContainer:{
    flexGrow:1,
    alignItems:'center',
    justifyContent: 'space-around',
    padding: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(69,85,117,0.7)',
    borderRadius: 30
  }
})
