import { useEffect, useMemo, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import HeroGospel from '../components/HeroGospel';
import ReadingSection from '../components/ReadingSection';
import TTSControls from '../components/TTSControls';
import DesktopAside from '../components/DesktopAside';
import { getLocalISODate } from '../services/dateUtils';
import { getReadingsByDate, getTodayReadings, getWeekReadings } from '../services/readingsService';
import useTTS from '../utils/useTTS';

function TodayPage() {
  const { readingMode, setHeaderDay } = useOutletContext();
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [reading, setReading] = useState(null);
  const [week, setWeek] = useState({ start: '', days: [] });
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const tts = useTTS();
  const todayDate = useMemo(() => getLocalISODate(), []);

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

        const latest = await getTodayReadings();
        if (cancelled) return;

        setReading(latest);
        setHeaderDay(latest);
        setSelectedDate(latest?.date || todayDate);
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
        setWeek({
          start: selectedWeek?.start || '',
          days: Array.isArray(selectedWeek?.days) ? selectedWeek.days : []
        });
        setHeaderDay(selectedReading);
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

  const playlist = useMemo(() => {
    if (!reading) return [];
    return [
      { label: 'Primera lectura', text: reading.firstReading?.text },
      { label: 'Salmo', text: reading.psalm?.text },
      { label: 'Segunda lectura', text: reading.secondReading?.text },
      { label: 'Evangelio', text: reading.gospel?.text }
    ].filter((item) => item.text);
  }, [reading]);

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
          onListen={tts.playText}
          onPlayAll={() => tts.playPlaylist(playlist)}
        />

        <TTSControls tts={tts} onPlayAll={() => tts.playPlaylist(playlist)} />

        <div className="day-sections">
          <ReadingSection
            id="first-reading"
            title="Primera lectura"
            reading={reading.firstReading}
            onListen={tts.playText}
            readingMode={readingMode}
          />
          <ReadingSection
            id="psalm"
            title="Salmo"
            reading={reading.psalm}
            onListen={tts.playText}
            readingMode={readingMode}
            isPsalm
          />
          <ReadingSection
            id="second-reading"
            title="Segunda lectura"
            reading={reading.secondReading}
            onListen={tts.playText}
            readingMode={readingMode}
          />
          <ReadingSection
            id="gospel-full"
            title="Evangelio completo"
            reading={reading.gospel}
            onListen={tts.playText}
            readingMode={readingMode}
          />
        </div>
      </section>

      <DesktopAside
        selectedDate={selectedDate}
        days={week.days}
        todayDate={todayDate}
        onSelectDate={setSelectedDate}
        onPlayAll={() => tts.playPlaylist(playlist)}
        day={reading}
      />
    </div>
  );
}

export default TodayPage;
