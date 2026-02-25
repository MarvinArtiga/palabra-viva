function TTSControls({ tts, onPlayAll }) {
  const { isSupported, isSpeaking, isPaused, currentLabel, rate, setRate, pause, resume, stop } = tts;

  if (!isSupported) {
    return <p className="tts-note">Tu navegador no soporta TTS.</p>;
  }

  return (
    <div className="tts-controls" aria-label="Controles de audio">
      <button type="button" className="outline-btn" onClick={onPlayAll}>
        Escuchar todo
      </button>
      <button type="button" className="outline-btn" onClick={isPaused ? resume : pause} disabled={!isSpeaking}>
        {isPaused ? 'Reanudar' : 'Pausa'}
      </button>
      <button type="button" className="outline-btn" onClick={stop} disabled={!isSpeaking}>
        Stop
      </button>
      <label className="speed-control" htmlFor="tts-rate">
        Velocidad
        <input
          id="tts-rate"
          type="range"
          min="0.8"
          max="1.2"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />
        <span>{rate.toFixed(1)}x</span>
      </label>
      <p className="tts-note" aria-live="polite">
        {isSpeaking ? `Reproduciendo: ${currentLabel}` : 'Audio detenido'}
      </p>
    </div>
  );
}

export default TTSControls;
