import React, { useState } from 'react';

function Form() {
    // const [items, setItems] = useState([]);
    // var emergencies = [];

    const getMaxId = () => {
        const emergencies = JSON.parse(localStorage.getItem('emergencies')) || [];
        return emergencies.length > 0 ? Math.max(...emergencies.map(emergency => emergency.id)) : 0;
    };

    const [id, setId] = useState(getMaxId() + 1);

    const [formData, setFormData] = useState({
        id: id,
        name: '',
        phone: '',
        emergencyType: '',
        otherEmergency: '',
        location: '',
        pictureLink: '',
        comments: '',
        });

    const [location, setLocation] = useState({ latitude: null, longitude: null });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        };

    // Function to get the users current location
    const getGeolocation = async () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        reject(error);
                    }
                );
            } else {
                reject(new Error("Geolocation is not supported by this browser."));
            }
        });
    };

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        try {
            const coords = await getGeolocation(); // Get the user's location
            setLocation(coords);

            const submissionData = {
                ...formData,
                time: new Date().toISOString(), // Logs the current date and time in ISO format
                status: "OPEN", // Status set to 'OPEN'
                lat: `${coords.latitude}`, 
                lon: `${coords.longitude}`
            };

            // console.log(JSON.stringify(submissionData));

            // Get current emergencies from localStorage
            const storedEmergencies = JSON.parse(localStorage.getItem('emergencies')) || [];
            const updatedEmergencies = [...storedEmergencies, submissionData];
            
            // Save updated emergency data back to localStorage
            localStorage.setItem('emergencies', JSON.stringify(updatedEmergencies));

            // Add the new emergency to the markers as well
            const storedMarkers = JSON.parse(localStorage.getItem('placedMarkers')) || [];
            const updatedMarkers = [...storedMarkers, submissionData];
            
            // Save updated markers back to localStorage
            localStorage.setItem('placedMarkers', JSON.stringify(updatedMarkers));

            // Trigger event to notify map that data has changed
            const event = new Event('markerUpdated');
            window.dispatchEvent(event);

            setTimeout(() => {
                const event = new Event('emergencyReported');
                window.dispatchEvent(event);
            }, 0);

            // Save data to localStorage
            setId((prevId) => prevId + 1);

            // Clear the form fields
            setFormData({
                id: id+1,
                name: '',
                phone: '',
                emergencyType: '',
                otherEmergency: '',
                location: '',
                pictureLink: '',
                comments: '',
            });
            
            alert('Emergency report submitted!');
        } catch (error) {
            alert("Unable to retrieve location. Please ensure location services are enabled.");
        }
        
    };

    return (
        <form className="emergency-report" onSubmit={handleSubmit}>
            
            <h2>Report Emergency</h2>
    
            <div className="form-body">
                <div className='form-content'>
                    <label>Name:</label>
                    <input
                        className='form-input'
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='form-content'>
                    <label>Phone:</label>
                    <input
                        className='form-input'
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        pattern="^\d{10}$"
                        required
                    />
                </div>
                <div className='form-content'>
                    <label>Nature of Emergency:</label>
                    <select
                        className='form-input'
                        name="emergencyType"
                        value={formData.emergencyType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select...</option>
                        <option value="fire">Fire</option>
                        <option value="shooting">Shooting</option>
                        <option value="vehicle accident">Vehicle Accident</option>
                        <option value="medical">Medical</option>
                        <option value="other">Other</option>
                    </select>
                </div>
          

                {/* If the emergency type is set to other, display a textbox to specify*/}
                {formData.emergencyType === 'other' && (
                    <div className='form-content'>
                        <label>Please specify:</label>
                        <input 
                        className='form-input'
                        type="text"
                        name="otherEmergency"
                        value={formData.otherEmergency}
                        onChange={handleChange}
                        required={formData.emergencyType === 'other'}
                        />
                    </div>
                )}
            
                <div className='form-content'>
                    <label>Location:</label>
                    <input
                        className='form-input'
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>
            
                <div className='form-content'>
                    <label>Picture Link (optional):</label>
                    <input
                        className='form-input'
                        type="url"
                        name="pictureLink"
                        value={formData.pictureLink}
                        onChange={handleChange}
                    />
                </div>
            
                <div className='form-content'>
                    <label>Comments:</label>
                    <textarea
                        id='comments'
                        className='form-input'
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                    ></textarea>
                </div>
            </div>
            
            <button type="submit" id='submit'>Submit Report</button>
            </form>
        );
}

export default Form;
