/**
 * Copyright (c) 2017-present, Viro Media, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ViroPortalScene
 */

'use strict';

import { requireNativeComponent, View, StyleSheet, findNodeHandle } from 'react-native';
import React, { Component } from 'react';
var PropTypes = React.PropTypes;
var NativeModules = require('react-native').NativeModules;

/**
 * Portal container for revealing different sections of the scene graph.
 */
var ViroPortalScene = React.createClass({
  propTypes: {
    ...View.propTypes,
    position: PropTypes.arrayOf(PropTypes.number),
    scale: PropTypes.arrayOf(PropTypes.number),
    rotation: PropTypes.arrayOf(PropTypes.number),
    scalePivot: PropTypes.arrayOf(PropTypes.number),
    rotationPivot: PropTypes.arrayOf(PropTypes.number),
    animation: React.PropTypes.shape({
      name: PropTypes.string,
      delay: PropTypes.number,
      loop: PropTypes.bool,
      onStart: React.PropTypes.func,
      onFinish: React.PropTypes.func,
      run: PropTypes.bool,
    }),
    transformBehaviors: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ]),
    onTransformUpdate: React.PropTypes.func,
    visible: PropTypes.bool,
    opacity: PropTypes.number,
    ignoreEventHandling: PropTypes.bool,
    dragType: PropTypes.oneOf(["FixedDistance", "FixedToWorld"]),

    onHover: React.PropTypes.func,
    onClick: React.PropTypes.func,
    onClickState: React.PropTypes.func,
    onTouch: React.PropTypes.func,
    onScroll: React.PropTypes.func,
    onSwipe: React.PropTypes.func,
    onDrag: React.PropTypes.func,
    onPinch: React.PropTypes.func,
    onRotate: React.PropTypes.func,
    onFuse: PropTypes.oneOfType([
      React.PropTypes.shape({
        callback: React.PropTypes.func.isRequired,
        timeToFuse: PropTypes.number
      }),
      React.PropTypes.func
    ]),
    physicsBody: React.PropTypes.shape({
      type: React.PropTypes.oneOf(['dynamic','kinematic','static']).isRequired,
      mass: PropTypes.number,
      restitution: PropTypes.number,
      shape: React.PropTypes.shape({
        type: PropTypes.oneOf(["box", "sphere"]).isRequired,
        params: PropTypes.arrayOf(PropTypes.number)
      }).isRequired,
      friction: PropTypes.number,
      useGravity: PropTypes.bool,
      enabled: PropTypes.bool,
      velocity: PropTypes.arrayOf(PropTypes.number),
      force: PropTypes.oneOfType([
        PropTypes.arrayOf(React.PropTypes.shape({
          value: PropTypes.arrayOf(PropTypes.number),
          position: PropTypes.arrayOf(PropTypes.number)
        })),
        React.PropTypes.shape({
          value: PropTypes.arrayOf(PropTypes.number),
          position: PropTypes.arrayOf(PropTypes.number)
        }),
      ]),
      torque: PropTypes.arrayOf(PropTypes.number)
    }),

    viroTag: PropTypes.string,
    onCollision: React.PropTypes.func,
    passable: PropTypes.bool,
  },

  _onHover: function(event: Event) {
    this.props.onHover && this.props.onHover(event.nativeEvent.isHovering, event.nativeEvent.position, event.nativeEvent.source);
  },

  _onClick: function(event: Event) {
    this.props.onClick && this.props.onClick(event.nativeEvent.position, event.nativeEvent.source);
  },

  _onClickState: function(event: Event) {
    this.props.onClickState && this.props.onClickState(event.nativeEvent.clickState, event.nativeEvent.position, event.nativeEvent.source);
    let CLICKED = 3; // Value representation of Clicked ClickState within EventDelegateJni.
    if (event.nativeEvent.clickState == CLICKED){
        this._onClick(event)
    }
  },

  setNativeProps: function(nativeProps) {
     this._component.setNativeProps(nativeProps);
  },

  _onTouch: function(event: Event) {
    this.props.onTouch && this.props.onTouch(event.nativeEvent.touchState, event.nativeEvent.touchPos, event.nativeEvent.source);
  },

  _onScroll: function(event: Event) {
      this.props.onScroll && this.props.onScroll(event.nativeEvent.scrollPos, event.nativeEvent.source);
  },

  _onSwipe: function(event: Event) {
      this.props.onSwipe && this.props.onSwipe(event.nativeEvent.swipeState, event.nativeEvent.source);
  },

  _onDrag: function(event: Event) {
      this.props.onDrag
        && this.props.onDrag(event.nativeEvent.dragToPos, event.nativeEvent.source);
  },

  _onPinch: function(event: Event) {
    this.props.onPinch && this.props.onPinch(event.nativeEvent.pinchState, event.nativeEvent.scaleFactor, event.nativeEvent.source);
  },

  _onRotate: function(event: Event) {
    this.props.onRotate && this.props.onRotate(event.nativeEvent.rotateState, event.nativeEvent.rotationFactor, event.nativeEvent.source);
  },

  _onFuse: function(event: Event){
    if (this.props.onFuse){
      if (typeof this.props.onFuse === 'function'){
        this.props.onFuse(event.nativeEvent.source);
      } else if (this.props.onFuse != undefined && this.props.onFuse.callback != undefined){
        this.props.onFuse.callback(event.nativeEvent.source);
      }
    }
  },

  _onAnimationStart: function(event: Event) {
    this.props.animation && this.props.animation.onStart && this.props.animation.onStart();
  },

  _onAnimationFinish: function(event: Event) {
    this.props.animation && this.props.animation.onFinish && this.props.animation.onFinish();
  },

  async getTransformAsync() {
    return await NativeModules.VRTNodeModule.getNodeTransform(findNodeHandle(this));
  },

  applyImpulse: function(force, position) {
    NativeModules.VRTNodeModule.applyImpulse(findNodeHandle(this), force, position);
  },

  applyTorqueImpulse: function(torque) {
    NativeModules.VRTNodeModule.applyTorqueImpulse(findNodeHandle(this), torque);
  },

  setVelocity: function(velocity) {
    NativeModules.VRTNodeModule.setVelocity(findNodeHandle(this), velocity);
  },

  _onCollision: function(event: Event){
    if (this.props.onCollision){
      this.props.onCollision(event.nativeEvent.viroTag, event.nativeEvent.collidedPoint,
                                                           event.nativeEvent.collidedNormal);
    }
  },

  // Called from native on the event a positional change has occured
  // for the underlying control within the renderer.
  _onNativeTransformUpdate: function(event: Event){
    var position =  event.nativeEvent.position;
    if (this.props.onTransformUpdate){
      this.props.onTransformUpdate(position);
    }
  },

  render: function() {
    // Since transformBehaviors can be either a string or an array, convert the string to a 1-element array.
    let transformBehaviors = typeof this.props.transformBehaviors === 'string' ?
        new Array(this.props.transformBehaviors) : this.props.transformBehaviors;

    let timeToFuse = undefined;
    if (this.props.onFuse != undefined && typeof this.props.onFuse === 'object'){
        timeToFuse = this.props.onFuse.timeToFuse;
    }

    let transformDelegate = this.props.onTransformUpdate != undefined ? this._onNativeTransformUpdate : undefined;

    return (
      <VRTPortal
        {...this.props}
        ref={ component => { this._component = component; }}
        onNativeTransformDelegateViro={transformDelegate}
        hasTransformDelegate={this.props.onTransformUpdate != undefined}
        transformBehaviors={transformBehaviors}
        canHover={this.props.onHover != undefined}
        canClick={this.props.onClick != undefined || this.props.onClickState != undefined}
        canTouch={this.props.onTouch != undefined}
        canScroll={this.props.onScroll != undefined}
        canSwipe={this.props.onSwipe != undefined}
        canDrag={this.props.onDrag != undefined}
        canFuse={this.props.onFuse != undefined}
        canPinch={this.props.onPinch != undefined}
        canRotate={this.props.onRotate != undefined}
        onHoverViro={this._onHover}
        onClickViro={this._onClickState}
        onTouchViro={this._onTouch}
        onScrollViro={this._onScroll}
        onSwipeViro={this._onSwipe}
        onDragViro={this._onDrag}
        onFuseViro={this._onFuse}
        onPinchViro={this._onPinch}
        onRotateViro={this._onRotate}
        onAnimationStartViro={this._onAnimationStart}
        onAnimationFinishViro={this._onAnimationFinish}
        timeToFuse={timeToFuse}
        canCollide={this.props.onCollision != undefined}
        onCollisionViro={this._onCollision}
        />
    );
  }
});

var VRTPortal = requireNativeComponent(
  'VRTPortalScene', ViroPortalScene, {
    nativeOnly: {
            materials: [],
            canHover: true,
            canClick: true,
            canTouch: true,
            canScroll: true,
            canSwipe: true,
            canDrag: true,
            canFuse: true,
            canPinch: true,
            canRotate: true,
            onHoverViro:true,
            onClickViro:true,
            onTouchViro:true,
            onScrollViro:true,
            onSwipeViro:true,
            onDragViro:true,
            onPinchViro:true,
            onRotateViro:true,
            onFuseViro:true,
            timeToFuse:true,
            canCollide:true,
            onCollisionViro:true,
            onNativeTransformDelegateViro:true,
            hasTransformDelegate:true,
            onAnimationStartViro:true,
            onAnimationFinishViro:true
          }
  }
);

module.exports = ViroPortalScene;