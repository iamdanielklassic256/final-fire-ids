import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native";

const InfoItem = ({ icon, text, subtext }) => (
	<View style={styles.infoItem}>
	  <Ionicons name={icon} size={24} color="#FFF" style={styles.infoIcon} />
	  <View className="flex flex-row items-center">
		<Text style={styles.infoText}>{subtext}: </Text>
		<Text style={styles.infoText} className="capitalize">{text}</Text>
	  </View>
	</View>
  );


  export default InfoItem;


  const styles = StyleSheet.create({
	infoContainer: {
	  flexDirection: 'row',
	  flexWrap: 'wrap',
	  justifyContent: 'space-between',
	},
	infoItem: {
	  flexDirection: 'row',
	  alignItems: 'center',
	  width: '48%',
	  marginBottom: 15,
	},
	infoIcon: {
	  marginRight: 10,
	},
	infoText: {
	  color: '#FFF',
	  fontWeight: '600',
	  fontSize: 16,
	},
	infoSubtext: {
	  color: 'rgba(255, 255, 255, 0.8)',
	  fontSize: 12,
	},
  });