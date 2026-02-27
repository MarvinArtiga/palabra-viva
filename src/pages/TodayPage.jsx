import { useEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import HeroGospel from '../components/HeroGospel';
import ReadingSection from '../components/ReadingSection';
import TTSControls from '../components/TTSControls';
import DesktopAside from '../components/DesktopAside';
import { getLocalISODate } from '../services/dateUtils';
import { getReadingsByDate, getTodayReadings, getWeekReadings } from '../services/readingsService';
import useTTS from '../utils/useTTS';
import useTtsAudio from '../utils/useTtsAudio';

function TodayPage() {
  const { readingMode, setHeaderDay } = useOutletContext();
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [reading, setReading] = useState(null);
  const [week, setWeek] = useState({ start: '', days: [] });
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const loadedDateRef = useRef('');
  const fallbackTts = useTTS();
  const tts = useTtsAudio({ selectedDate, section: 'gospel' });
  const todayDate = useMemo(() => getLocalISODate(), []);

  function normalizeWeekData(selectedWeek) {
    return {
      start: selectedWeek?.start || '',
      days: Array.isArray(selectedWeek?.days) ? selectedWeek.days : []
    };
  }

  function isNotFoundError(error) {
    return error?.response?.status === 404;
  }

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      setLoading(true);
      setError('');

      try {
        const queryDate = searchParams.get('date');

        if (queryDate) {
          if (cancelled) return;
          setSelectedDate(queryDate);
          return;
        }

        const today = getLocalISODate();
        let initialReading;

        try {
          initialReading = await getReadingsByDate(today);
        } catch (error) {
          if (!isNotFoundError(error)) {
            throw error;
          }
          initialReading = await getTodayReadings();
        }

        if (cancelled) return;

        const initialDate = initialReading?.date || today;
        const initialWeek = await getWeekReadings(initialDate);
        if (cancelled) return;

        setReading(initialReading);
        setHeaderDay(initialReading);
        setSelectedDate(initialDate);
        setWeek(normalizeWeekData(initialWeek));
        loadedDateRef.current = initialDate;
      } catch {
        if (cancelled) return;
        setSelectedDate(todayDate);
      } finally {
        if (!cancelled) {
          setInitialized(true);
        }
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, [searchParams, setHeaderDay, todayDate]);

  useEffect(() => {
    if (!initialized || !selectedDate) return;
    if (loadedDateRef.current === selectedDate) return;

    let cancelled = false;

    async function loadBySelectedDate() {
      setLoading(true);
      setError('');

      try {
        const [selectedReading, selectedWeek] = await Promise.all([
          getReadingsByDate(selectedDate),
          getWeekReadings(selectedDate)
        ]);

        if (cancelled) return;

        setReading(selectedReading);
        if (selectedReading?.date && selectedReading.date !== selectedDate) {
          setSelectedDate(selectedReading.date);
        }
        setWeek(normalizeWeekData(selectedWeek));
        setHeaderDay(selectedReading);
        loadedDateRef.current = selectedReading?.date || selectedDate;
      } catch {
        if (cancelled) return;
        setError('Aún no disponible.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBySelectedDate();

    return () => {
      cancelled = true;
    };
  }, [initialized, selectedDate, setHeaderDay]);

  useEffect(() => {
    fallbackTts.stop();
  }, [fallbackTts.stop, selectedDate]);

  async function playGospelTts() {
    const ok = await tts.play();
    if (!ok && reading?.gospel?.text) {
      fallbackTts.playText('Evangelio', reading.gospel.text);
    }
  }

  if (loading && !reading) {
    return (
      <section className="card">
        <p className="loading">Cargando lecturas...</p>
      </section>
    );
  }

  if (error && !reading) {
    return (
      <section className="card">
        <p className="loading" role="alert">
          {error}
        </p>
      </section>
    );
  }

  if (!reading) {
    return (
      <section className="card">
        <p className="loading" role="alert">
          Aún no disponible.
        </p>
      </section>
    );
  }

  return (
    <div className="today-grid">
      <section>
        <HeroGospel
          day={reading}
          readingMode={readingMode}
          onListen={playGospelTts}
        />

        <TTSControls tts={tts} />

        <div className="day-sections">
          <ReadingSection
            id="first-reading"
            title="Primera lectura"
            reading={reading.firstReading}
            onListen={fallbackTts.playText}
            readingMode={readingMode}
          />
          <ReadingSection
            id="psalm"
            title="Salmo"
            reading={reading.psalm}
            onListen={fallbackTts.playText}
            readingMode={readingMode}
            isPsalm
          />
          <ReadingSection
            id="second-reading"
            title="Segunda lectura"
            reading={reading.secondReading}
            onListen={fallbackTts.playText}
            readingMode={readingMode}
          />
          <ReadingSection
            id="gospel-full"
            title="Evangelio completo"
            reading={reading.gospel}
            onListen={playGospelTts}
            readingMode={readingMode}
          />
        </div>
      </section>

      <DesktopAside
        selectedDate={selectedDate}
        days={week.days}
        todayDate={todayDate}
        onSelectDate={setSelectedDate}
        onPlayAll={playGospelTts}
        day={reading}
      />
    </div>
  );
}

export default TodayPage;
