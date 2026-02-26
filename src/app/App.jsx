import { useRoutes } from 'react-router-dom';
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
  return useRoutes(routes);
}

export default App;
