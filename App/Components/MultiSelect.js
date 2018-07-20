import React from 'react';
import PropTypes from 'prop-types';
import {Animated, Image, View, Text, FlatList, TouchableOpacity} from 'react-native';
import { Thumbnail } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GENDER_CHOICES from '../Config/SettingsConfig'

import styles from './Styles/MultiSelectStyles'

export default class MultiSelect extends React.Component{

  static defaultProps = {
    isMulti: true,
    isTF: false,
    selected: [],
    numColumns: 2,
    horizontal: false,
    choices: GENDER_CHOICES.GENDER_CHOICES,
    onItemSelected: (array) => null,
    alertMessage: null,
    noMoreView: ()=><Text>No choices available</Text>
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

  componentWillReceiveProps(nextProps){
  console.log(this.props,nextProps)
    if(this.props.choices.length !== nextProps.choices.length){
      this.setState({
        selected: nextProps.choices.map(
         item=>this.props.isMulti ?
           this.props.selected.some(item2=>item2 === item.key) ?
             { ...item, selected:true} : { ...item, selected:false } :
           item.key === this.props.selected ? // when true/false, 0 false, 1 true
             { ...item, selected:true} : { ...item, selected:false }
        )
      })
    }
  }
  resetSelected(){
    this.selectedData=this.selectedData.splice(0,this.selectedData.length);
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
    console.log(item)
      const containerStyle = item.profile_image ? styles.container : [styles.container, {flex:1}];
      const view = (
        <TouchableOpacity
          delayLongPress={100}
          onLongPress={()=>this._setSelected(item)}
          style={containerStyle}>

        { item.profile_image === undefined && <Icon name={item.icon} style={styles.icon} /> }

        {item.profile_image && <Image style={styles.image} resizeMethod="resize" source={{uri:item.profile_image}} />
        }
        {item.username && <Text style={{flex:1}}>{item.username.substring(0,7)}</Text>}
        {item.selected && <View style={styles.overlay} pointerEvents='none' />}
        </TouchableOpacity>
      );

    return view
  }

  _keyExtractor=(item, idx)=> `gender_choice_${idx}`

  render(){
  console.log(this.state.selected)
    return this.props.choices.length > 0 ? (
      <View style={{flexGrow:1}}>
        <FlatList removeClippedSubviews={true} scrollEventThrottle={16}
          columnWrapperStyle={{ flexGrow:1, justifyContent:'center',alignItems:'center' }}
          contentContainerStyle={{
            //flexGrow:1,
            justifyContent: 'center',
            padding: 10
          }}
          data={this.state.selected}
          horizontal={this.props.horizontal}
          numColumns={this.props.numColumns}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
        />
      </View>
    ) : <View style={{ flex: 1 }}>{this.props.noMoreView()}</View>
  }
}
