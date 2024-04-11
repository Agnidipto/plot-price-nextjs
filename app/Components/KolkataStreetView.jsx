'use client';

import { MapContainer, Marker, TileLayer, useMap, useMapEvents, Circle} from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as ELG from "esri-leaflet-geocoder";
import { useContext, useEffect, useState } from 'react';
import LocationContext from '../Context/LocationContext';
delete L.Icon.Default.prototype._getIconUrl;

const KolkataStreetView = () => {

  const {location, setLocation} = useContext(LocationContext)
  const [marker, setMarker] = useState([22.5726, 88.3639])

  function Geocoder({ address }) {
    const map = useMap();    

    ELG.geocode()
      .text(address)
      .run((err, results, response) => {
        const { lat, lng } = results.results[0].latlng;
        map.flyTo([lat, lng], 14);

        // const theMarker = L.marker([lat, lng])
        // theMarker.addTo(map)
        // .bindPopup(address).openPopup();
      });

    return null;
  }

  //////////////////////////////////////
  useEffect(() => {
    ELG.geocode()
      .text(`${location} West Bengal`)
      .run((err, results, response) => {
        // console.log(results.results[0].latlng);
        const { lat, lng } = results.results[0].latlng;
        setMarker([lat, lng])
      });
  }, [location])

  return (
    <MapContainer center={[22.5726, 88.3639]} zoom={20} style={{ width: '100%', height: '100%'}}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
      />
      <Geocoder address={`${location} West Bengal`} />
    </MapContainer>
  )
}

export default KolkataStreetView