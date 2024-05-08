import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React from "react";
import brandImage from '../../assets/DishConnect3.PNG';

function Layout3({ children }) {
    return (
      <>
        <Navbar fixed="top" expand="lg" className="bg-body-tertiary">
          <Container>
          <Navbar.Brand href="/">
            <img
              src={brandImage}
              width="200px"
              height="40px"
              className="d-inline-block align-top"
              alt="Brand logo"
            />
          </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
              <Nav.Link href="/about-us">About Us</Nav.Link>
                <Nav.Link href="/search">Search</Nav.Link>
                <NavDropdown title="Community" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/recent-recipes">Recently Added</NavDropdown.Item>
                  <NavDropdown.Item href="/favourites">
                    My Favourites
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/following">Following</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="My Recipes" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/my-recipes">My Recipes</NavDropdown.Item>
                  <NavDropdown.Item href="/add-recipe">
                    Upload
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/account">My Account</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {children}
      </>
    );
  }
  
  export default Layout3;