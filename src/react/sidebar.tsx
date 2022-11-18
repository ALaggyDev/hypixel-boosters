import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar-container">
      <a className="sidebar-item" href="/">
        <span className="sidebar-text">Coffee</span>
      </a>

      <a className="sidebar-item" href="/">
        <span className="sidebar-text">Tea</span>
      </a>

      <a className="sidebar-item" href="/">
        <span className="sidebar-text">Milk</span>
      </a>
    </div>
  );
};

export default Sidebar;
