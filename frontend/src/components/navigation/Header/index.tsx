import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  // Example header component
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/">Play</Link>
    </div>
  );
}

export default Header;
