import React from "react";

function navbar() {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <a href="/" className="navbar-brand m-2">
        Covid Correlator
      </a>
      <div className="collapse navbar-collapse" id="navbarsSupportedContent">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="/">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/credits">
              Credits
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default navbar;
