import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import memberService from "./authService";



const initialState = {
    currentMember: null,
    members: [],
    singleUsers: null,
    accessToken: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
    isOtpSent: false
}

export const login = createAsyncThunk(
    'auth/login',
    async (userData, thunkAPI) => {
        try {
            return await memberService.loginMember(userData);
        } catch (error) {
            const message = error.message || 'An error occurred';
            return thunkAPI.rejectWithValue(message);
        }
    }
);



export const signup = createAsyncThunk(
    "auth/member/signup",
    async (user, { rejectWithValue }) => {
        try {
            const response = await memberService.signupMember(user);
            if (response) {
                return response;
            } else {
                return rejectWithValue('Signup failed...');
            }
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message || 'An unexpected error occurred');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const getLoggedInUser = createAsyncThunk(
    "auth/user/getLoggedInUser",
    async (_, { rejectWithValue }) => {
        try {
            const userData = await userService.getLoggedInUser();
            return userData;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message || 'Failed to fetch user data');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);



export const updateMember = createAsyncThunk(
    "auth/admin/update",
    async ({ memberId, updateData }, { rejectWithValue }) => {
        try {
            const response = await memberService.updateMember(staffId, updateData);
            return response;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message || 'An unexpected error occurred');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const updatePinCode = createAsyncThunk(
    "auth/admin/updatePassword",
    async ({ currentPassword, newPassword }, { rejectWithValue }) => {
        try {
            const response = await memberService.updateMemberPinCode(currentPassword, newPassword);
            return response;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message || 'An unexpected error occurred');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);




export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.currentUser = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem('userData');
            localStorage.removeItem('accessToken');
        },
        initializeFromLocalStorage: (state) => {
            const userData = localStorage.getItem('userData');
            const token = localStorage.getItem('accessToken');
            if (userData && token) {
                state.currentUser = JSON.parse(userData);
                state.accessToken = token;
                state.isAuthenticated = true;
            }
        },

    },
    extraReducers(builder) {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                // state.email =null;
            })
            .addCase(login.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
                state.isOtpSent = true;
                // state.email = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.currentUser = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.email = null
            })
            .addCase(signup.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentUser = action.payload.data;
            })
            .addCase(signup.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Failed to sign up";
            })
            
    },
});

export const { logout, initializeFromLocalStorage } = authSlice.actions;
export default authSlice.reducer;