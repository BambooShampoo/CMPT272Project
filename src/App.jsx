import React from 'react';
import './App.css';
import Header from "./components/Header.jsx";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import Form from './components/Form.jsx';
import EmergencyList from "./components/EmergencyList";
import MarkerList from './components/MarkerList.jsx';

function App() {
  return (
    <>
      <Header />

      <div className="map-and-form-container">
        <div className="map-container">
          <MapContainer className='map' center={[49.275923, -122.913254]} zoom={10} style={{ height: '100%', width: '100%'}}>
            {/* adapted from https://leafletjs.com/examples/quick-start/ */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* <MarkerList/> */}
          </MapContainer>
        </div>
        <Form />
      </div>
      <EmergencyList />
    </>
  );
}

export default App;
