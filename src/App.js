import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Home } from "./components/Home.js";
import { FactorySites } from "./components/FactorySites.js";
import { Departments } from "./components/Departments.js";
import { WareHouses } from "./components/WareHouses.js";
import { LeftMenu } from './components/LeftMenu.js';
import { RegistriesPanel } from './components/RegistriesPanel.js'; // Импортируем новый компонент

const App = () => (
  <>
    <Navbar expand="sm" variant="dark" bg="dark">
      <div className="container-fluid">
        <Navbar.Toggle aria-controls="navbarCollapse" title="Переключить навигацию" />
        <Navbar.Collapse id="navbarCollapse" className="d-sm-inline-flex justify-content-between">
          <Nav className="navbar-nav flex-grow-1">
            <Nav.Link href="#login">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>

    <div className="d-flex flex-row">
      <Router>
        <LeftMenu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="Departments/:operation" element={<Departments />} />
          <Route path="FactorySites/:operation" element={<FactorySites />} />
          <Route path="WareHouses/:operation" element={<WareHouses />} />
          <Route path="Registries/:name/:operation" element={<RegistriesPanel />} />
          <Route path="Registries/:name/:operation" element={<RegistriesPanel />} />
        </Routes>
      </Router>
    </div>
  </>
);

export default App;
