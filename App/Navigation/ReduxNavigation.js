import React from 'react'
import * as ReactNavigation from 'react-navigation'
import { connect } from 'react-redux'
import AppNavigation from './AppNavigation'
import {Root} from 'native-base'

// here is our redux-aware our smart component
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

ReduxNavigation=(props)=>{
    const { dispatch, nav } = props
    // Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
    const middleware = createReactNavigationReduxMiddleware(
      "root",
      state => nav,
    );
    const addListener = createReduxBoundAddListener("root");
    const navigation = ReactNavigation.addNavigationHelpers({
      dispatch,
      state: nav,
      addListener
    })
  return <Root><AppNavigation navigation={navigation} /></Root>
}

const mapStateToProps = state => ({ nav: state.nav })
export default connect(mapStateToProps)(ReduxNavigation)
