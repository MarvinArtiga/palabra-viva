import { Outlet } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import { getTodayReadings } from '../services/readingsService';

function AppLayout() {
  const [headerDay, setHeaderDay] = useState(null);

  useEffect(() => {
    getTodayReadings().then(setHeaderDay).catch(() => {
      setHeaderDay(null);
    });
  }, []);

  const outletContext = useMemo(
    () => ({
      readingMode: false,
      setHeaderDay
    }),
    []
  );

  return (
    <div className="app-shell">
      <Header day={headerDay} />
      <main className="page-content">
        <Outlet context={outletContext} />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default AppLayout;
