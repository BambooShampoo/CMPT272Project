import { useState, useEffect} from 'react';
import EmergencyItem from './EmergencyItem';

function EmergencyList({ handlePasswordProtection, setActiveMarkerId, activeMarkerId}) {
    const [items, setItems] = useState([]);

    const handleItemClick = (id) => {
        setActiveMarkerId(id);
    };

    const fetchItems = () => {
        const emergencies = localStorage.getItem('visible');
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
        // const updatedItems = items.filter((item) => item.id !== id); // Filter out the item
        // // const updatedMarkers = JSON.parse(localStorage.getItem('placedMarkers')).filter((item) => item.id !== id); // Filter out the marker
        // // const updatedVisible = JSON.parse(localStorage.getItem('visible')).filter((item) => item.id !== id); // Filter out the visible marker
        // localStorage.setItem('emergencies', JSON.stringify(updatedItems)); // Update localStorage
        // localStorage.setItem('placedMarkers', JSON.stringify(updatedItems)); // Update localStorage
        // const updatedVisible = JSON.parse(localStorage.getItem('visible') || '[]').filter((marker) => marker.id !== id);
        // localStorage.setItem('visible', JSON.stringify(updatedVisible)); // Update localStorage
        // // localStorage.setItem('visible', JSON.stringify(updatedVisible)); // Update localStorage
        // setItems(updatedItems); // Trigger re-render


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

    

    return (
        <section className="list">
            <div className='list-filter-container'>
                <button className='list-filter'>Location</button>
                <button className='list-filter'>Type</button>
                <button className='list-filter'>Time Reported</button>
                <button className='list-filter'>Status</button>
            </div>
             <ul className="emergencies">
                 {items.map((emergency) => (
                    <EmergencyItem
                        key={emergency.id}
                        emergency={emergency}
                        activeMarkerId={activeMarkerId}
                        handleItemClick={handleItemClick}
                        handlePasswordProtection={handlePasswordProtection}
                        handleStatusChange={resolveEmergency}
                        handleRemoval={removeEmergency}
                    />
                ))}
            </ul>
        </section>
    );
}

export default EmergencyList;

// import { useState, useEffect} from 'react';
// import EmergencyItem from './EmergencyItem';

// function EmergencyList({ handlePasswordProtection, setActiveMarkerId, activeMarkerId }) {
//     const [items, setItems] = useState([]);

//     const handleItemClick = (id) => {
//         setActiveMarkerId(id); // Update active marker ID
//     };

//     const fetchItems = () => {
//         const emergencies = localStorage.getItem('visible');
//         setItems(emergencies ? JSON.parse(emergencies) : []);

//     }
    
//     const loadDataOnce = () => {
//         if (!localStorage.getItem('hasLoadedEmergencyData')) { 
//             fetch('/preload.json')
//                 .then(response => response.json())
//                 .then(data => {
//                     const existingData = JSON.parse(localStorage.getItem('emergencies')) || [];
//                     const updatedData = [...existingData, ...data];
//                     localStorage.setItem('emergencies', JSON.stringify(updatedData));
//                     localStorage.setItem('hasLoadedEmergencyData', 'true');
//                     fetchItems();
//                 })
//                 .catch(error => console.error('Error fetching JSON:', error));
//         }
//     };

//     useEffect(() => {
//         fetchItems();

//         loadDataOnce();

//         const handleStorageUpdate = () => {
//             console.log('emergencyReported event detected');
//             fetchItems();
//         };

//         window.addEventListener('emergencyReported', handleStorageUpdate);

//         return () => {
//             window.removeEventListener('emergencyReported', handleStorageUpdate);
//         };
//     }, []);

//     const resolveEmergency = (id) => {
//         if(handlePasswordProtection){
//             const updatedItems = items.map((item) =>
//                 item.id === id ? { ...item, status: 'RESOLVED' } : item
//             );
//             localStorage.setItem('emergencies', JSON.stringify(updatedItems)); // Update localStorage
//             setItems(updatedItems); // Trigger re-render
//         }
//     };

//     const removeEmergency = (id) => {
//         const updatedItems = items.filter((item) => item.id !== id); // Filter out the item
//         // const updatedMarkers = JSON.parse(localStorage.getItem('placedMarkers')).filter((item) => item.id !== id); // Filter out the marker
//         // const updatedVisible = JSON.parse(localStorage.getItem('visible')).filter((item) => item.id !== id); // Filter out the visible marker
//         localStorage.setItem('emergencies', JSON.stringify(updatedItems)); // Update localStorage
//         // localStorage.setItem('placedMarkers', JSON.stringify(updatedMarkers)); // Update localStorage
//         // localStorage.setItem('visible', JSON.stringify(updatedVisible)); // Update localStorage
//         setItems(updatedItems); // Trigger re-render
//     };

//     return (
//         <section className="list">
//             <ul className="emergencies">
//                 {items.map((emergency) => (
//                     <EmergencyItem
//                         key={emergency.id}
//                         emergency={emergency}
//                         activeMarkerId={activeMarkerId}
//                         handleItemClick={handleItemClick}
//                         handlePasswordProtection={handlePasswordProtection}
//                         handleStatusChange={resolveEmergency}
//                         handleRemoval={removeEmergency}
//                     />
//                 ))}
//             </ul>
//         </section>
//     );
// }

// export default EmergencyList;
