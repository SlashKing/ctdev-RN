import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  camAccessory:{
    borderLeftWidth:1,
    borderRightWidth:1,
    backgroundColor:'white',
    borderColor:'lightgrey',
    justifyContent:'center',
    alignItems:'flex-end',
    flex:1
  },
  camAccessoryIcon:{
    paddingHorizontal: 7,
  },
  headerTitle: { color: 'black', fontFamily: Fonts.type.lobster},
  activityIndicator:{
    elevation:5,
    width: 16,
    height: 16,
    borderRadius: 8
  },
  ripple:{
    flex:1,
    flexDirection:'column',
    marginVertical:4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  active:{
    backgroundColor: Colors.sea
  },
  inactive:{
    backgroundColor: Colors.indian
  }

})
