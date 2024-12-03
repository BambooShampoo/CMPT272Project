function displayComment(comment) {
    if(comment == '') {
        return 'None';
    }
    return comment;
};

function displayDate(time) {
    var date = '';
    for (let i = 0; time[i] != 'T'; i++) {
        date += time[i];
    }
    return date;
};

function displayTime(time) {
    let timeSubstring = time.split('T')[1];
    return timeSubstring.substring(0,5);
};

function EmergencyDetails( {activeMarkerId} ) {
    if (!activeMarkerId) {
        return <p className="emergency-text">No emergency highlighted</p>
    }
    
    return (
        <>
        <p className="emergency-text">
            <img src={activeMarkerId.pictureLink} className="emergency-image"/>
            <b>Type:</b> {activeMarkerId.emergencyType}<br/>
            <b>Location:</b> {activeMarkerId.location}<br/>
            <b>Reported by:</b> {activeMarkerId.name} ({activeMarkerId.phone[0] + activeMarkerId.phone[1] + activeMarkerId.phone[2]}-
            {activeMarkerId.phone[3] + activeMarkerId.phone[4] + activeMarkerId.phone[5]}-{activeMarkerId.phone[6] + activeMarkerId.phone[7] + activeMarkerId.phone[8] + activeMarkerId.phone[9]})<br/>
            <b>Comments: </b> {displayComment(activeMarkerId.comments)}<br/>
            <b>Date: </b> {displayDate(activeMarkerId.time)}<br/>
            <b>Time Reported:</b> {displayTime(activeMarkerId.time)}<br/>
            <b>Status: </b> {activeMarkerId.status}
        </p>
        </>
    );
}

export default EmergencyDetails;
