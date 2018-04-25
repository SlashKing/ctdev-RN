'use strict'
import React from 'react'
import {LayoutAnimation, Keyboard, Dimensions, Metrics} from 'react-native'
function keyboardListener() {
  return function(WrappedComponent){
  function getDisplayName(WrappedComponent){
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }
  class KeyboardListener extends React.Component{
    constructor(props,context){
      super(props,context);
      this.state = {
        visibleHeight: Dimensions.get('window').height,
			  topLogo: { width: Dimensions.get('window').width, height:Dimensions.get('window').width}
      }
     }
	  keyboardDidShow = e => {
	  	// Animation types easeInEaseOut/linear/spring
	  	LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	  	let newSize = Dimensions.get('window').height - e.endCoordinates.height;
	  	this.setState({
	  		visibleHeight: newSize,
	  		topLogo: { width: 100, height: 100 }
	  	});
	  }
	  keyboardDidHide = e => {
	  	// Animation types easeInEaseOut/linear/spring
	  	LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	    this.setState({
	  		visibleHeight:Dimensions.get('window').height,
	  		topLogo: { width: Dimensions.get('window').width, height: Dimensions.get('window').width}
	  	});
	  }
	  componentDidMount(){
	  	this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this.keyboardDidShow);
	  	this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this.keyboardDidHide);
    }
	  componentWillUnmount(){
	    this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
	  }
    render(){
      return <WrappedComponent {...this.props} {...this.state} />
    }
  }
  return KeyboardListener;
  }
}
export {keyboardListener}
