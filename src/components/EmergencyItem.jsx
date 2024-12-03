import React from 'react';

function EmergencyItem({ emergency, activeMarkerId, handleItemClick, handlePasswordProtection, handleStatusChange, handleRemoval }) {
    // time = emergency.time;
    return (
        <li key={emergency.id} onClick={() => handleItemClick(emergency)} style={{ cursor: 'pointer', backgroundColor: activeMarkerId && emergency.id === activeMarkerId.id ? 'lightgrey' : 'white' }}>
            {/* <h3>{emergency.name}</h3> */}
            <p>{emergency.id}</p>
            <p>{emergency.location}</p>
            <p>{emergency.emergencyType}</p>
            <p>{emergency.time}</p>
            <p>{emergency.status}</p>
            {/*I added this here to test the password, dont scream at me Ali*/}
            <button onClick={(e) => {
                e.stopPropagation(); // Prevent onClick of parent
                handlePasswordProtection();
            }}>
                More Info
            </button>
            <button onClick={(e) => {
                e.stopPropagation(); // Prevent onClick of parent
                handleStatusChange(emergency.id);
            }}>
                Resolve
            </button>
            <button onClick={(e) => {
                e.stopPropagation(); // Prevent onClick of parent
                handleRemoval(emergency.id);
            }}>
                Remove
            </button>
        </li>
    );
}

export default EmergencyItem;
