import { useCallback, useMemo, useRef, useState } from 'react';

function useTTS() {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLabel, setCurrentLabel] = useState('');
  const [rate, setRate] = useState(1);
  const queueRef = useRef([]);

  const isSupported = useMemo(() => Boolean(synth && window.SpeechSynthesisUtterance), [synth]);

  const playQueue = useCallback(() => {
    if (!synth || queueRef.current.length === 0) {
      setIsSpeaking(false);
      setCurrentLabel('');
      return;
    }

    const next = queueRef.current.shift();
    const utterance = new SpeechSynthesisUtterance(next.text);
    utterance.rate = rate;
    utterance.lang = 'es-ES';

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setCurrentLabel(next.label);
    };

    utterance.onend = () => {
      playQueue();
    };

    synth.speak(utterance);
  }, [rate, synth]);

  const playText = useCallback(
    (label, text) => {
      if (!synth || !text) return;
      synth.cancel();
      queueRef.current = [{ label, text }];
      playQueue();
    },
    [playQueue, synth]
  );

  const playPlaylist = useCallback(
    (items) => {
      if (!synth || !Array.isArray(items) || items.length === 0) return;
      synth.cancel();
      queueRef.current = items;
      playQueue();
    },
    [playQueue, synth]
  );

  const stop = useCallback(() => {
    if (!synth) return;
    synth.cancel();
    queueRef.current = [];
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentLabel('');
  }, [synth]);

  const pause = useCallback(() => {
    if (!synth || !isSpeaking) return;
    synth.pause();
    setIsPaused(true);
  }, [isSpeaking, synth]);

  const resume = useCallback(() => {
    if (!synth || !isSpeaking) return;
    synth.resume();
    setIsPaused(false);
  }, [isSpeaking, synth]);

  return {
    isSupported,
    isSpeaking,
    isPaused,
    currentLabel,
    rate,
    setRate,
    playText,
    playPlaylist,
    pause,
    resume,
    stop
  };
}

export default useTTS;
