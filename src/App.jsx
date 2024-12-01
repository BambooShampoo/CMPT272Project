import React, {useState} from 'react';
import './App.css';
import Header from "./components/Header.jsx";
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import Form from './components/Form.jsx';
import EmergencyList from "./components/EmergencyList";
import Map from './components/Map.jsx';
import PasswordModal from './components/PasswordModal';
import EmergencyDetails from './components/EmergencyDetails.jsx';


const storePasswordManually = async () => {
  try {
    const response = await fetch(`https://api.hashify.net/hash/md5/hex?value=password`);
    const hash = await response.text();
    localStorage.setItem('passwordHash', hash);
    console.log(`Password hash stored: ${hash}`);
  } catch (error) {
    console.error('Error storing password hash manually: ', error);
  }
};

// Function called to set up the password manually (we can easily change this to be set by user too)
storePasswordManually();

function App() {
  const [activeMarkerId, setActiveMarkerId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const handlePasswordProtection = () => {
    setModalOpen(true); 
  };

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
      return true;
    }else{
      return false;
    }
  };

  const handlePasswordSubmission = async (enteredPassword) => {
    const isValid = await verifyPassword(enteredPassword);
    return isValid;
  };

  return (
    <>
      <Header />

      <div className="map-and-form-container">
        <div className="map-container">
        <Map activeMarkerId={activeMarkerId} setActiveMarkerId={setActiveMarkerId}/>
        </div>
        <Form />
      </div>
      <div className='emergency-details'>
        <EmergencyDetails activeMarkerId={activeMarkerId}></EmergencyDetails>
      </div>
      <EmergencyList handlePasswordProtection={handlePasswordProtection} activeMarkerId={activeMarkerId} setActiveMarkerId={setActiveMarkerId}/>
      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handlePasswordSubmission}
      />
    </>
  );
}

export default App;
