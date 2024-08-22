import axios from 'axios';
import { all_members_url, login_url } from '../../api/api';



const loginMember = async (userData) => {
    try {
        const response = await axios.post(login_url, userData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (response.status === 201) {
            return { ...response.data, email: userData.email };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'An error occurred during login');
        }
        throw new Error('An unexpected error occurred');
    }
};

const verifyOtp = async ( email, otp) => {
    try {
        const response = await axios.post(USERS_VERFIY_OTP, email, otp, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('verifyOtp response:', response);

        if (response.status === 200) {
            localStorage.setItem('accessToken', response.data.accessToken);
            return response.data;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'An error occurred during OTP verification');
        }
        throw new Error('An unexpected error occurred');
    }
};

const signupMember = async (member) => {
    try {
        const response = await axios.post(sign_up_url, userData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (response.status === 201) {
            return response.data;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error details:', error.response?.data);
            console.error('Status code:', error.response?.status);
            console.error('Headers:', error.response?.headers);
            throw new Error(error.response?.data?.message || 'An error occurred during signup');
        }
        throw new Error('An unexpected error occurred');
    }
};



const getLoggedInMember = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        throw new Error('No access token found. User is not logged in.');
    }

    try {
        const response = await axios.get(USER_DETAIL_API, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to fetch user data');
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error details:', error.response?.data);
            console.error('Status code:', error.response?.status);
            console.error('Headers:', error.response?.headers);
            throw new Error(error.response?.data?.message || 'An error occurred while fetching user data');
        }
        throw new Error('An unexpected error occurred');
    }
};

const updateMemberPinCode = async (currentPinCode, newPinCode) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        throw new Error('No access token found. User is not logged in.');
    }

    try {
        const response = await axios.patch(USER_UPDATE_PASSWORD_API_URL,
            { currentPassword, newPassword },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to update password');
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error details:', error.response?.data);
            throw new Error(error.response?.data?.message || 'An error occurred while updating password');
        }
        throw new Error('An unexpected error occurred');
    }


};

const updateMember = async (memberId, updateData) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        throw new Error('No access token found. User is not logged in.');
    }

    try {
        const response = await axios.patch(`${SINGLE_URL_API}/${memberId}`, updateData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to update admin details');
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error details:', error.response?.data);
            console.error('Status code:', error.response?.status);
            console.error('Headers:', error.response?.headers);
            throw new Error(error.response?.data?.message || 'An error occurred while updating admin details');
        }
        throw new Error('An unexpected error occurred');
    }
};

const getMemberById = async (memberId) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        throw new Error('No access token found. User is not logged in.');
    }

    try {
        const response = await axios.get(`${all_members_url}/${staffId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json',
            },
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to fetch admin details');
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error details:', error.response?.data);
            throw new Error(error.response?.data?.message || 'An error occurred while fetching admin details');
        }
        throw new Error('An unexpected error occurred');
    }
};






const memberService = {
    loginMember,
	signupMember,
	getMemberById,
	getLoggedInMember,
	updateMember,
	updateMemberPinCode
}
export default memberService;