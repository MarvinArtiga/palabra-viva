import { useEffect, useMemo, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import HeroGospel from '../components/HeroGospel';
import ReadingSection from '../components/ReadingSection';
import TTSControls from '../components/TTSControls';
import DesktopAside from '../components/DesktopAside';
import { getMonthReadings, getReadingsByDate, getTodayReadings } from '../services/readingsService';
import { formatMonthKey, toISODate } from '../utils/date';
import useTTS from '../utils/useTTS';

function TodayPage() {
  const { readingMode, setHeaderDay } = useOutletContext();
  const [searchParams] = useSearchParams();
  const [dayData, setDayData] = useState(null);
  const [monthDays, setMonthDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const tts = useTTS();

  const selectedDate = searchParams.get('date');

  useEffect(() => {
    const currentDate = selectedDate || toISODate(new Date());
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const day = selectedDate ? await getReadingsByDate(currentDate) : await getTodayReadings();
        const month = await getMonthReadings(formatMonthKey(currentDate));

        if (cancelled) return;

        setDayData(day);
        setMonthDays(month.days || []);
        setHeaderDay(day);
      } catch {
        if (cancelled) return;
        setDayData(null);
        setMonthDays([]);
        setError('No se pudo cargar. Revisa conexion/servidor.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [selectedDate, setHeaderDay]);

  const playlist = useMemo(() => {
    if (!dayData) return [];
    return [
      { label: 'Primera lectura', text: dayData.firstReading?.text },
      { label: 'Salmo', text: dayData.psalm?.text },
      { label: 'Segunda lectura', text: dayData.secondReading?.text },
      { label: 'Evangelio', text: dayData.gospel?.text }
    ].filter((item) => item.text);
  }, [dayData]);

  if (loading) {
    return (
      <section className="card">
        <p className="loading">Cargando lecturas...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card">
        <p className="loading" role="alert">
          {error}
        </p>
      </section>
    );
  }

  if (!dayData) {
    return (
      <section className="card">
        <p className="loading" role="alert">
          No se pudo cargar. Revisa conexion/servidor.
        </p>
      </section>
    );
  }

  return (
    <div className="today-grid">
      <section>
        <HeroGospel
          day={dayData}
          readingMode={readingMode}
          onListen={tts.playText}
          onPlayAll={() => tts.playPlaylist(playlist)}
        />

        <TTSControls tts={tts} onPlayAll={() => tts.playPlaylist(playlist)} />

        <div className="day-sections">
          <ReadingSection
            id="first-reading"
            title="Primera lectura"
            reading={dayData.firstReading}
            onListen={tts.playText}
            readingMode={readingMode}
          />
          <ReadingSection
            id="psalm"
            title="Salmo"
            reading={dayData.psalm}
            onListen={tts.playText}
            readingMode={readingMode}
          />
          <ReadingSection
            id="second-reading"
            title="Segunda lectura"
            reading={dayData.secondReading}
            onListen={tts.playText}
            readingMode={readingMode}
          />
          <ReadingSection
            id="gospel-full"
            title="Evangelio completo"
            reading={dayData.gospel}
            onListen={tts.playText}
            readingMode={readingMode}
          />
        </div>
      </section>

      <DesktopAside days={monthDays} todayIso={dayData.date} onPlayAll={() => tts.playPlaylist(playlist)} day={dayData} />
    </div>
  );
}

export default TodayPage;
