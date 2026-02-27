function TTSControls({ tts }) {
  const {
    isSupported,
    isLoading,
    isPlaying,
    isPaused,
    rate,
    setRate,
    play,
    pause,
    resume,
    stop,
    error
  } = tts;

  if (!isSupported) {
    return <p className="tts-note">Tu navegador no soporta TTS.</p>;
  }

  return (
    <div className="tts-controls" aria-label="Controles de audio">
      <button type="button" className="outline-btn" onClick={play} disabled={isLoading}>
        {isLoading ? 'Cargando...' : 'Escuchar'}
      </button>
      <button type="button" className="outline-btn" onClick={isPaused ? resume : pause} disabled={!isPlaying && !isPaused}>
        {isPaused ? 'Reanudar' : 'Pausa'}
      </button>
      <button type="button" className="outline-btn" onClick={stop} disabled={!isPlaying && !isPaused && !isLoading}>
        Stop
      </button>
      <label className="speed-control" htmlFor="tts-rate">
        Velocidad
        <input
          id="tts-rate"
          type="range"
          min="0.75"
          max="1.25"
          step="0.05"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />
        <span>{rate.toFixed(1)}x</span>
      </label>
      <p className="tts-note" aria-live="polite">
        {error || (isLoading ? 'Cargando audio...' : isPlaying ? 'Reproduciendo' : isPaused ? 'En pausa' : 'Audio detenido')}
      </p>
    </div>
  );
}

export default TTSControls;
