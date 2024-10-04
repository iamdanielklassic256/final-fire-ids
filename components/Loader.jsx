import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Loader = ({ isLoading, size = 60, color = '#4FD1C5' }) => {
  const circleRadius = size / 2;
  const strokeWidth = size / 15;

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.parallel([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0.8,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      rotateAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [isLoading, rotateAnim, scaleAnim]);

  if (!isLoading) return null;

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        transform: [{ rotate: spin }, { scale: scaleAnim }],
      }}
    >
      <Svg height={size} width={size}>
        <G rotation="-90" origin={`${circleRadius}, ${circleRadius}`}>
          <AnimatedCircle
            cx={circleRadius}
            cy={circleRadius}
            r={circleRadius - strokeWidth / 2}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${circleRadius * 2 * Math.PI * 0.75}, ${circleRadius * 2 * Math.PI * 0.25}`}
          />
        </G>
      </Svg>
    </Animated.View>
  );
};

export default Loader;