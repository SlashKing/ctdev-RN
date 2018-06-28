import React from 'react';
import PropTypes from 'prop-types';
import {Animated, View, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GENDER_CHOICES from '../Config/SettingsConfig'

import styles from './Styles/MultiSelectStyles'

export default class MultiSelect extends React.Component{

  static defaultProps = {
    isMulti: true,
    isTF: false,
    selected: [],
    choices: GENDER_CHOICES.GENDER_CHOICES,
    onItemSelected: (array) => null,
    alertMessage: null
  }

  constructor(props){
    super(props);
      this.state = {
        selected: props.choices.map(
          item=>props.isMulti ?
            this.props.selected.some(item2=>item2 === item.key) ?
              { ...item, selected:true} : { ...item, selected:false } :
            item.key === props.selected ? // when true/false, 0 false, 1 true
              { ...item, selected:true} : { ...item, selected:false }
         )
      }
      this.selectedData = props.selected
  }

  _setSelected(item){
    const { isMulti, isTF } = this.props;
    if (isTF) { this.selectedData = !item.selected}
    else if (!isMulti) {
      this.selectedData = item.key
    }
    else{
      if (item.selected ){
        this.selectedData = this.selectedData.filter( e => e !== item.key)
      }else{
        this.selectedData = this.selectedData.concat(item.key);
      }
    }

    this.props.onItemSelected(this.selectedData);
    this.setState({
      selected: this.state.selected.map(
        _item=>_item.key === item.key ? {...item, selected: !item.selected }:
          isMulti ? _item : {..._item, selected:false} //set all other items to false if not multi-select
      )
    })
  }

   renderItem=({item, separators})=>{
      const view = (
        <TouchableOpacity
          delayLongPress={600}
          onLongPress={()=>this._setSelected(item)}
          style={styles.container}>

        <Icon name={item.icon}
          style={styles.icon}
        />
        {item.selected && <View style={styles.overlay} pointerEvents='none' />}
        </TouchableOpacity>
      );

    return view
  }

  _keyExtractor=(item, idx)=> `gender_choice_${idx}`

  render(){
    return(
      <View style={{flex:1}}>
        <FlatList
          columnWrapperStyle={{ justifyContent:'space-around' }}
          contentContainerStyle={{
            flexShrink:0,
            justifyContent: 'center',
            padding: 10}}
          data={this.state.selected}
          horizontal={false}
          numColumns={2}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
        />
      </View>
    )
  }
}
