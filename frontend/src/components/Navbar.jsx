import React from 'react';
import { Home, User, Terminal, Briefcase, LayoutGrid, Award, Compass } from 'lucide-react';
import Dock from './Dock';

const NAV_ITEMS = [
  { id: 'hero', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'skills', label: 'Skills', icon: Terminal },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: LayoutGrid },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'contact', label: 'Contact', icon: Compass },
];

export default function Navbar({ activeSection }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const dockItems = NAV_ITEMS.map(({ id, label, icon: Icon }) => ({
    icon: <Icon size={18} strokeWidth={1.8} />,
    label,
    onClick: () => scrollToSection(id),
    className: activeSection === id ? 'active' : ''
  }));

  return (
    <nav id="navbar" aria-label="Main Navigation">
      <Dock
        items={dockItems}
        panelHeight={52}
        baseItemSize={40}
        magnification={58}
        distance={140}
      />
    </nav>
  );
}
