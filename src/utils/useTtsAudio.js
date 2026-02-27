import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const MIN_RATE = 0.75;
const MAX_RATE = 1.25;

function clampRate(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 1;
  return Math.min(MAX_RATE, Math.max(MIN_RATE, numeric));
}

function buildTtsUrl({ selectedDate, section, rate, voice, format }) {
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const params = new URLSearchParams({
    section,
    rate: String(rate),
    format
  });

  if (voice) {
    params.set('voice', voice);
  }

  const path = `/api/v1/tts/date/${encodeURIComponent(selectedDate)}?${params.toString()}`;
  return baseUrl ? `${baseUrl}${path}` : path;
}

function useTtsAudio({ selectedDate, section = 'gospel', voice = '', format = 'mp3' }) {
  const audioRef = useRef(null);
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

      const url = buildTtsUrl({
        selectedDate,
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
        audio.src = url;
        audio.load();
        await audio.play();
        return true;
      } catch {
        setIsLoading(false);
        setIsPlaying(false);
        setIsPaused(false);
        setError('No se pudo reproducir el audio del Evangelio.');
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
      setError('No se pudo reanudar el audio.');
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
