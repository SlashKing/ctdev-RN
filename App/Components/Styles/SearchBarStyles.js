import {StyleSheet} from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Metrics.smallMargin,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  searchInput: {
    flex: 5,
    height: Metrics.searchBarHeight,
    alignSelf: 'center',
    padding: Metrics.smallMargin,
    textAlign: 'left',
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.instructions,
    //backgroundColor: Colors.white,
    //borderTopLeftRadius: 3,
    //borderBottomLeftRadius:3,
    //borderWidth: 0.3,
    //borderColor: Colors.charcoalLight,
    color: Colors.black,
    flexDirection: 'row'
  },
  searchIcon: {
    alignSelf: 'center',
    color: Colors.charcoal,
    paddingLeft: 3,
    //backgroundColor: Colors.transparent,
    //flex:1,
  },
  cancelButton: {
    flex:2,
    height: Metrics.searchBarHeight,
    borderColor: Colors.charcoalLight,
    borderWidth:0.3,
    borderLeftWidth: 0,
    paddingRight:3,
    backgroundColor: Colors.charcoalLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: Colors.snow,
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.regular
  }
})
