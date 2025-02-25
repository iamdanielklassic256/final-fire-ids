import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo-vector-icons if not already
import logo from '../../assets/logo/logo.png';
import { USER_AUTH_LOGIN_API } from '../../api/api';

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		// Simple validation
		if (!email || !password) {
			setError('Please enter both email and password');
			return;
		}

		// Email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError('Please enter a valid email address');
			return;
		}

		// Reset error if validation passes
		setError('');
		setIsLoading(true);

		try {
			const response = await fetch(USER_AUTH_LOGIN_API, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});

			console.log(response);

			const data = await response.json();
			

			// if (response.ok) {
			// 	// Store user email in AsyncStorage or Context for later use
			// 	await AsyncStorage.setItem('userEmail', email);

			// 	// Navigate to OTP verification screen
			// 	router.push('/auth/verify-otp');
			// } else {
			// 	// Handle error response from API
			// 	setError(data.message || 'Login failed. Please check your credentials.');
			// }
		} catch (err) {
			setError('Network error. Please try again later.');
			console.error('Login error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.backgroundCircle} />

			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.keyboardAvoid}
			>
				<ScrollView contentContainerStyle={styles.scrollContent}>
					<View style={styles.contentContainer}>
						{/* Logo */}
						<View style={styles.logoContainer}>
							<Image
								source={logo}
								style={styles.logo}
								resizeMode="contain"
							/>
						</View>

						{/* Heading */}
						<View style={styles.headingContainer}>
							<Text style={styles.heading}>Welcome Back</Text>
							<Text style={styles.subheading}>Sign in to continue</Text>
						</View>

						{/* Login Form */}
						<View style={styles.formContainer}>
							{/* Error message if any */}
							{error ? (
								<Text style={styles.errorText}>{error}</Text>
							) : null}

							{/* Email Field */}
							<View style={styles.inputContainer}>
								<Text style={styles.inputLabel}>Email</Text>
								<TextInput
									style={styles.input}
									placeholder="Enter your email"
									placeholderTextColor="#A0AEC0"
									keyboardType="email-address"
									autoCapitalize="none"
									value={email}
									onChangeText={setEmail}
								/>
							</View>

							{/* Password Field with toggle visibility */}
							<View style={styles.inputContainer}>
								<Text style={styles.inputLabel}>Password</Text>
								<View style={styles.passwordContainer}>
									<TextInput
										style={styles.passwordInput}
										placeholder="Enter your password"
										placeholderTextColor="#A0AEC0"
										secureTextEntry={!showPassword}
										value={password}
										onChangeText={setPassword}
									/>
									<TouchableOpacity
										style={styles.visibilityIcon}
										onPress={togglePasswordVisibility}
									>
										<Ionicons
											name={showPassword ? 'eye-off' : 'eye'}
											size={22}
											color="#4A5568"
										/>
									</TouchableOpacity>
								</View>
							</View>

							{/* Forgot Password */}
							<TouchableOpacity
								style={styles.forgotPasswordContainer}
								onPress={() => navigation.navigate('ForgotPassword')}
							>
								<Text style={styles.forgotPasswordText}>Forgot Password?</Text>
							</TouchableOpacity>

							{/* Login Button */}
							<TouchableOpacity
								style={styles.button}
								onPress={handleLogin}
								disabled={isLoading}
							>
								{isLoading ? (
									<ActivityIndicator color="#FFFFFF" />
								) : (
									<Text style={styles.buttonText}>Sign In</Text>
								)}
							</TouchableOpacity>
						</View>

						{/* Sign Up Option */}
						<View style={styles.signupContainer}>
							<Text style={styles.signupText}>Don't have an account? </Text>
							<TouchableOpacity onPress={() => navigation.navigate('Signup')}>
								<Text style={styles.signupLink}>Sign Up</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	keyboardAvoid: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	backgroundCircle: {
		position: 'absolute',
		top: -200,
		right: -100,
		width: 400,
		height: 400,
		borderRadius: 200,
		backgroundColor: '#4C51BF15',
	},
	contentContainer: {
		flex: 1,
		padding: 24,
		justifyContent: 'space-between',
	},
	logoContainer: {
		alignItems: 'center',
		marginTop: 40,
	},
	logo: {
		width: 150,
		height: 150,
	},
	headingContainer: {
		alignItems: 'center',
		marginTop: 20,
		marginBottom: 40,
	},
	heading: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#1A202C',
		marginBottom: 8,
	},
	subheading: {
		fontSize: 16,
		color: '#4A5568',
	},
	formContainer: {
		marginBottom: 30,
	},
	errorText: {
		color: '#E53E3E',
		marginBottom: 16,
		textAlign: 'center',
	},
	inputContainer: {
		marginBottom: 20,
	},
	inputLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: '#4A5568',
		marginBottom: 8,
	},
	input: {
		backgroundColor: '#F7FAFC',
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16,
		color: '#1A202C',
		borderWidth: 1,
		borderColor: '#E2E8F0',
	},
	passwordContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F7FAFC',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#E2E8F0',
	},
	passwordInput: {
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16,
		color: '#1A202C',
	},
	visibilityIcon: {
		padding: 12,
	},
	forgotPasswordContainer: {
		alignItems: 'flex-end',
		marginBottom: 24,
	},
	forgotPasswordText: {
		color: '#4C51BF',
		fontSize: 14,
		fontWeight: '600',
	},
	button: {
		backgroundColor: '#4C51BF',
		paddingVertical: 16,
		borderRadius: 16,
		shadowColor: '#4C51BF',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
	},
	buttonText: {
		color: '#FFFFFF',
		textAlign: 'center',
		fontSize: 18,
		fontWeight: '600',
	},
	signupContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 24,
	},
	signupText: {
		color: '#4A5568',
		fontSize: 16,
	},
	signupLink: {
		color: '#4C51BF',
		fontSize: 16,
		fontWeight: '600',
	},
});

export default LoginScreen;