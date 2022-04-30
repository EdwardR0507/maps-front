import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { useMapBox } from "./useMapBox";

const entryPoint = {
  lng: -82.994,
  lat: -13.0628,
  zoom: 3,
};

export const useSocketMapbox = () => {
  const { socket } = useContext(SocketContext);
  const { addMarker, coords, moveMarker$, newMarker$, setRef, updateMarker } =
    useMapBox(entryPoint);

  // Listen for existing markers
  useEffect(() => {
    socket.on("active-markers", (markers) => {
      for (const key of Object.keys(markers)) {
        addMarker(markers[key], key);
      }
    });
  }, [addMarker, socket]);

  // New Marker
  useEffect(() => {
    newMarker$.subscribe((marker) => {
      socket.emit("new-marker", marker);
    });
  }, [newMarker$, socket]);

  // Marker movement
  useEffect(() => {
    moveMarker$.subscribe((marker) => {
      socket.emit("update-marker", marker);
    });
  }, [moveMarker$, socket]);

  // Move the marker with sockets
  useEffect(() => {
    socket.on("update-marker", (marker) => {
      updateMarker(marker);
    });
  }, [updateMarker, socket]);

  // Listen for new markers
  useEffect(() => {
    socket.on("new-marker", (marker) => {
      addMarker(marker, marker.id);
    });
  }, [addMarker, socket]);

  return {
    coords,
    setRef,
  };
};
