import React from 'react';
import './App.css';
import Header from "./components/Header.jsx";
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import Form from './components/Form.jsx';
import EmergencyList from "./components/EmergencyList";
import Map from './components/Map.jsx';


const storePasswordManually = async () => {
  try {
    const response = await fetch(`https://api.hashify.net/hash/md5/hex?value=password`);
    const hash = await response.text();
    localStorage.setItem('passwordHash', hash);
    console.log(`Password hash stored: ${cleahashnHash}`);
  } catch (error) {
    console.error('Error storing password hash manually: ', error);
  }
};

// Function called to set up the password manually (we can easily change this to be set by user too)
storePasswordManually();

function App() {

const hashPassword = async(password) => {
  try{
    const response = await fetch (`https://api.hashify.net/hash/md5/hex?value=${encodeURIComponent(password)}`);
    const hash = await response.text();
    return hash;
  }catch (error){
    console.error('Error hashing password: ', error);
    return null;
  }
};

const verifyPassword = async (enteredPassword) => {
  const storedHash = localStorage.getItem('passwordHash');
  const enteredHash = await hashPassword(enteredPassword);
  console.log(enteredHash);
  if(storedHash === enteredHash){
    alert('Password verified');
    return true;
  }else{
    alert('Incorrect password');
    return false;
  }
};

const handlePasswordProtection = async () => {
  const enteredPassword = prompt('Enter password:');
  if (enteredPassword) {
    const isValid = await verifyPassword(enteredPassword);
    if (isValid) {
      console.log('Access granted!');
      // Perform the action for the list item
    } else {
      console.log('Access denied!');
    }
  }
};
  return (
    <>
      <Header />

      <div className="map-and-form-container">
        <div className="map-container">
          <Map/>
        </div>
        <Form />
      </div>
      <EmergencyList handlePasswordProtection={handlePasswordProtection}/>
    </>
  );
}

export default App;
