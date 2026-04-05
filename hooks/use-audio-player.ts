import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';

interface AudioPlayerState {
  isPlaying: boolean;
  isLoaded: boolean;
  positionMs: number;
  durationMs: number;
}

export function useAudioPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    isLoaded: false,
    positionMs: 0,
    durationMs: 0,
  });

  useEffect(() => {
    // Configure audio to play in background/silent mode
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });

    return () => {
      unload();
    };
  }, []);

  async function load(source: any) {
    await unload();
    const { sound, status } = await Audio.Sound.createAsync(
      source,
      { shouldPlay: false },
      onPlaybackStatusUpdate
    );
    soundRef.current = sound;
    if (status.isLoaded) {
      setState((prev) => ({
        ...prev,
        isLoaded: true,
        durationMs: status.durationMillis ?? 0,
      }));
    }
  }

  function onPlaybackStatusUpdate(status: any) {
    if (status.isLoaded) {
      setState((prev) => ({
        ...prev,
        isPlaying: status.isPlaying,
        positionMs: status.positionMillis ?? 0,
        durationMs: status.durationMillis ?? prev.durationMs,
      }));
      if (status.didJustFinish) {
        setState((prev) => ({ ...prev, isPlaying: false }));
      }
    }
  }

  async function play() {
    if (soundRef.current) {
      await soundRef.current.playAsync();
    }
  }

  async function pause() {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
    }
  }

  async function togglePlayPause() {
    if (state.isPlaying) {
      await pause();
    } else {
      await play();
    }
  }

  async function seekTo(positionMs: number) {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(positionMs);
    }
  }

  async function unload() {
    if (soundRef.current) {
      await soundRef.current.stopAsync().catch(() => {});
      await soundRef.current.unloadAsync().catch(() => {});
      soundRef.current = null;
      setState({ isPlaying: false, isLoaded: false, positionMs: 0, durationMs: 0 });
    }
  }

  return {
    ...state,
    load,
    play,
    pause,
    togglePlayPause,
    seekTo,
    unload,
  };
}
