export const activePlaylist = state => state.playlist;
export const config = state => state.config;
export const currentIndex = state => state.playback.index;
export const audioDevice = state => config(state).audioDevice;
