import React, {Component}  from 'react'
import PropTypes from 'prop-types'
import { Image, Text, BackHandler, Dimensions, ScrollView, Animated, TouchableOpacity } from "react-native";
import { View } from 'native-base'
import styles from './Styles/ProfileImagesComponentStyles'

const BAR_SPACE = 6

export default class ProfileImagesComponent extends Component{
  static propTypes = {
    images: PropTypes.array.isRequired,
  }
  constructor(props){
    super(props);
    this.state= {
      ...props,
      numItems : props.images.length
    }
  }
	componentDidMount() {
	  console.log(this.props)
		BackHandler.addEventListener("hardwareBackPress", () => {
			//this.props.navigation.goBack();
			return true;
		});
	}
	_generateImages(images){

	}
  render(){
    let {images, layout, isCurrentUser } = this.props
    let numItems = images.length
    let itemWidth = (layout.width / numItems) - ((numItems - 1) * BAR_SPACE)
  	let animVal = new Animated.Value(0)
    let imageArray = []
    let barArray = []
    console.log(this.state, this.props, images.length)
    images.length > 0 ? images.forEach((image, i) => {
      const thisImage = (
        <TouchableOpacity activeOpacity={0.6}>
          <Image
            key={`image${i}`}
            source={{uri: image.file}}
            style={{width: layout.width, height: layout.height, flex:1, resizeMode:'cover'}}
          />
        </TouchableOpacity>
              )
        imageArray.push(thisImage)

        const scrollBarVal = animVal.interpolate({
          inputRange: [layout.width * (i - 1), layout.width * (i + 1)],
          outputRange: [-itemWidth, itemWidth],
          extrapolate: 'clamp',
        })

        const thisBar = (
          <View
            key={`bar${i}`}
            style={[
              styles.track,
              {
                width: itemWidth,
                marginLeft: i === 0 ? 0 : BAR_SPACE,
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
        }) : imageArray.push(<View key={'empty_images'}><Text>No Profile Images</Text></View>)
    return(
        <View style={styles.container}>
    	    <ScrollView
               horizontal //scrolling left to right instead of top to bottom
               showsHorizontalScrollIndicator={false} //hides native scrollbar
               scrollEventThrottle={10} //how often we update the position of the indicator bar
               pagingEnabled //scrolls from one image to the next, instead of allowing any value in between
               onScroll={
                 Animated.event(
                   [{ nativeEvent: { contentOffset: { x: animVal } } }]
                 )
               }
               >
               {imageArray}
          </ScrollView>
          <View style={styles.barContainer}>
             {barArray}
           </View>
         </View>)
  }

}
