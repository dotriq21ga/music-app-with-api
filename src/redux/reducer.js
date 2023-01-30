import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const dataSlice = createSlice({
    name: 'data',
    initialState: {
        currentUser: [],
        currentSong: {
            song: null,
            loading: 'idle',
            isPlay: false,
            isShowRound: false,
            error: null,
            playerQueue: false
        },
        loading: 'idle',
        message: null,
        error: null,
    },
    reducers: {
        noUser: (state) => {
            state.currentUser = [];
            state.loading = 'idle';
            state.message = null;
            state.error = null;
        },
        PauseMusic: (state) => {
            state.currentSong.isPlay = false
        },
        PlayMusic: (state) => {
            state.currentSong.isPlay = true
            state.currentSong.isShowRound = true
        },
        resetMusic: (state) => {
            state.currentSong.song = null
            state.currentSong.loading = 'idle'
            state.currentSong.isPlay = false
            state.currentSong.isShowRound = false
            state.currentSong.error = null
        },
        on: (state) => {
            state.currentSong.playerQueue = true
        },
        off: (state) => {
            state.currentSong.playerQueue = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(userLogin.fulfilled, (state, action) => {
            state.message = action.payload.message;
            state.loading = 'idle';
        })

        builder.addCase(userLogin.pending, (state) => {
            state.loading = 'loading';
        })

        builder.addCase(userLogin.rejected, (state, action) => {
            state.error = action.error;
            state.loading = 'idle';
            state.message = 'Error';
        })

        builder.addCase(authorization.fulfilled, (state, action) => {
            state.currentUser = action.payload.data;
            state.loading = 'idle';
            state.message = null;
            state.error = null;
        })

        builder.addCase(authorization.pending, (state) => {
            state.loading = 'loading';
        })

        builder.addCase(authorization.rejected, (state, action) => {
            state.currentUser = [];
            state.error = action.error;
            state.loading = 'idle';
            state.message = 'Error';
        })

        builder.addCase(userRegister.fulfilled, (state, action) => {
            state.message = action.payload.message;
            if(action.payload.status>=400){
                state.message = 'The name,email has already been taken?Or other error'
            }
            state.loading = 'idle';
        })

        builder.addCase(userRegister.pending, (state) => {
            state.loading = 'loading';
        })

        builder.addCase(userRegister.rejected, (state, action) => {
            state.error = action.error;
            state.loading = 'idle';
            state.message = action.message;
        })

        builder.addCase(userLogout.fulfilled, (state) => {
            sessionStorage.removeItem('token');
            state.currentUser = [];
            state.loading = 'idle';
            state.error = null;
            state.message = null;
        })

        builder.addCase(userLogout.pending, (state) => {
            state.loading = 'loading';
        })

        builder.addCase(userLogout.rejected, (state, action) => {
            state.currentUser = [];
            state.loading = 'idle';
            state.error = action.error;
            state.message = 'Error';
        })

        builder.addCase(song.fulfilled, (state, action) => {
            state.currentSong.song = action.payload.items
            state.currentSong.loading = 'idle'
            state.currentSong.isPlay = true
        })

        builder.addCase(song.pending, (state) => {
            state.currentSong.loading = 'loading'
            state.currentSong.isShowRound = true
        })

        builder.addCase(song.rejected, (state, action) => {
            state.currentSong.song = {}
            state.currentSong.loading = 'idle'
            state.currentSong.isPlay = false
            state.currentSong.error = action.error
        })
    }
})

export const userLogin = createAsyncThunk('/api/login', async (credentials) => {
    const token = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => (data.json()))

    if (token.access_token) {
        sessionStorage.setItem('token', JSON.stringify(token.access_token));
    }
    return token
})

export const song = createAsyncThunk('/api/song', async (id) => {
    return await fetch("http://localhost:8000/api/song/" + id)
        .then(data => (data.json()));
})

export const userLogout = createAsyncThunk('/api/logout', async (token) => {
    await fetch("http://localhost:8000/api/logout", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(data => (data.json()));
})

export const userRegister = createAsyncThunk('/api/register', async (credentials) => {
    const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => (data.json()))
    return res
})

async function getUser(token) {
    return fetch("http://localhost:8000/api/user", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(data => (data.json()));
}

export const authorization = createAsyncThunk('/api/user', async (token) => {
    const user = await getUser(token);
    return user
})

export const { noUser, on, off, PauseMusic, PlayMusic, resetMusic } = dataSlice.actions

export const selectData = (state) => state

export default dataSlice.reducer;
