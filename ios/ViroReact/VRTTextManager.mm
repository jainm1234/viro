//
//  VRTTextManager.m
//  React
//
//  Created by Vik Advani on 1/13/16.
//  Copyright © 2017 Viro Media. All rights reserved.
//

#import "VRTTextManager.h"
#import "VRTShadowView.h"
#import "VRTText.h"

@implementation VRTTextManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(text, NSString)
RCT_EXPORT_VIEW_PROPERTY(color, UIColor)
RCT_EXPORT_VIEW_PROPERTY(position, NSNumberArray);

RCT_EXPORT_VIEW_PROPERTY(fontFamily, NSString)
RCT_EXPORT_VIEW_PROPERTY(fontSize, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(maxLines, NSUInteger)
RCT_EXPORT_VIEW_PROPERTY(visible, BOOL)
RCT_EXPORT_VIEW_PROPERTY(width, float)
RCT_EXPORT_VIEW_PROPERTY(height, float)
RCT_EXPORT_VIEW_PROPERTY(textAlign, VROTextHorizontalAlignment)
RCT_EXPORT_VIEW_PROPERTY(textAlignVertical, VROTextVerticalAlignment)
RCT_EXPORT_VIEW_PROPERTY(textClipMode, VROTextClipMode)
RCT_EXPORT_VIEW_PROPERTY(textLineBreakMode, VROLineBreakMode)

RCT_EXPORT_VIEW_PROPERTY(opacity, CGFloat)

RCT_EXPORT_VIEW_PROPERTY(transformBehaviors, NSArray<NSString *>)

RCT_EXPORT_VIEW_PROPERTY(onTapViro, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onGazeViro, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(canTap, BOOL)
RCT_EXPORT_VIEW_PROPERTY(canGaze, BOOL)

- (VRTView *)view
{
  return [[VRTText alloc] initWithBridge:self.bridge];
}

- (VRTShadowView *)shadowView
{
  return [VRTShadowView new];
}


@end