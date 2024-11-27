import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const SingleGroupTab = ({tab, setActiveTab, activeTab}) => {
	return (
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
	)
}

export default SingleGroupTab