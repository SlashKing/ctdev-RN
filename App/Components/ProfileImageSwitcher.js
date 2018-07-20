'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, FlatList, Animated, StyleSheet, Image, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import {Container, Content, Thumbnail} from 'native-base'
import Draggable from '../Components/Draggable';
import { hamburger} from '../Themes/Images';
import { isInt } from '../Lib/TypeCheck';
import I18n from '../I18n';

import styles from './Styles/ProfileImageSwitcherStyles';

export default class ProfileImageSwitcher extends Component{
  static propTypes={
    parent: PropTypes.func,
    maxImages: PropTypes.number,
    setPriority: PropTypes.func.isRequired,
    resetSuccess: PropTypes.func.isRequired,
    images: PropTypes.array.isRequired,
    activeImages: PropTypes.array,
    navigation: PropTypes.object.isRequired,
    layout: PropTypes.object,
  }

  static defaultProps={
    maxImages: 6,
    images: [],
    activeImages:[],
    layout: Dimensions.get('window'),
    setPriority:()=>null,
    resetSuccess:()=>null,
    parent: ()=>null,
  }

  constructor(props){
    super(props);
    this.arrLen = props.images.length;
    this.emptyImages = []
    for (var i=0; i < props.maxImages - this.arrLen; i++) {
      this.emptyImages.push({
        id:i,
        file:require("../Images/Icons/hamburger.png"),
        priority:this.props.maxImages - i
      });
    }
    this.state={
      scroll: true,
      images: [...props.images,...this.emptyImages].sort(this._sortImages),
      activeImages: [...props.activeImages]
    }
    console.log(this.emptyImages, this.state.images)
    this.parent = props.parent
  }

  componentWillMount(){


  }

  _alertSuccess(message){
    Alert.alert(
      'Switched Profile Image Order',
      message,
      [{
          text: I18n.t('cancel'),
          onPress: ()=> {
            this.props.resetSuccess();
            this.setState({
              images: [...this.props.images,...this.emptyImages].sort(this._sortImages)
            });
          },
          style: 'cancel'
      }]
    );
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.success !== undefined && this.props.success !== nextProps.success) this._alertSuccess(nextProps.success);
  }

  navToCam(priority){
    this.props.navigation.navigate("ProfileCameraScreen", {
      ...this.props.navigation.state.params,
      priority: priority,
      backRoute: false
    })
  }

  _setPriority(item){
    let { activeImages, images } = this.state;
    const arrLen = activeImages.length;
    const isEmpty = item.priority > this.arrLen;
    if (arrLen == 0) {
      if (isEmpty){
        __DEV__ && console.log('empty image. queue camera screen navigation');
        //open camera
        return this.navToCam(Math.min(item.priority, this.arrLen + 1))
      }
      return this.setState({
        activeImages: activeImages.concat(item),
        images: images.map(
          (image)=> image.id == item.id ? {...image, selected:true} : image)
      })
    }else {
      if (arrLen == 1){
        if (isEmpty) return null;
        const thisActiveImage = activeImages.find(image=>image.id==item.id)
        //set selected prop to false if it's the same image
        if (thisActiveImage !== undefined) {
          return this.setState({
            activeImages: [],
            images: images.map((image)=> image.id==item.id ? {...image, selected:undefined} : image)
          })
        }

        return [ this.setState({
            activeImages: [],
            images: images.map(image=> image.selected !== undefined ? {...image, selected: undefined}: image)
          }),
          this.props.setPriority(activeImages[0], item)
        ];
      }
    }
    // fallback
    return null
  }

  renderImage=({item, separators})=>{
      const uri = isInt(item.file) ? item.file: {uri: item.file}
      const imageView = (
        <TouchableOpacity
          delayLongPress={1000}
          onLongPress={()=>this._setPriority(item)}
          style={styles.container}>

        <Image
          style={styles.image}
          source={uri}
        />
        {item.selected && <View style={styles.overlay} pointerEvents='none' />}
        </TouchableOpacity>
      );

    return imageView
  }

  _keyExtractor=(item, idx)=> `p__image_${idx}`

  _sortImages = ( a, b ) => a.priority - b.priority

  render(){
    return(
      <View style={styles.main}>
        <FlatList
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.contentContainer}
          data={this.state.images}
          horizontal={false}
          numColumns={3}
          renderItem={this.renderImage}
          keyExtractor={this._keyExtractor}
        />
      </View>
    )
  }
}
