import { Archive, CalendarDays, House } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegacion principal movil">
      <NavLink to="/" end>
        <House className="nav-icon" size={18} />
        Hoy
      </NavLink>
      <NavLink to="/calendario">
        <CalendarDays className="nav-icon" size={18} />
        Calendario
      </NavLink>
      <NavLink to="/archivo">
        <Archive className="nav-icon" size={18} />
        Archivo
      </NavLink>
    </nav>
  );
}

export default BottomNav;
