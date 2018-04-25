import React from 'react'
import {connect} from 'react-redux'
import {getCoordinates} from '../Lib/LocationUtils'
function geoWrap(WrappedComponent, watch=false){

    function getDisplayName(WrappedComponent){
      return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }
    return class extends WrappedComponent{
      constructor(props,context){
        super(props,context)
        this.state = {
          latitude: null,
          longitude: null,
          locationRetrievalFailed: false
        }
      }
      componentDidMount(){
        console.log('gothere')
        getCoordinates(this,watch);
      }
      render(){
        return <WrappedComponent {...this.props} {...this.state} />
      }
    }
}
export {geoWrap}
