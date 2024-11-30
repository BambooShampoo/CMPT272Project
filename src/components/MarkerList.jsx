import { useState, useEffect} from 'react';
import {Marker} from 'react-leaflet';

function MarkerList(){
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
        <>
            {items.map((emergency) => (
                <Marker position={[emergency.lat,emergency.lon]}>
                {/* @Gordon for onClick of this marker,You should probably make a seperate component and jsx to display the stuff for the emergency as a seperate popup*/}
                </Marker>
            ))}
        </>
    );
}

export default MarkerList;