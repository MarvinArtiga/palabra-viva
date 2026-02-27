import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getTtsUrl, mapTtsErrorMessage } from '../services/ttsService';

const MIN_RATE = 0.75;
const MAX_RATE = 1.25;
const DEBUG_TTS = import.meta.env.DEV;

function clampRate(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 1;
  return Math.min(MAX_RATE, Math.max(MIN_RATE, numeric));
}

function debugTts(message, payload) {
  if (!DEBUG_TTS) return;
  console.debug('[tts-debug]', message, payload);
}

function useTtsAudio({ selectedDate, section = 'gospel', voice = '', format = 'mp3' }) {
  const audioRef = useRef(null);
  const objectUrlRef = useRef('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRateState] = useState(1);
  const [error, setError] = useState('');
  const isSupported = useMemo(() => typeof window !== 'undefined' && typeof Audio !== 'undefined', []);

  useEffect(() => {
    if (!isSupported) return undefined;

    const audio = new Audio();
    audio.preload = 'none';
    audioRef.current = audio;

    function onLoadStart() {
      setIsLoading(true);
    }

    function onPlaying() {
      setIsLoading(false);
      setIsPlaying(true);
      setIsPaused(false);
    }

    function onPause() {
      if (audio.ended) return;
      setIsPlaying(false);
      setIsPaused(true);
    }

    function onEnded() {
      setIsLoading(false);
      setIsPlaying(false);
      setIsPaused(false);
    }

    function onError() {
      setIsLoading(false);
      setIsPlaying(false);
      setIsPaused(false);
      setError('No se pudo cargar el audio del Evangelio para esta fecha.');
    }

    audio.addEventListener('loadstart', onLoadStart);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = '';
      }
      audio.removeEventListener('loadstart', onLoadStart);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audioRef.current = null;
    };
  }, [isSupported]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = '';
    }
    setIsLoading(false);
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const playAtRate = useCallback(
    async (targetRate) => {
      if (!isSupported) {
        setError('Tu navegador no soporta reproducción de audio.');
        return false;
      }

      if (!selectedDate) {
        setError('No hay fecha seleccionada para reproducir.');
        return false;
      }

      const audio = audioRef.current;
      if (!audio) {
        setError('No se pudo inicializar el reproductor de audio.');
        return false;
      }

      const url = getTtsUrl(selectedDate, {
        section,
        rate: targetRate,
        voice,
        format
      });

      try {
        setError('');
        setIsLoading(true);
        audio.pause();
        audio.currentTime = 0;
        debugTts('Request URL', { url });
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: format === 'ogg' ? 'audio/ogg' : 'audio/mpeg'
          }
        });

        const contentType = response.headers.get('content-type') || '';
        debugTts('Response status', { status: response.status, url, contentType });
        if (!response.ok) {
          setError(mapTtsErrorMessage(response.status));
          setIsLoading(false);
          setIsPlaying(false);
          setIsPaused(false);
          return false;
        }

        if (!contentType.includes('audio/')) {
          setError('No se pudo reproducir el audio del evangelio');
          setIsLoading(false);
          setIsPlaying(false);
          setIsPaused(false);
          return false;
        }

        const blob = await response.blob();
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
        }
        const objectUrl = URL.createObjectURL(blob);
        objectUrlRef.current = objectUrl;
        audio.src = objectUrl;
        audio.load();
        await audio.play();
        return true;
      } catch (playError) {
        debugTts('Playback error', {
          url,
          message: playError?.message || 'unknown'
        });
        setIsLoading(false);
        setIsPlaying(false);
        setIsPaused(false);
        setError('No se pudo reproducir el audio del evangelio');
        return false;
      }
    },
    [format, isSupported, section, selectedDate, voice]
  );

  const play = useCallback(() => playAtRate(rate), [playAtRate, rate]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;
    audio.pause();
    setIsPlaying(false);
    setIsPaused(true);
  }, [isPlaying]);

  const resume = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !isPaused) return false;
    try {
      setError('');
      await audio.play();
      return true;
    } catch {
      setError('No se pudo reproducir el audio del evangelio');
      return false;
    }
  }, [isPaused]);

  const setRate = useCallback(
    async (nextRate) => {
      const clamped = clampRate(nextRate);
      setRateState(clamped);

      if (isPlaying) {
        await playAtRate(clamped);
      }
    },
    [isPlaying, playAtRate]
  );

  useEffect(() => {
    stop();
    setError('');
  }, [selectedDate, section, stop]);

  return {
    isSupported,
    isLoading,
    isPlaying,
    isPaused,
    rate,
    error,
    play,
    pause,
    resume,
    stop,
    setRate
  };
}

export default useTtsAudio;
