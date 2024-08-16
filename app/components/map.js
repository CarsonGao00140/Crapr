import React, { useState } from 'react';
import { GoogleMap, LoadScript, Circle } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: -34.397,
  lng: 150.644
};

const MapWithCircle = () => {
  const [radius, setRadius] = useState(1000); // 初始半径为1000米

  const onCircleRadiusChanged = (event) => {
    const newRadius = event.radius;
    setRadius(newRadius);
  };

  return (
    <LoadScript
      googleMapsApiKey="YOUR_API_KEY"
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        <Circle
          center={center}
          radius={radius}
          options={{
            fillColor: "rgba(0, 0, 255, 0.2)",
            fillOpacity: 0.5,
            strokeColor: "blue",
            strokeOpacity: 1,
            strokeWeight: 2,
            clickable: true,
            draggable: true, // 允许拖动圆心
            editable: true,  // 允许调整半径
            zIndex: 1
          }}
          onRadiusChanged={(event) => onCircleRadiusChanged(event)}
        />
      </GoogleMap>
    </LoadScript>
  )
}

export default MapWithCircle;