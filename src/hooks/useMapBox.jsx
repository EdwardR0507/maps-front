import { useCallback, useEffect, useRef, useState, useId } from "react";
import mapboxgl from "mapbox-gl";
import { v4 } from "uuid";
import { Subject } from "rxjs";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export const useMapBox = (entryPoint) => {
  const mapDiv = useRef();

  // Reference to the div that will hold the map
  const setRef = useCallback((node) => {
    mapDiv.current = node;
  }, []);

  // Using useRef to store the map instance
  const mapRef = useRef();

  const markerRef = useRef({});

  // Observables
  const moveMarker = useRef(new Subject());
  const newMarker = useRef(new Subject());

  const [coords, setCoords] = useState(entryPoint);

  // Add Marker
  const addMarker = useCallback((e, id) => {
    const { lng, lat } = e.lngLat || e;
    const marker = new mapboxgl.Marker();
    marker.id = id ?? v4();
    marker.setLngLat([lng, lat]);
    marker.addTo(mapRef.current);
    marker.setDraggable(true);
    markerRef.current[marker.id] = marker;

    // Add Marker to Observable if it doesn't exist
    if (!id) {
      newMarker.current.next({
        id: marker.id,
        lng,
        lat,
      });
    }

    // Listen for marker drag events
    marker.on("drag", ({ target }) => {
      const { id } = target;
      const { lng, lat } = target.getLngLat();
      // Update marker position
      moveMarker.current.next({
        id,
        lng,
        lat,
      });
    });
  }, []);

  // Update the position of a marker
  const updateMarker = useCallback(({ id, lng, lat }) => {
    const marker = markerRef.current[id];
    marker.setLngLat([lng, lat]);
  }, []);

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
    mapRef.current?.on("click", (e) => addMarker(e));
  }, [mapRef, addMarker]);

  return {
    addMarker,
    coords,
    moveMarker$: moveMarker.current,
    newMarker$: newMarker.current,
    setRef,
    updateMarker,
  };
};
