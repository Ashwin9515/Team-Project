import React from "react";
import RecipeFinderImg from "../images/RecipeFinder.png";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      {/* Logo Section */}
      <NavLink className="navbar-brand d-flex align-items-center" to="/">
        <img src={RecipeFinderImg} alt="Recipe Finder" style={{ width: "100px", height: "auto" }} />
      </NavLink>

      {/* Navbar Toggle Button for Mobile View */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Navbar Links Section */}
      <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/addrecipe">
              Add Recipe
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
