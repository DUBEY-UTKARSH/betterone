import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import './PillNav.css';

const PillNav = ({ items, activePath }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pillRef = useRef(null);
  const bgRef = useRef(null);

  const currentPath = activePath || location.pathname;

  useEffect(() => {
    const activeBtn = pillRef.current?.querySelector(`.pill-nav-item.active`);
    if (activeBtn && bgRef.current) {
      const { offsetLeft, offsetWidth } = activeBtn;
      gsap.to(bgRef.current, {
        x: offsetLeft,
        width: offsetWidth,
        duration: 0.35,
        ease: 'power2.out'
      });
    }
  }, [currentPath]);

  return (
    <nav className="pill-nav-container" ref={pillRef}>
      <div className="pill-nav-bg" ref={bgRef} />
      {items.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <button
            key={item.path}
            type="button"
            className={`pill-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon && <span className="pill-nav-icon">{item.icon}</span>}
            <span className="pill-nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default PillNav;
