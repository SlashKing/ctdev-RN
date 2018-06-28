'use strict'
import React from 'react'
import {BackHandler} from 'react-native'
function backListener(WrappedComponent) {
  function getDisplayName(WrappedComponent){
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  };
  return class extends WrappedComponent{
    constructor(props,context){
      super(props,context);
    };
    _backListener=()=>{
			this.props.navigation.goBack();
			return true;
    };
	  componentDidMount() {
		  BackHandler.addEventListener("hardwareBackPress", this._backListener);
	  };
	  componentWillUnmount(){
		  BackHandler.removeEventListener("hardwareBackPress", this._backListener);
	  };
    render(){
      return super.render()
    };
  };
};
export {backListener}
