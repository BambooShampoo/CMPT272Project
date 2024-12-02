import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';

// Define default and red icons
const defaultIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
});

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
});

function Map({ activeMarkerId, setActiveMarkerId }) {
    const [items, setItems] = useState([]);
    const [popupInfo, setPopupInfo] = useState(null);

    useEffect(() => {
        if (activeMarkerId) {
            setPopupInfo({
                position: [activeMarkerId.lat, activeMarkerId.lon],
                content: (
                    <>
                        <b>{activeMarkerId.location}</b><br />
                        {activeMarkerId.emergencyType}
                    </>
                ),
            });
        }
    }, [activeMarkerId]);

    const handleMarkerClick = (marker) => {
        setActiveMarkerId(marker);
    };

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
                    localStorage.setItem('visible', JSON.stringify(updatedData));
                    localStorage.setItem('hasLoadedMarkerData', 'true');
                    fetchItems();
                })
                .catch((error) => console.error('Error fetching JSON:', error));
        }
    };

    const MapEventLogger = () => {
        const map = useMap();
        const placedMarkers = JSON.parse(localStorage.getItem('placedMarkers') || '[]');
        
        useMapEvents({
            moveend: () => {
                const bounds = map.getBounds();
                console.log('New bounds:', bounds.toBBoxString());
                checkMarkersWithinBounds(bounds, placedMarkers);
            },
            zoomend: () => {
                const bounds = map.getBounds();
                console.log('New bounds:', bounds.toBBoxString());
                checkMarkersWithinBounds(bounds, placedMarkers);
            },
            viewreset: () => {
                const bounds = map.getBounds();
                console.log('New bounds:', bounds.toBBoxString());
                checkMarkersWithinBounds(bounds, placedMarkers);
            }
        });
    
        const checkMarkersWithinBounds = (bounds, markers) => {
            if (!Array.isArray(markers)) {
                console.warn('Placed markers data is not an array or is corrupted.');
                return;
            }
    
            const visibleMarkers = markers.filter((marker) => {
                if (marker && marker.lat != null && marker.lon != null) {
                    const latLng = L.latLng(Number(marker.lat), Number(marker.lon)); 
                    return bounds.contains(latLng);
                }
                return false; 
            });
            localStorage.setItem('visible', JSON.stringify(visibleMarkers));
            const event = new Event('emergencyReported');
            window.dispatchEvent(event);
    
            console.log(`Stored ${visibleMarkers.length} visible markers in localStorage.`);
        };
    
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
            <MapContainer className="map" center={[49.275923, -122.913254]} zoom={10} style={{ height: '100%', width: '100%' }} minZoom={5} maxBounds={[[60.241692, -142.038487], [48.630107, -112.076908]]}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapEventLogger />
                {items.map((marker) => (
                        <Marker key={marker.id} position={[marker.lat, marker.lon]} eventHandlers={{ click: () => handleMarkerClick(marker) }} icon={activeMarkerId && activeMarkerId.id === marker.id ? redIcon : defaultIcon}/>
                ))}
                {popupInfo && (
                    <Popup position={popupInfo.position} offset={new L.Point(0, -30)}>
                        {popupInfo.content}
                    </Popup>
                )}
            </MapContainer>
        </>
    );
}

export default Map;
