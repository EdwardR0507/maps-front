import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { useMapBox } from "../hooks/useMapBox";

const entryPoint = {
  lng: -82.994,
  lat: -13.0628,
  zoom: 3,
};

const Maps = () => {
  const { addMarker, coords, moveMarker$, newMarker$, setRef } =
    useMapBox(entryPoint);

  const { socket } = useContext(SocketContext);

  // Listen for existing markers
  useEffect(() => {
    socket.on("active-markers", (markers) => {
      for (const key of Object.keys(markers)) {
        addMarker(markers[key], key);
      }
    });
  });

  useEffect(() => {
    newMarker$.subscribe((marker) => {
      socket.emit("new-marker", marker);
    });
  }, [newMarker$, socket]);

  useEffect(() => {
    moveMarker$.subscribe((marker) => {
      console.log(marker);
    });
  }, [moveMarker$]);

  useEffect(() => {
    socket.on("new-marker", (marker) => {
      console.log("new:", marker);
    });
  }, [socket]);

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
