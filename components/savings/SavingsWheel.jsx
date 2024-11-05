import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions, Alert } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../../utils/ActionButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import VerificationModalCard from '../auth/VerificationModalCard';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = width * 0.8;
const CENTER_SIZE = WHEEL_SIZE * 0.3;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);



const SavingsWheel = ({ groups, onCreateGroup, onCreateMember, onFetchGroupInvitation }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [member, setMember] = useState(null);
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const memberData = await AsyncStorage.getItem("member");
        if (memberData) {
          setMember(JSON.parse(memberData));
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };

    fetchMemberData();
    
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleAction = (action, handler) => {
    if (!member?.contact_verified) {
      setCurrentAction(action);
      setShowVerificationModal(true);
    } else {
      handler();
    }
  };

  const handleVerifyNow = () => {
    setShowVerificationModal(false);
    router.push("/verify-phone");
  };

  const getColor = (index) => {
    const hue = (index / groups.length) * 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  const rotateData = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
        <ActionButton 
          icon="add-circle-outline" 
          label="New Group" 
          onPress={() => handleAction('create_group', onCreateGroup)}
        />
        <ActionButton 
          icon="person-outline" 
          label="New Member" 
          onPress={() => handleAction('add_member', onCreateMember)}
        />
        <ActionButton 
          icon="people-outline" 
          label="Invitations" 
          onPress={() => handleAction('invitations', onFetchGroupInvitation)}
        />
      </View>

      <VerificationModalCard
        visible={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerifyNow={handleVerifyNow}
        message={
          currentAction === 'create_group'
            ? "Phone verification is required to create a new group."
            : currentAction === 'add_member'
            ? "Please verify your phone number to add new members."
            : "Phone verification is needed to view invitations."
        }
      />
    </View>
  );
};

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    alignItems: 'center',
    elevation: 5,
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    minWidth: '45%',
  },
  laterButton: {
    backgroundColor: '#f0f0f0',
  },
  verifyButton: {
    backgroundColor: '#028758',
  },
  laterButtonText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SavingsWheel;