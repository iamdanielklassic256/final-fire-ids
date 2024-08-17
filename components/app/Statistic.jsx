import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BarChart, LineChart } from 'react-native-chart-kit';
import StatItem from './StatItem';





const Statistic = () => {
  const [showDetails, setShowDetails] = useState(false);

  const savingsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [3000, 3500, 4200, 4800, 5000, 5500]
      }
    ]
  };

  const loanData = {
    labels: ["Personal", "Business", "Education", "Home"],
    datasets: [
      {
        data: [700, 300, 200, 0]
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    strokeWidth: 2,
  };

  return (
    <ScrollView>
      <LinearGradient
        colors={['#f0f9ff', '#e0f2fe']}
        className="rounded-xl shadow-lg p-5 mb-4"
      >
        <View className="flex-row justify-between items-center mb-4">
          {/* <Text className="text-xl font-bold text-blue-800"> Summary</Text> */}
          {/* <TouchableOpacity onPress={() => setShowDetails(!showDetails)}>
            <Icon name={showDetails ? "chevron-up" : "chevron-down"} size={24} color="#1e40af" />
          </TouchableOpacity> */}
        </View>

        <StatItem 
          title="Total Savings" 
          value="$5,500" 
          icon="piggy-bank" 
          color="bg-green-500"
          onPress={() => console.log('Navigate to Savings Detail')}
        />
        <StatItem 
          title="Outstanding Loans" 
          value="$1,200" 
          icon="cash-multiple" 
          color="bg-red-500"
          onPress={() => console.log('Navigate to Loans Detail')}
        />
        {/* <StatItem 
          title="Available Credit" 
          value="$4,300" 
          icon="credit-card-outline" 
          color="bg-blue-500"
          onPress={() => console.log('Navigate to Credit Detail')}
        /> */}

        {/* {showDetails && (
          <View className="mt-4">
            <Text className="text-lg font-bold text-blue-800 mb-2">Savings Growth</Text>
            <LineChart
              data={savingsData}
              width={300}
              height={200}
              chartConfig={chartConfig}
              bezier
            />
            
            <Text className="text-lg font-bold text-blue-800 mt-4 mb-2">Loan Distribution</Text>
            <BarChart
              data={loanData}
              width={300}
              height={200}
              chartConfig={chartConfig}
              verticalLabelRotation={30}
            />
          </View>
        )} */}

        {/* <TouchableOpacity 
          className="bg-blue-600 rounded-lg py-3 mt-4"
          onPress={() => console.log('Navigate to Detailed Report')}
        >
          <Text className="text-white text-center font-semibold">View Detailed Report</Text>
        </TouchableOpacity> */}
      </LinearGradient>
    </ScrollView>
  );
};

export default Statistic;