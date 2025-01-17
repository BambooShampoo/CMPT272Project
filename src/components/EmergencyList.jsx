import { useState, useEffect} from 'react';
import EmergencyItem from './EmergencyItem';

function EmergencyList({ handlePasswordProtection, setActiveMarkerId, activeMarkerId}) {
    const [items, setItems] = useState([]);

    const [sortOrder, setSortOrder] = useState('desc');

    const handleItemClick = (id) => {
        setActiveMarkerId(id);
    };

    const fetchItems = () => {
        const emergencies = localStorage.getItem('visible');
        setItems(emergencies ? JSON.parse(emergencies) : []);
    
        // change id: Type and id: Status to ALL
        document.getElementById('Type').value = 'All';
        document.getElementById('Status').value = 'All';

        setSortOrder('desc');
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

    const resolveEmergency = async (id) => {
        try {
            let isVerified = false;
    
            // Keep prompting until the password is verified or the user cancels
            while (!isVerified) {
                const result = await handlePasswordProtection(); // Wait for password verification or cancellation
    
                if (result === "canceled") {
                    console.log("Password prompt canceled. Exiting resolveEmergency.");
                    return; // Exit the function on cancellation
                }
    
                isVerified = result; // Update isVerified based on the result
    
                if (isVerified) {
                    console.log('Password verification successful. Resolving emergency...');
                    // Proceed with resolving the emergency
                    const updatedItems = items.map((item) =>
                        item.id === id ? { ...item, status: 'RESOLVED' } : item
                    );
                    localStorage.setItem('emergencies', JSON.stringify(updatedItems)); // Update localStorage

                    // Change the item to have resolved status in placedMarkers to stop resetting the status on form submission
                    const storedMarkers = JSON.parse(localStorage.getItem('placedMarkers')) || [];
                    const updatedMarkers = storedMarkers.map((marker) =>
                        marker.id === id ? { ...marker, status: 'RESOLVED' } : marker
                    );
                    localStorage.setItem('placedMarkers', JSON.stringify(updatedMarkers));

                    setItems(updatedItems); // Trigger re-render
                    console.log(`Emergency with ID ${id} resolved.`);
                    return; // Exit the function after successful resolution
                } else {
                    console.log('Password verification failed. Retrying...');
                    // Loop continues for re-prompting
                }
            }
        } catch (error) {
            console.error('Error resolving emergency:', error);
        }
    };

    const removeEmergency = async (id) => {
        try {
            let isVerified = false;
    
            // Keep prompting until the password is verified or the user cancels
            while (!isVerified) {
                const result = await handlePasswordProtection(); // Wait for password verification or cancellation
    
                if (result === "canceled") {
                    console.log("Password prompt canceled. Exiting removeEmergency.");
                    return; // Exit the function on cancellation
                }
    
                isVerified = result; // Update isVerified based on the result
    
                if (isVerified) {
                    console.log('Password verification successful. Removing emergency...');
                    // Proceed with removing the emergency
                    const updatedEmergencies = (JSON.parse(localStorage.getItem('emergencies')) || []).filter(item => item.id !== id);
                    const updatedPlacedMarkers = (JSON.parse(localStorage.getItem('placedMarkers')) || []).filter(item => item.id !== id);
                    const updatedVisible = (JSON.parse(localStorage.getItem('visible')) || []).filter(item => item.id !== id);
    
                    // Update localStorage
                    localStorage.setItem('emergencies', JSON.stringify(updatedEmergencies));
                    localStorage.setItem('placedMarkers', JSON.stringify(updatedPlacedMarkers));
                    localStorage.setItem('visible', JSON.stringify(updatedVisible));
    
                    // Update state to trigger re-render
                    setItems(updatedVisible); // Keep only visible emergencies in the state
                    setActiveMarkerId(null);
    
                    // Dispatch a custom event to update the map
                    const event = new Event('markerUpdated');
                    window.dispatchEvent(event);
    
                    console.log(`Emergency with ID ${id} removed.`);
                    return; // Exit the function after successful removal
                } else {
                    console.log('Password verification failed. Retrying...');
                    // Loop continues for re-prompting
                }
            }
        } catch (error) {
            console.error('Error removing emergency:', error);
        }

    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value);

        let updatedItems = JSON.parse(localStorage.getItem('emergencies'))

        if (name === 'Type') {
            document.getElementById('Status').value = 'All';
                updatedItems = updatedItems.filter((item) => {
                if (value === 'All') {
                    return true;
                }
                return item.emergencyType === value;
            });
            console.log(updatedItems);
            setItems(updatedItems);
        }
        if (name === 'Status') {
            document.getElementById('Type').value = 'All';
                updatedItems = updatedItems.filter((item) => {
                if (value === 'All') {
                    return true;
                }
                return item.status === value;
            });
            console.log(updatedItems);
            setItems(updatedItems);
        }

    };

    const handleSort = () => {
        const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc'; 
        const sortedItems = [...items].reverse(); 
        setItems(sortedItems); 
        setSortOrder(newSortOrder); 
    };
    
    return (
        <section className="list">
            <div className='list-filter-container'>
                <button className='list-filter'>Location</button>
                <section>
                    <label htmlFor="Type" className='list-filter-label'>Emergency Type: </label>
                    <select name="Type" id='Type' className='list-filter' onChange={handleFilterChange}>
                        <option value="All">All</option>
                        <option value="fire">Fire</option>
                        <option value="shooting">Shooting</option>
                        <option value="medical">Medical</option>
                        <option value="vehicle accident">Vehicle</option>
                        <option value="other">Other</option>
                </select>
                </section>
                <button className='list-filter sortButton' onClick={handleSort}>
                    Time Reported {sortOrder === 'desc' ? '▼' : '▲'}
                </button>
                <section>
                    <label htmlFor="Status" className='list-filter-label'>Status: </label>
                    <select name="Status" id='Status' className='list-filter' onChange={handleFilterChange}>
                        <option value="All">All</option>
                        <option value="OPEN">Open</option>
                        <option value="RESOLVED">Resolved</option>
                    </select>
                </section>
            </div>
             <ul className="emergencies">
                 {items.map((emergency) => (
                    <EmergencyItem
                        key={emergency.id}
                        emergency={emergency}
                        activeMarkerId={activeMarkerId}
                        handleItemClick={handleItemClick}
                        handleStatusChange={resolveEmergency}
                        handleRemoval={removeEmergency}
                    />
                ))}
            </ul>
        </section>
    );
}

export default EmergencyList;