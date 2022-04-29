import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_GIPHY_ACCESS_TOKEN;

export const useMapBox = (entryPoint) => {
  const mapDiv = useRef();

  // Reference to the div that will hold the map
  const setRef = useCallback((node) => {
    mapDiv.current = node;
  }, []);

  // Using useRef to store the map instance
  const mapRef = useRef();

  const [coords, setCoords] = useState(entryPoint);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapDiv.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [entryPoint.lng, entryPoint.lat],
      zoom: entryPoint.zoom,
    });
    mapRef.current = map;
  }, []);

  useEffect(() => {
    // if map is loaded
    mapRef.current?.on("move", () => {
      setCoords({
        lng: mapRef.current.getCenter().lng.toFixed(4),
        lat: mapRef.current.getCenter().lat.toFixed(4),
        zoom: mapRef.current.getZoom().toFixed(2),
      });
    });
    // remove event listener on unmount to prevent memory leaks
    return () => mapRef.current?.off("move");
  }, [mapRef]);

  return {
    coords,
    setRef,
  };
};
