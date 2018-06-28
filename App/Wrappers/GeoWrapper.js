import React from 'react'
import {connect} from 'react-redux'
import {getCoordinates} from '../Lib/LocationUtils'
function geoWrap(WrappedComponent, watch=false){

    function getDisplayName(WrappedComponent){
      return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }
    return class extends React.Component{
      constructor(props,context){
        super(props,context)
        this.state = {
          latitude: null,
          longitude: null,
          locationRetrievalFailed: false,
          locationRetries:0
        }

      }
      async componentDidMount(){
        this._mounted = true
        await getCoordinates(this,watch);
      }
      componentWillUnmount(){
        this._mounted = false
      }
      render(){
        return <WrappedComponent {...this.props} {...this.state} />
      }
    }
}
export {geoWrap}
