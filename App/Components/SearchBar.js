'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Input, Item, Button} from 'native-base';
import styles from './Styles/SearchBarStyles';
import { Colors, Metrics } from '../Themes/';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class SearchBar extends Component {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    searchTerm: PropTypes.string,
    searching: PropTypes.bool.isRequired,
    leftIcon: PropTypes.string,
    rightIcon: PropTypes.string,
  }

  static defaultProps = {
    leftIcon: "search",
    rightIcon: "trash",
  }
  render () {
    const { onSearch, onCancel, searchTerm, rightIcon, leftIcon } = this.props
    const onSubmitEditing = () => onSearch(searchTerm)
    return (
      <Item style={styles.container}>
        <Icon name={leftIcon} size={Metrics.icons.tiny} style={styles.searchIcon} />
        <Input
          ref='searchText'
          placeholder='Search'
          placeholderTextColor={Colors.charcoal}
          underlineColorAndroid='transparent'
          style={styles.searchInput}
          value={this.props.searchTerm}
          onChangeText={onSearch}
          autoCapitalize='none'
          onSubmitEditing={onSubmitEditing}
          returnKeyType={'search'}
          autoCorrect={false}
          selectionColor={Colors.snow}
        />
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Icon name={rightIcon} size={Metrics.icons.tiny}  style={styles.buttonLabel} />
        </TouchableOpacity>
      </Item>
    )
  }
}
