import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = width * 0.8;
const CENTER_SIZE = WHEEL_SIZE * 0.3;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

const SavingsWheel = ({ groups, onCreateGroup, onCreateMember }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotateData = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getColor = (index) => {
    const hue = (index / groups.length) * 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.wheelContainer}>
        <Animated.View style={[styles.wheel, { transform: [{ rotate: rotateData }] }]}>
          <Svg height={WHEEL_SIZE} width={WHEEL_SIZE} viewBox="0 0 100 100">
            <AnimatedG>
              {groups.map((group, index) => {
                const angle = (index / groups.length) * 2 * Math.PI;
                const x = 50 + 45 * Math.cos(angle);
                const y = 50 + 45 * Math.sin(angle);
                return (
                  <G key={group.id}>
                    <Path
                      d={`M50,50 L${x},${y} A45,45 0 0,1 ${50 + 45 * Math.cos((index + 1) / groups.length * 2 * Math.PI)},${50 + 45 * Math.sin((index + 1) / groups.length * 2 * Math.PI)} Z`}
                      fill={getColor(index)}
                    />
                    <Circle cx={x} cy={y} r="5" fill="white" />
                  </G>
                );
              })}
            </AnimatedG>
          </Svg>
        </Animated.View>
        <LinearGradient
          colors={['#00E394', '#028758']}
          style={styles.wheelCenter}
        >
          <Text style={styles.wheelCenterText}>{groups.length}</Text>
          <Text style={styles.wheelCenterSubtext}>Groups</Text>
        </LinearGradient>
      </View>
      <View style={styles.actionsContainer}>
        <ActionButton icon="add-circle-outline" label="New Group" onPress={onCreateGroup} />
        <ActionButton icon="person-outline" label="New Member" onPress={onCreateMember} />
        <ActionButton icon="people-outline" label="Invitations" onPress={() => { }} />
      </View>
    </View>
  );
};

const ActionButton = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#00E394" />
    <Text style={styles.actionButtonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  wheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: WHEEL_SIZE,
    width: WHEEL_SIZE,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    overflow: 'hidden',
  },
  wheelCenter: {
    position: 'absolute',
    width: CENTER_SIZE,
    height: CENTER_SIZE,
    borderRadius: CENTER_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelCenterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  wheelCenterSubtext: {
    fontSize: 14,
    color: '#FFF',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    marginTop: 5,
    color: '#333',
  },
});

export default SavingsWheel;