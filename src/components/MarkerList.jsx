import { useState, useEffect } from 'react';
import { Marker } from 'react-leaflet';

function MarkerList() {
    const [items, setItems] = useState([]);

    const fetchItems = () => {
        const placedMarkers = localStorage.getItem('placedMarkers');
        setItems(placedMarkers ? JSON.parse(placedMarkers) : []);
    }

    const loadDataOnce = () => {
        if (!localStorage.getItem('hasLoadedMarkerData')) {  
            fetch('/preload.json')
                .then(response => response.json())
                .then(data => {
                    const existingData = JSON.parse(localStorage.getItem('placedMarkers')) || [];
                    const updatedData = [...existingData,...data];
                    localStorage.setItem('placedMarkers', JSON.stringify(updatedData));
                    localStorage.setItem('hasLoadedMarkerData', 'true');
                    fetchItems();
                })
                .catch(error => console.error('Error fetching JSON:', error));
        }
    };

    useEffect(() => {
        fetchItems();
        loadDataOnce();

        const handleStorageUpdate = () => {
            console.log('Marker data updated');
            fetchItems();
        };

        window.addEventListener('markerUpdated', handleStorageUpdate);  

        return () => {
            window.removeEventListener('markerUpdated', handleStorageUpdate);
        };
    }, []);

    return (
        <>
            {items.map((marker) => (
                <Marker key={marker.id} position={[marker.lat, marker.lon]}>
                    {/* @Gordon: For onClick of this marker, you should probably make a separate component or JSX to display info about the emergency */}
                </Marker>
            ))}
        </>
    );
}

export default MarkerList;
