import React, { useState, useEffect } from 'react';
import { View,  ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StatItem from './StatItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { account_info_url, loan_url } from '../../api/api';




const Statistic = () => {
  const [member, setMember] = useState("");
  const [account, setAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loans, setLoans] = useState("");


  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const memberData = await AsyncStorage.getItem("member");
        if (memberData) {
          const memberId = JSON.parse(memberData);
          setMember(memberId);
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };

    fetchMemberData();
  }, []);


  useEffect(() => {
    if (member && member.id) {
      fetchAccountData();
      fetchLoanData();
    }
  }, [member]);

  const fetchAccountData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${account_info_url}/${member.id}`);
      if (response.status === 200) {
        const data = await response.json();
        setAccount(data);
      }
    } catch (error) {
      setError('Failed to fetch account data. Please try again later.');
      console.error('Error fetching account data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLoanData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${loan_url}/${member.id}`);
      if (response.status === 200) {
        const data = await response.json();
        setLoans(data);
      }
    } catch (error) {
      setError('Failed to fetch account data. Please try again later.');
      console.error('Error fetching account data:', error);
    } finally {
      setIsLoading(false);
    }
  };
// console.log('Account Data::', account)

  return (
    <ScrollView>
      <LinearGradient
        colors={['#f0f9ff', '#e0f2fe']}
        className="rounded-xl shadow-lg p-5 mb-4"
      >
        <View className="flex-row justify-between items-center mb-4">
        </View>
        <StatItem 
          title="Total Savings" 
          value={account[0]?.account_balance}
          icon="piggy-bank" 
          color="bg-green-500"
          onPress={() => console.log('Navigate to Savings Detail')}
        />
        <StatItem 
          title="Outstanding Loans" 
          value={loans[0]?.loan_balance}
          icon="cash-multiple" 
          color="bg-red-500"
          onPress={() => console.log('Navigate to Loans Detail')}
        />
      </LinearGradient>
    </ScrollView>
  );
};

export default Statistic;