import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import "./navigationBar.css"

const NavigationBar = () => {
  function clearStorage(){
    localStorage.clear()
  }
  return (
    <div id='bootstrap-overrides' className='main-container mt-5 '>
      <Navbar expand="lg" className="mb-3" fixed="top">
        <Navbar.Brand as={NavLink} to="/" style={{marginLeft:"40px", marginRight:"40px"}}>
          Nerdwork
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" >
          <Nav className="mr-auto">
            <Nav.Link as={NavLink} to="/Communities" className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>
              Communities
            </Nav.Link>
            <Nav.Link as={NavLink} to="/booksearch" className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>
              Books
            </Nav.Link>
            <Nav.Link as={NavLink} to="/comicsearch" className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>
              Comics
            </Nav.Link>
            <Nav.Link as={NavLink} to="/gamesearch" className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>
              Games
            </Nav.Link>
            <Nav.Link as={NavLink} to="/profile" className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>
              Profile
            </Nav.Link>
            <Nav.Link as={NavLink} to="/" className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"} onClick={clearStorage}>
              Logout
            </Nav.Link>
            {/* Additional navigation links as needed */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Outlet />
    </div>
  );
};

export default NavigationBar;
