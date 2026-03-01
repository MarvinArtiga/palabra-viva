import { useRoutes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import AppLayout from '../layouts/AppLayout';
import TodayPage from '../pages/TodayPage';
import CalendarView from '../pages/CalendarView';
import ArchiveView from '../pages/ArchiveView';
import RosaryView from '../pages/RosaryView';

const routes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <TodayPage /> },
      { path: 'calendario', element: <CalendarView /> },
      { path: 'rosario', element: <RosaryView /> },
      { path: 'archivo', element: <ArchiveView /> }
    ]
  }
];

function App() {
  const routing = useRoutes(routes);
  return (
    <>
      {routing}
      <Analytics />
    </>
  );
}

export default App;
