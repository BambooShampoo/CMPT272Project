import React from 'react';
import './App.css';
import Header from "./components/Header.jsx";
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import Form from './components/Form.jsx';
import EmergencyList from "./components/EmergencyList";
import Map from './components/Map.jsx';

function App() {
  return (
    <>
      <Header />

      <div className="map-and-form-container">
        <div className="map-container">
          <Map/>
        </div>
        <Form />
      </div>
      <EmergencyList />
    </>
  );
}

export default App;
