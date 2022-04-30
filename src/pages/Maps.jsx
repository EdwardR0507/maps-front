import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { useMapBox } from "../hooks/useMapBox";

const entryPoint = {
  lng: -82.994,
  lat: -13.0628,
  zoom: 3,
};

const Maps = () => {
  const { addMarker, coords, moveMarker$, newMarker$, setRef, updateMarker } =
    useMapBox(entryPoint);

  const { socket } = useContext(SocketContext);

  // Listen for existing markers
  useEffect(() => {
    socket.on("active-markers", (markers) => {
      for (const key of Object.keys(markers)) {
        addMarker(markers[key], key);
      }
    });
  }, [addMarker, socket]);

  useEffect(() => {
    newMarker$.subscribe((marker) => {
      socket.emit("new-marker", marker);
    });
  }, [newMarker$, socket]);

  useEffect(() => {
    moveMarker$.subscribe((marker) => {
      socket.emit("update-marker", marker);
    });
  }, [moveMarker$, socket]);

  useEffect(() => {
    socket.on("update-marker", (marker) => {
      updateMarker(marker);
    });
  }, [updateMarker, socket]);

  useEffect(() => {
    socket.on("new-marker", (marker) => {
      addMarker(marker);
    });
  }, [addMarker, socket]);

  return (
    <>
      <div className="info">
        Lng: {coords.lng} | Lat: {coords.lat} | Zoom: {coords.zoom}
      </div>
      <div ref={setRef} className="mapContainer"></div>
    </>
  );
};
export default Maps;
