import React from "react";

function EmergencyList() {
    const emergency = JSON.parse(localStorage.getItem('emergency'));
    return (
        <section className="list">
        <ul className="emergencies">
            <li>{emergency ? emergency.name || "Emergency 1 Data" : "No Emergency Data"}</li>
            <li>Emergency 2 Component</li>
            <li>Emergency 3 Component</li>
        </ul>
        </section>
    );
}

export default EmergencyList;