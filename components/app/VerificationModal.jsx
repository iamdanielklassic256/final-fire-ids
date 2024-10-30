import { Text, View } from "react-native";
import { Modal } from "react-native";
import { Icon } from "react-native-paper";

const VerificationModal = () => {
	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={showVerificationModal}
			onRequestClose={() => setShowVerificationModal(false)}
		>
			<View className="flex-1 justify-center items-center bg-black/50">
				<View className="bg-white p-6 rounded-2xl w-[90%] max-w-sm">
					<View className="items-center mb-4">
						<Icon name="phone-alert" size={50} color="#028758" />
					</View>

					<Text className="text-xl font-bold text-center mb-2">
						Phone Verification Required
					</Text>

					<Text className="text-gray-600 text-center mb-6">
						Please verify your phone number to access all features of the application.
					</Text>

					<TouchableOpacity
						className="bg-[#028758] py-3 px-6 rounded-xl mb-3"
						onPress={handleVerifyNow}
					>
						<Text className="text-white text-center font-bold">
							Verify Now
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						className="py-2"
						onPress={() => setShowVerificationModal(false)}
					>
						<Text className="text-gray-500 text-center">
							Remind Me Later
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	)
};