import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_GIPHY_ACCESS_TOKEN;

const entryPoint = {
  lng: -122.4194,
  lat: 37.7749,
  zoom: 3,
};

const Maps = () => {
  const mapRef = useRef();
  const [map, setMap] = useState();
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [entryPoint.lng, entryPoint.lat],
      zoom: entryPoint.zoom,
    });
    setMap(map);
  }, []);
  return (
    <>
      <div ref={mapRef} className="mapContainer"></div>
    </>
  );
};
export default Maps;
