function EmergencyDetails( {activeMarkerId} ) {
    if (!activeMarkerId) {
        return <p>Select an emergency</p>
    }
    return (
        <>
        <img src={activeMarkerId.pictureLink}/>
        <p>
            <b>Type:</b> {activeMarkerId.emergencyType}<br/>
            <b>Location:</b> {activeMarkerId.location}<br/>
            <b>Reported by:</b> {activeMarkerId.name} ({activeMarkerId.phone[0] + activeMarkerId.phone[1] + activeMarkerId.phone[2]}-
            {activeMarkerId.phone[3] + activeMarkerId.phone[4] + activeMarkerId.phone[5]}-{activeMarkerId.phone[6] + activeMarkerId.phone[7] + activeMarkerId.phone[8] + activeMarkerId.phone[9]})<br/>
            <b>Comments: </b> {activeMarkerId.comments}
        
        </p>
        </>
    );
}

export default EmergencyDetails;