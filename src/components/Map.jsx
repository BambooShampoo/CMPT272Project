import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function Map() {
    const [items, setItems] = useState([]);

    const fetchItems = () => {
        const placedMarkers = localStorage.getItem('placedMarkers');
        setItems(placedMarkers ? JSON.parse(placedMarkers) : []);
    }

    const loadDataOnce = () => {
        if (!localStorage.getItem('hasLoadedMarkerData')) {  // Changed to reflect marker data
            fetch('/preload.json')  // Your preload JSON path
                .then(response => response.json())
                .then(data => {
                    const existingData = JSON.parse(localStorage.getItem('placedMarkers')) || [];  // Fetch from "placedMarkers"
                    // Assuming the data structure is an array of markers, ensure no duplicates by checking IDs or positions
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
            <MapContainer className='map' center={[49.275923, -122.913254]} zoom={10} style={{ height: '100%', width: '100%'}}>
                {/* adapted from https://leafletjs.com/examples/quick-start/ */}
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {items.map((marker) => (
                    <Marker key={marker.id} position={[marker.lat, marker.lon]}>
                        {/* @Gordon: For onClick of this marker, you should probably make a separate component or JSX to display info about the emergency */}
                    </Marker>
                ))}
            </MapContainer>
        </>
    );
}

export default Map;
