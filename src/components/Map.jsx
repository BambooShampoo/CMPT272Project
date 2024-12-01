import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';

function Map() {
    const [items, setItems] = useState([]);

    const fetchItems = () => {
        const placedMarkers = localStorage.getItem('placedMarkers');
        setItems(placedMarkers ? JSON.parse(placedMarkers) : []);
    };

    const loadDataOnce = () => {
        if (!localStorage.getItem('hasLoadedMarkerData')) {  
            fetch('/preload.json')
                .then((response) => response.json())
                .then((data) => {
                    const existingData = JSON.parse(localStorage.getItem('placedMarkers')) || [];  
                    const updatedData = [...existingData, ...data];
                    localStorage.setItem('placedMarkers', JSON.stringify(updatedData));
                    localStorage.setItem('hasLoadedMarkerData', 'true');
                    fetchItems(); 
                })
                .catch((error) => console.error('Error fetching JSON:', error));
        }
    };

    const MapEventLogger = () => {
        const map = useMap(); // Access the map instance

        useMapEvents({
            moveend: () => {
                const bounds = map.getBounds(); // Get the current bounds
                console.log('New bounds:', bounds.toBBoxString()); // Log bounds in bbox format
            },
            zoomend: () => {
                const bounds = map.getBounds(); // Get the current bounds
                console.log('New bounds:', bounds.toBBoxString()); // Log bounds in bbox format
            },
        });

        return null;
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
            <MapContainer className="map" center={[49.275923, -122.913254]} zoom={10} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <MapEventLogger />
                {items.map((marker) => (
                    <Marker key={marker.id} position={[marker.lat, marker.lon]}>
                        {/* Add marker information here */}
                    </Marker>
                ))}
            </MapContainer>
        </>
    );
}

export default Map;
