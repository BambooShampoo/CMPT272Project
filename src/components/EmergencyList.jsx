import { useState, useEffect} from 'react';

function EmergencyList() {
    const [items, setItems] = useState([]);

    const fetchItems = () => {
        const emergencies = localStorage.getItem('emergencies');
        setItems(emergencies ? JSON.parse(emergencies) : []);
    }

    useEffect(() => {
        fetchItems();

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
                </li>
            ))}
        </ul>
        </section>
    );
}

export default EmergencyList;