import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { group_dashbord_data } from '../../data/data'

const GroupTab = ({ activeTab, setActiveTab }) => {
	return (
		<View className="flex-row justify-around rounded-2xl bg-[#111827] mx-4 mt-4 py-1">
			{group_dashbord_data.map((tab) => (
				<TouchableOpacity
					key={tab.id}
					onPress={() => setActiveTab(tab.id)}
					className="flex-1 relative"
				>
					<View 
						className={`
							absolute inset-0 rounded-2xl 
							${activeTab === tab.id ? 'bg-white' : ''}
						`} 
					/>
					<Text 
						className={`
							text-base py-3 text-center
							${activeTab === tab.id 
								? 'text-[#028758] font-bold' 
								: 'text-white/70'}
						`}
					>
						{tab.label}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	)
}

export default GroupTab