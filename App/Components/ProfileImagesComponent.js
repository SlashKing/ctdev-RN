import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { Image, Text, BackHandler, Dimensions, ScrollView, Animated, TouchableOpacity, FlatList } from "react-native";
import { View } from 'native-base'
import styles from './Styles/ProfileImagesComponentStyles'

const BAR_SPACE = 6
const MAX_PROFILE_IMAGES = 12
const CONTAINER_PADDING = 4

export default class ProfileImagesComponent extends Component{
  static propTypes = {
    images: PropTypes.array.isRequired,
    isCurrentUser: PropTypes.bool,
    barSpace: PropTypes.number,
    maxProfileImages: PropTypes.number,
    containerPadding: PropTypes.number
  }
  static defaultProps = {
    images: [],
    isCurrentUser: false,
    barSpace: BAR_SPACE,
    maxProfileImages: MAX_PROFILE_IMAGES,
    containerPadding: CONTAINER_PADDING
  }
  constructor(props){
    super(props);
    this.state= {
      ...props,
    }
    this.animVal = new Animated.Value(0)
  }
	componentDidMount() {
		//BackHandler.addEventListener("hardwareBackPress", () => {
			//this.props.navigation.goBack();
			//return true;
		//});
	}
	renderFooter = () => {
     if (this.props.images.length != 0) return null;
     return (
       <View key={'empty_images'}><Text>No Profile Images</Text></View>
      );
  };

	generateImage(image, layout, i ){
    return(
      <TouchableOpacity onPress={()=>null} key={`image${i}`} activeOpacity={0.9}>
        <Image
          source={{uri: image.file}}
          style={{width: layout.width-this.props.containerPadding, height: layout.height-120, flex:1, resizeMode:'contain'}}
        />
      </TouchableOpacity>
    )
	}

	_renderArrays(){
	  let {images, layout, isCurrentUser, barSpace, containerPadding } = this.props
    let numItems = images.length
    console.log(numItems)
    let itemWidth = (300 - ((numItems-1) * barSpace))/ numItems
    let imageArray = []
    let barArray = []
    images.length > 0 && images.forEach((image, i) => {
      const scrollBarVal = this.animVal.interpolate({
        inputRange: [(layout.width-containerPadding) * (i - 1), (layout.width-containerPadding) * (i + 1)],
        outputRange: [-itemWidth, itemWidth],
        extrapolate: 'clamp',
      })
      imageArray.push(this.generateImage(image, layout, i))
      const thisBar = (
        <View
          key={`bar${i}`}
          style={[
            styles.track,
            {
              width: itemWidth,
              marginLeft: i === 0 ? 0 : barSpace,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.bar,
              {
                width: itemWidth,
                transform: [
                  { translateX: scrollBarVal },
                ],
              },
            ]}
          />
        </View>
      )
      barArray.push(thisBar)
    })
    return { imageArray, barArray }
	}

  render(){
  const arrays = this._renderArrays()
    return(
      <View style={styles.container}>
        <Animated.ScrollView
          horizontal //scrolling left to right instead of top to bottom
          showsHorizontalScrollIndicator={false} //hides native scrollbar
          scrollEventThrottle={10} //how often we update the position of the indicator bar
          pagingEnabled //scrolls from one image to the next, instead of allowing any value in between
          onScroll={
            Animated.event(
              [{ nativeEvent: { contentOffset: { x: this.animVal } } }],
              { useNativeDriver: true },
            )
          }
        >
          {arrays.imageArray}
        </Animated.ScrollView>
        <View style={styles.barContainer}>
           {arrays.barArray}
        </View>
      </View>
    )
  }

}
