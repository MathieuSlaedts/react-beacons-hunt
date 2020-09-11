import React from 'react';

function Header(props) {
  
  // -----------------------
  // RENDER
  // -----------------------
  
  return (
      <header>
        <div className="container">
          <h1>{props.title}</h1>
        </div>
      </header>
  );
}
export default Header;