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
  const [resolvePromise, setResolvePromise] = useState(null);
  
  const handlePasswordProtection = () => {
    setModalOpen(true); // Open the modal
    return new Promise((resolve) => {
      setResolvePromise(() => resolve); // Save the resolve function
    });
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
    return storedHash === enteredHash;
  };

  const handlePasswordSubmission = async (enteredPassword) => {
    const isValid = await verifyPassword(enteredPassword);
    console.log('Password Valid:', isValid); // Debug: Check if password is valid
  
    if (resolvePromise) {
      resolvePromise(isValid); // Resolve the Promise with the validation result
    }
    return isValid; // Return the result for modal feedback
  };

  const handleCancel = () => {
    setModalOpen(false); // Close the modal
    if (resolvePromise) {
      resolvePromise(false); // Resolve the Promise with `false` for cancellation
    }
    setPassword(''); // Clear the password field
  };

  return (
    <>
      <Header />

      <div className="map-and-form-container">
        <div className="map-container">
          <Map activeMarkerId={activeMarkerId} setActiveMarkerId={setActiveMarkerId} />
        </div>
        <div className='emergency-details'>
          <EmergencyDetails activeMarkerId={activeMarkerId}></EmergencyDetails>
        </div>
      </div>
      <EmergencyList handlePasswordProtection={handlePasswordProtection} activeMarkerId={activeMarkerId} setActiveMarkerId={setActiveMarkerId}/>
      <PasswordModal
        isOpen={isModalOpen}
        handleCancel={handleCancel}
        onSubmit={handlePasswordSubmission}
      />
      <Form />
    </>
  );
}

export default App;
