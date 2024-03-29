import React from "react";
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Developer Connector</h1>
          <p className="lead">
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div className="buttons">
            <Link to="/register">Sign up</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Navbar;
