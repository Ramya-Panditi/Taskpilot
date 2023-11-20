import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const getData = createAsyncThunk("users", async () => {
    
      const id = sessionStorage.getItem('id') || localStorage.getItem('id');
      const response = await fetch(`http://localhost:4000/show/${id}`);
      const data = await response.json();
      return data;
});
  
  
export const dataslice = createSlice({
    name: "userdb",
    initialState: {
        user : [],
        loading: "false",
        error:null,
    },
    extraReducers:{
        [getData.pending] : (state) =>{
            state.loading = true;
        },
        [getData.fulfilled] : (state,action) =>{
            state.loading = false;
            state.user = action.payload;
        },
        [getData.rejected] : (state,action) =>{
            state.loading = true;
            state.error = action.payload;
        }
    }


})

export default dataslice.reducer;