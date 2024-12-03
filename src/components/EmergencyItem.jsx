import React from 'react';

function displayDate(time) {
    var date = '';
    for (let i = 0; time[i] != 'T'; i++) {
        date += time[i];
    }
    return date;
};

function displayTime(time) {
    let timeSubstring = time.split('T')[1];
    return timeSubstring.substring(0,5);
};


function EmergencyItem({ emergency, activeMarkerId, handleItemClick, handlePasswordProtection, handleStatusChange, handleRemoval }) {
    return (
        <li className='emergency-item' key={emergency.id} onClick={() => handleItemClick(emergency)} style={{ cursor: 'pointer', backgroundColor: activeMarkerId && emergency.id === activeMarkerId.id ? 'lightgrey' : 'white' }}>
            <p className='emergency-id'>{emergency.id}</p>
            <p>{emergency.location}</p>
            <p>{emergency.emergencyType}</p>
            <p>{displayDate(emergency.time)} {displayTime(emergency.time)}</p>
            <p style={{ cursor: 'pointer', color: emergency.status === "OPEN" ? 'red' : 'green' }}>
                {emergency.status}
            </p>
            <button className='list-button' onClick={(e) => {
                e.stopPropagation(); // Prevent onClick of parent
                handleStatusChange(emergency.id);
            }}>
                Resolve
            </button>
            <button className='list-button' onClick={(e) => {
                e.stopPropagation(); // Prevent onClick of parent
                handleRemoval(emergency.id);
            }}>
                Remove
            </button>
        </li>
    );
}

export default EmergencyItem;
