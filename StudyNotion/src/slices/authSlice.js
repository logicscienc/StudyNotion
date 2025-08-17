import {createSlice} from "@reduxjs/toolkit";


const initialState = {

    // we can take whatever data we want here bilow we took token so if token is already present we will just update is and it not it will gat added. we are taking from local storage because even after reloading of our website its remain same. if you found any token then parse it otherewise set it as null
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null
}; 

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setToken(state, value) {
            state.token = value.payload;
        },
    },
});

export const {setToken}  = authSlice.actions;
export default authSlice.reducer;