import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authContext from "../context/authContext/authContext";
const NavBar = () => {
  const navigate = useNavigate();

  const { user, logout } = useContext(authContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <nav
        className="navbar fixed-top navbar-expand-lg bg-dark"
        style={{ zIndex: 1 }}
      >
        <div className="container-fluid">
          <Link class="nav-link text-white" to="/">
            <h2 className="navbar-brand" style={{ color: "white" }}>
              Codnestx Products
            </h2>
          </Link>
          <div
            class="navbar-collapse align-items-center justify-content-center"
            id="navbarSupportedContent"
          >
            <ul class="navbar-nav mr-auto" hidden={!user}>
              <li class="nav-item active">
                <Link class="nav-link text-white" to="/">
                  Home
                </Link>
              </li>

              <li class="nav-item active" hidden={!user?.isAdmin}>
                <Link class="nav-link text-white" to="/add">
                  Add
                </Link>
              </li>

              <li class="nav-item active">
                <Link
                  class="nav-link text-white"
                  to="/login"
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </li>

              <li
                class="nav-item float-right"
                hidden={!user}
                style={{ position: "absolute", right: 20 }}
              >
                <Link class="nav-link text-white">Welcome {user?.name}</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
