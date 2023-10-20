import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  CircleF,
} from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import styles from './Map.module.scss';

const mapStyles = {
  width: "100%",
  height: "100%",
};

const MapContainer = ({ myAddress, mapWidth, mapHeight }) => {
  const [lat, setLat] = useState(-34.397);
  const [lng, setLng] = useState(150.644);
  const [address, setAddress] = useState(myAddress)
  const [geometry, setGeometry] = useState(null); 

  const libraries = useMemo(() => ['places'], ['geocoding']);
  const mapCenter = useMemo(() => ({ lat: lat, lng: lng }), [lat, lng ]); 
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }
  
  
    if(myAddress) {
      getGeocode({ address: myAddress }).then((results) => {
        const { lat, lng } = getLatLng(results[0]);
        setGeometry(results[0].geometry.location);
        setLat(lat);
        setLng(lng);
      });
    }
    

  return (
    <div className={styles.homeWrapper}>
      <GoogleMap
        options={mapOptions}
        zoom={15}
        center={geometry}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width:  mapWidth ?? '300px' , height: mapHeight ?? '300px' }}
        onLoad={(map) => console.log('Map Loaded')}
      >
        <MarkerF
          position={mapCenter}
          title={address}
          onLoad={() => console.log('Marker Loaded')}
        />
 
      </GoogleMap>
    </div>
  );
}; 

export default MapContainer;