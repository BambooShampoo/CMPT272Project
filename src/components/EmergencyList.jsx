import { useState, useEffect} from 'react';

function EmergencyList({ handlePasswordProtection }) {
    const [items, setItems] = useState([]);

    const fetchItems = () => {
        const emergencies = localStorage.getItem('emergencies');
        setItems(emergencies ? JSON.parse(emergencies) : []);

    }
    
    const loadDataOnce = () => {
        if (!localStorage.getItem('hasLoadedEmergencyData')) { 
            fetch('/preload.json')
                .then(response => response.json())
                .then(data => {
                    const existingData = JSON.parse(localStorage.getItem('emergencies')) || [];
                    const updatedData = [...existingData, ...data];
                    localStorage.setItem('emergencies', JSON.stringify(updatedData));
                    localStorage.setItem('hasLoadedEmergencyData', 'true');
                    fetchItems();
                })
                .catch(error => console.error('Error fetching JSON:', error));
        }
    };

    useEffect(() => {
        fetchItems();

        loadDataOnce();

        const handleStorageUpdate = () => {
            console.log('emergencyReported event detected');
            fetchItems();
        };

        window.addEventListener('emergencyReported', handleStorageUpdate);

        return () => {
            window.removeEventListener('emergencyReported', handleStorageUpdate);
        };
    }, []);

    return (
        <section className="list">
        <ul className="emergencies">
            {items.map((emergency) => (
                <li key={emergency.id}>
                    <h3>{emergency.name}</h3>
                    <p>{emergency.phone}</p>
                    <p>{emergency.emergencyType}</p>
                    <p>{emergency.location}</p>
                    {/*I added this here to test the password, dont scream at me Ali*/}
                    <button onClick={() => handlePasswordProtection()}>Click mee</button>
                </li>
            ))}
        </ul>
        </section>
    );
}

export default EmergencyList;