import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TextInput, View } from "react-native";

const EditableInfoItem = ({ icon, label, value, isEditing, onChangeText }) => (
	<View className="flex-row items-center mb-4 bg-purple-50 p-4 rounded-lg shadow-sm">
	  <View className="bg-purple-100 p-2 rounded-full mr-4">
		<MaterialCommunityIcons name={icon} size={24} color="#6b46c1" />
	  </View>
	  <View className="flex-1">
		<Text className="text-purple-700 font-semibold mb-1">{label}</Text>
		{isEditing ? (
		  <TextInput
			value={value}
			onChangeText={onChangeText}
			className="bg-white border border-purple-200 rounded-md py-2 px-3 text-gray-800"
		  />
		) : (
		  <Text className="text-gray-800 font-medium">
			{value || 'Not set'}
		  </Text>
		)}
	  </View>
	</View>
  );

  export default EditableInfoItem;