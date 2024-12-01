import React, { useState } from 'react';

const PasswordModal = ({ isOpen, onClose, onSubmit }) => {
  const [enteredPassword, setEnteredPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  /* Function to handle submission of the password. Will display error message if password is incorrect, 
      and continue to prompt the user for password until it is correct. Will display success message if password is correct.
  */
  const handleSubmit = async () => {
    const isValid = await onSubmit(enteredPassword);
    if (isValid) {
      setErrorMessage(''); 
      setSuccessMessage('Login successful!'); 
      setTimeout(() => {
        setSuccessMessage(''); 
        setEnteredPassword(''); 
        onClose();
      }, 2000); // Timeout after 2 seconds
    } else {
      setSuccessMessage(''); 
      setErrorMessage('Incorrect password. Please try again.');
      setEnteredPassword('');
    }
  };

  return (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Enter Password</h2>
      <input
        type="password"
        placeholder="Enter password"
        value={enteredPassword}
        onChange={(e) => setEnteredPassword(e.target.value)}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
      {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
      <div className="modal-actions">
        <button id="modal-cancel" onClick={onClose}>Cancel</button>
        <button id="modal-submit" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  </div>
  );
};

export default PasswordModal;
