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

    const resolveEmergency = (id) => {
        if(handlePasswordProtection){
            const updatedItems = items.map((item) =>
                item.id === id ? { ...item, status: 'RESOLVED' } : item
            );
            localStorage.setItem('emergencies', JSON.stringify(updatedItems)); // Update localStorage
            setItems(updatedItems); // Trigger re-render
        }
    };

    const removeEmergency = (id) => {
        const updatedItems = items.filter((item) => item.id !== id); // Filter out the item
        // const updatedMarkers = JSON.parse(localStorage.getItem('placedMarkers')).filter((item) => item.id !== id); // Filter out the marker
        // const updatedVisible = JSON.parse(localStorage.getItem('visible')).filter((item) => item.id !== id); // Filter out the visible marker
        localStorage.setItem('emergencies', JSON.stringify(updatedItems)); // Update localStorage
        // localStorage.setItem('placedMarkers', JSON.stringify(updatedMarkers)); // Update localStorage
        // localStorage.setItem('visible', JSON.stringify(updatedVisible)); // Update localStorage
        setItems(updatedItems); // Trigger re-render
    };

    return (
        <section className="list">
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