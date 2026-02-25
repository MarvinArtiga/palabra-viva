import { Outlet } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import { getTodayReadings } from '../services/readingsService';
import { getReadingMode, setReadingMode } from '../utils/storage';

function AppLayout() {
  const [headerDay, setHeaderDay] = useState(null);
  const [readingMode, setReadingModeState] = useState(false);

  useEffect(() => {
    setReadingModeState(getReadingMode());
    getTodayReadings().then(setHeaderDay).catch(() => {
      setHeaderDay(null);
    });
  }, []);

  const outletContext = useMemo(
    () => ({
      readingMode,
      setHeaderDay
    }),
    [readingMode]
  );

  function toggleReadingMode() {
    setReadingModeState((prev) => {
      const next = !prev;
      setReadingMode(next);
      return next;
    });
  }

  return (
    <div className={readingMode ? 'app-shell mode-reading' : 'app-shell'}>
      <Header day={headerDay} readingMode={readingMode} onToggleReadingMode={toggleReadingMode} />
      <main className="page-content">
        <Outlet context={outletContext} />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default AppLayout;
