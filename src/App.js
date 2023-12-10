import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Home from './Upload'; 
import PDF from './pdf'; 


const App = () => {
  return (
    <Router>
  
  <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/pdf/generator" element={<PDF />} />

          <Route
            path="*"
            element={
              <div>
                <h2>404 Page not found etc</h2>
              </div>
            }
          />
        </Routes>

  </Router>
  );
};

export default App;
