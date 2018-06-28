import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, Platform } from 'react-native';

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class AnimatedProfileHeader extends React.Component {
  static propTypes={
    scrollY: PropTypes.object,
    scrollViewSize: PropTypes.number.isRequired,
    coverImage: PropTypes.string, //TODO: make oneOf([string, func, element])
    headerMaxHeight: PropTypes.number,
    headerMinHeight: PropTypes.number,
    headerScrollDistance: PropTypes.number
  }
  static defaultProps = {
    scrollY : null,
    scrollViewSize: 0,
    coverImage: '', //TODO: fetch default image from web
    headerMaxHeight : HEADER_MAX_HEIGHT,
    headerMinHeight : HEADER_MIN_HEIGHT,
    headerScrollDistance : HEADER_SCROLL_DISTANCE,
  }
  constructor(props){
    super(props);
    this.state={
      scrollY: props.scrollY == null ? new Animated.Value(
        // iOS has negative initial scroll value because content inset...
        Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
      ) : props.scrollY,
      scrollViewSize:0,
    }
  }

  getScrollYAnimated(){
    return this.state.scrollY
  }

  _addAnimation(scrollY){
    return Animated.add(
      scrollY,
      Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
    );
  }

  render(){
	  const scrollY = this.state.scrollY;
	  const { headerScrollDistance, headerMinHeight, headerMaxHeight, scrollViewSize, coverImage } = this.props;
	  //const footerScrollY = Animated.add(
    //  this.state.footerScrollY,
    //  Platform.OS === 'ios' ? headerMaxHeight : 0,
    //);

    const headerTranslate = scrollY.interpolate({
      inputRange: [0, headerScrollDistance],
      outputRange: [0, -headerScrollDistance],
      extrapolate: 'clamp',
    });
    const footerTranslate = scrollY.interpolate({
      inputRange: [scrollViewSize>0 ? Math.abs(scrollViewSize/2) :0 , scrollViewSize > 0 ? scrollViewSize : 0],
      outputRange: [0, -headerMaxHeight],
      extrapolate: 'clamp',
    });
    const imageOpacity = scrollY.interpolate({
      inputRange: [0, headerScrollDistance / 2, headerScrollDistance],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
    const imageTranslate = scrollY.interpolate({
      inputRange: [0, headerScrollDistance],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    const titleScale = scrollY.interpolate({
      inputRange: [0, headerScrollDistance / 2, headerScrollDistance],
      outputRange: [1, 1, 0.8],
      extrapolate: 'clamp',
    });
    const titleTranslate = scrollY.interpolate({
      inputRange: [0, headerScrollDistance / 2, headerScrollDistance],
      outputRange: [-60, 0, headerScrollDistance],
      extrapolate: 'clamp',
    });
    return(
			<Animated.View
        style={[
          styles.header,
          { transform: [{translateY: headerTranslate }] },
        ]}
      >
      <Animated.Image
        style={[
          styles.backgroundImage,
          {
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslate }],
          },
        ]}
        source={{uri: coverImage}}
      />
        <Animated.View
          style={[
            styles.bar,
            {
              transform: [
                //{ scale: titleScale },
                { translateY: titleTranslate },
              ],
            },
          ]}
        >
			    { this.props.children }
        </Animated.View>
      </Animated.View>
    )
  }
}
const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  bar: {
    backgroundColor: 'transparent',
    //marginTop: Platform.OS === 'ios' ? 28 : 38,
    minHeight: HEADER_MIN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
