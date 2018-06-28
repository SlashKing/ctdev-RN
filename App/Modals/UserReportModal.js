'use strict'

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, TextInput, View, Alert } from 'react-native';
import { Button} from 'native-base';
import ModalDropdown from 'react-native-modal-dropdown';
import { reportDbIndex } from '../Transforms/DropDowns';
import { reportReasons } from '../Config/DropdownOptions';

import styles from './Styles/UserReportModalStyles'
import I18n from '../I18n';

class UserReportModal extends Component {
  static propTypes={
    reportUser: PropTypes.func.isRequired,
    resetReport: PropTypes.func.isRequired,
    success: PropTypes.string
  }
  constructor(props){
    super(props);
    this.state = {
      isOpen: false,
      reportReason: null,
      reportReasonAcronym: null,
      reportComment: null,
      reported: false,
      userId: null,
      username: null
    };
  }

  setModalVis(isOpen){
    this.setState({ isOpen});
  }

  setReportReasonAcronym(reportReasonAcronym){
    this.setState({ reportReasonAcronym});
  }

  setReportReason(reportReason){
    this.setState({ reportReason });
  }

  setReportComment(reportComment){
    this.setState({reportComment});
  }
  setReported(reported){
    this.setState({reported});
  }
  setUsername(username){
    this.setState({username});
  }
  setUserId(userId){
    this.setState({userId});
  }
  _onReportDropdownSelect(idx, value, user, roomId){
    this.setReportReasonAcronym(reportDbIndex(idx));
    this.setReportReason(value);
  }
  _validateReportForm(){
    if(this.state.reportReason == null) return false;
    return true;
  }
  _renderReportDropdown(){
   const options = reportReasons;
    if(this.state.isOpen){
      return (
      <ModalDropdown dropdownTextStyle={{ fontSize:20 }} options={options} onSelect={(idx, value) => this._onReportDropdownSelect(idx, value)}>
        <Text style={styles.dropdownText}>{this.state.reportReason == null ? 'Report Reason' : this.state.reportReason}</Text>
      </ModalDropdown>)
    }
    return null
  }
  _renderReportTextInput(){
    if(this.state.isOpen){
      return (<TextInput
                  style={styles.reportInput}
                  multiline={true}
                  numberOfLines={4}
                  maxLength={500}
                  onChangeText={(text) => this.setReportComment(text)}
                  value={this.state.reportComment}/>)
    }
    return null;
  }
  _renderReportButton(){
    return (<Button style={styles.reportButton} onPress={()=>{
      if(this._validateReportForm()){
        this.props.reportUser(this.state.userId, this.state.reportReasonAcronym, this.state.reportComment);
      }else{
        return null
      }
        }
      }>
      <Text style={styles.reportButtonText}>{I18n.t('report')}</Text>
    </Button>)

  }

  onDropdownSelect(user){
    this.setModalVis(true);
    this.setUsername(user.username);
    this.setUserId(user.id);
  }

  resetReportForm = () =>{
    this.setState({
      reportComment: '',
      reportReason: null,
      reportReasonAcronym: null,
      username: null,
      userId: null,
      isOpen: false });
    this.props.resetReport();
  }
  _renderReportResult(nextProps){
    if(this.state.isOpen && nextProps.success !== null && nextProps.success !== this.props.success){
      Alert.alert(
        I18n.t('reported'),
        `${this.state.username} ${I18n.t('hasBeenReported')} ${I18n.t(this.state.reportReasonAcronym)}`,
        [{text: I18n.t('dismiss'), onPress:this.resetReportForm}]
      )
    }
  }
  componentWillReceiveProps(nextProps){
    this._renderReportResult(nextProps);
  }

  componentWillUnmount(){
    if(this.state.isOpen) this.setModalVis(false);
  }

  render(){
    return (
          <Modal onRequestClose={()=>this.setModalVis(false)} transparent={true} animationType={'slide'} visible={this.state.isOpen}>
            <View style={styles.overlayStyle}>
              {this._renderReportDropdown()}
              {this._renderReportTextInput()}
              {this._renderReportButton()}
            </View>
          </Modal>
    )
  }
}
export default UserReportModal
