import React from 'react';
import { BrowserRouter as Link } from "react-router-dom";

function Header(props) {
  return (
      <header>
        <div className="container">
          <h1>{props.title}</h1>
        </div>
      </header>
  );
}

export default Header;