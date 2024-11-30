import React, { useState } from 'react';
import {Marker, Popup} from 'react-leaflet';

function MarkerList(){
    const emergency = JSON.parse(localStorage.getItem('emergency'));
    return (
        <>
            <Marker position={[emergency.lat,emergency.lon]}>
                {/* @Gordon for onClick of this marker,You should probably make a seperate component and jsx to display the stuff for the emergency as a seperate popup*/}
            </Marker>
        </>
    );
}

export default MarkerList;