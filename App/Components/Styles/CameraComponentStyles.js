import {StyleSheet,Dimensions} from 'react-native'
import { Fonts, Metrics } from '../../Themes/'
export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex:1,
    backgroundColor: 'rgba(17,87,51,.65)',
    borderRadius: 50,
    borderWidth:5,
    height:100,
    width:100,
    borderColor:'lightgrey',
    elevation:4,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  topButtonsWrapper:{
    flex: 0.2,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bottomButtonsWrapper:{
    flex: 0.4,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignSelf: 'center'
  },
  smallBottomButtons : {
    flex: 0.1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  smallBottomButtonsLeft: {
    flexDirection:"row",
    flex:1
  },
  messageWrap:{
    flex: 0.4
  },
  message:{
    backgroundColor:'rgba(0,0,0,0.75)',
    flex:0,
    color: 'white',
    textAlign:'center'
  },
  picText:{
    color:'lightgrey',
    fontSize:55,
  },
  videoText: {
    color:'lightgrey',
    fontSize:55,
  },
  switchButton:{
    padding:0,
    flex: 0.3,
    alignSelf: 'flex-end',
    height:50, width:50,
    borderRadius:25
  },
  navigation: {
      flex: 1,
    },
    gallery: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    zoomButton: {
      alignSelf: 'flex-end',
      width: 40,
      height: 40,
      marginHorizontal: 2,
      marginBottom: 10,
      marginTop: 20,
      borderRadius: 20,
      borderColor: 'white',
      borderWidth: 1,
      padding: 5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'lightblue',
      elevation:6,
    },
    flipButton: {
      width:35,
      height: 35,
      marginHorizontal: 2,
      marginBottom: 10,
      marginTop: 20,
      borderRadius: 20,
      borderColor: 'white',
      borderWidth: 1,
      padding: 5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'lightblue',
      elevation:6,
    },
    flipText: {
      color: 'black',
      fontSize: 24,
    },

    item: {
      margin: 4,
      backgroundColor: 'indianred',
      height: 50,
      width: 80,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    galleryButton: {
      backgroundColor: 'indianred',
    },
    facesContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      top: 0,
    },
    face: {
      padding: 10,
      borderWidth: 2,
      borderRadius: 2,
      position: 'absolute',
      borderColor: '#FFD700',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    landmark: {
      width: 2,
      height: 2,
      position: 'absolute',
      backgroundColor: 'red',
    },
    faceText: {
      color: '#FFD700',
      fontWeight: 'bold',
      textAlign: 'center',
      margin: 10,
      backgroundColor: 'transparent',
    },
    row: {
      flexDirection: 'row',
    },
});
