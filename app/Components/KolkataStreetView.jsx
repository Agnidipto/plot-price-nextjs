'use client';

import { MapContainer, Marker, TileLayer, useMap, useMapEvents, Circle} from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as ELG from "esri-leaflet-geocoder";
import { useContext, useEffect, useState } from 'react';
import LocationContext from '../Context/LocationContext';
delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

const KolkataStreetView = () => {

  const {location, setLocation} = useContext(LocationContext)
  const [marker, setMarker] = useState([22.5726, 88.3639])

  function Geocoder({ address }) {
    const map = useMap();    

    ELG.geocode()
      .text(address)
      .run((err, results, response) => {
        console.log(results.results[0].latlng);
        const { lat, lng } = results.results[0].latlng;
        map.flyTo([lat, lng], 14);

        // const theMarker = L.marker([lat, lng])
        // theMarker.addTo(map)
        // .bindPopup(address).openPopup();
      });

    return null;
  }

  ////////////////////////////////////////
  useEffect(() => {
    ELG.geocode()
      .text(`${location} West Bengal`)
      .run((err, results, response) => {
        console.log(results.results[0].latlng);
        const { lat, lng } = results.results[0].latlng;
        setMarker([lat, lng])
      });
  }, [location])

  useEffect(() => {console.log('New marker', marker)}, [marker])

  return (
    <MapContainer center={[22.5726, 88.3639]} zoom={20} style={{ width: '100%', height: '100%'}}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
      />
      {/* <Marker position = {marker}/> */}
      {/* <Circle center={marker} pathOptions={{ fillColor: 'grey', color:'grey', fillOpacity:'0.1', opacity:'0.1' }} radius={5000} /> */}
      <Geocoder address={`${location} West Bengal`} />
    </MapContainer>
  )
}

export default KolkataStreetView