//
//  VRTOrbitCameraManager.m
//  React
//
//  Created by Raj Advani on 10/5/16.
//  Copyright © 2016 Viro Media. All rights reserved.
//

#import "VRTOrbitCameraManager.h"
#import "VRTOrbitCamera.h"
#import "ViroUIManager.h"

@implementation VRTOrbitCameraManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(position, NSArray<NSNumber *>)
RCT_EXPORT_VIEW_PROPERTY(focalPoint, NSArray<NSNumber *>)

- (VRTView *)view {
  VRTOrbitCamera *camera = [[VRTOrbitCamera alloc] initWithBridge:self.bridge];
  return camera;
}

@end