import React from 'react'
import {connect} from 'react-redux'
import MeetMap from '../Components/MeetMap'


class MeetMeScreen extends React.Component {
  render(){
    return (
      <MeetMap navigation={this.props.navigation}/>
    )
  }
}
export default connect(null,null)(MeetMeScreen)
