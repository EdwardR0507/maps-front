import { useCallback, useEffect, useRef, useState, useId } from "react";
import mapboxgl from "mapbox-gl";
import { v4 } from "uuid";

mapboxgl.accessToken = import.meta.env.VITE_GIPHY_ACCESS_TOKEN;

export const useMapBox = (entryPoint) => {
  const mapDiv = useRef();

  // Reference to the div that will hold the map
  const setRef = useCallback((node) => {
    mapDiv.current = node;
  }, []);

  // Using useRef to store the map instance
  const mapRef = useRef();

  const markerRef = useRef({});

  const [coords, setCoords] = useState(entryPoint);

  // Initialize the map
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

  // Add marker on click
  useEffect(() => {
    mapRef.current?.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      const marker = new mapboxgl.Marker();
      marker.id = v4();
      marker.setLngLat([lng, lat]);
      marker.addTo(mapRef.current);
      marker.setDraggable(true);
      markerRef.current[marker.id] = marker;
    });
  }, [mapRef]);

  return {
    coords,
    setRef,
  };
};
