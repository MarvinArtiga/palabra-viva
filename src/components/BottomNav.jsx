import { CalendarDays, Heart, House } from 'lucide-react';
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
      <NavLink to="/rosario">
        <Heart className="nav-icon" size={18} />
        Rosario
      </NavLink>
    </nav>
  );
}

export default BottomNav;
