function EmergencyDetails( {activeMarker} ) {
    if (!activeMarker) {
        return <p>Select an emergency</p>
    }
    return (
        <>
        <img src={activeMarker.pictureLink}/>
        <p>
            <b>Type:</b> {activeMarker.emergencyType}<br/>
            <b>Location:</b> {activeMarker.location}<br/>
            <b>Reported by:</b> {activeMarker.name} ({activeMarker.phone[0] + activeMarker.phone[1] + activeMarker.phone[2]}-
            {activeMarker.phone[3] + activeMarker.phone[4] + activeMarker.phone[5]}-{activeMarker.phone[6] + activeMarker.phone[7] + activeMarker.phone[8] + activeMarker.phone[9]})<br/>
            <b>Comments: </b> {activeMarker.comments}
        
        </p>
        </>
    );
}

export default EmergencyDetails;