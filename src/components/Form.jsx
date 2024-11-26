import React, { useState } from 'react';

function Form() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        emergencyType: '',
        otherEmergency: '',
        location: '',
        pictureLink: '',
        comments: '',
        });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            time: new Date().toISOString(), // Logs the current date and time in ISO format
            status: "OPEN", // Status set to 'OPEN'
        };
        // console.log('Form submitted:', submissionData);
        localStorage.setItem('emergency', JSON.stringify(submissionData));
        alert('Emergency report submitted!');
        };

    return (
        <form className="emergency-report" onSubmit={handleSubmit}>
            
            <h2>Report Emergency</h2>
    
            <div>
            <label>
                Name:
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                </label>
            </div>
    
            <div>
                <label>
                Phone:
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
                </label>
            </div>
    
            <div>
                <label>
                Nature of Emergency:
                <select
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
                </label>
            </div>
            {/* If the emergency type is set to other, display a textbox to specify*/}
            {formData.emergencyType === 'other' && (
                <div>
                <label>
                    Please specify:
                    <input
                    type="text"
                    name="otherEmergency"
                    value={formData.otherEmergency}
                    onChange={handleChange}
                    required={formData.emergencyType === 'other'}
                    />
                </label>
                </div>
            )}
        
            <div>
                <label>
                Location:
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                />
                </label>
            </div>
        
            <div>
                <label>
                Picture Link (optional):
                <input
                    type="url"
                    name="pictureLink"
                    value={formData.pictureLink}
                    onChange={handleChange}
                />
                </label>
            </div>
        
            <div>
                <label>
                Comments:
                <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                ></textarea>
                </label>
            </div>
        
            <button type="submit">Submit Report</button>
            </form>
        );
}

export default Form;