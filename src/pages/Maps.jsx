import { useEffect } from "react";
import { useMapBox } from "../hooks/useMapBox";

const entryPoint = {
  lng: -82.994,
  lat: -13.0628,
  zoom: 3,
};

const Maps = () => {
  const { coords, moveMarker$, newMarker$, setRef } = useMapBox(entryPoint);
  useEffect(() => {
    newMarker$.subscribe((marker) => {
      console.log(marker);
    });
  }, [newMarker$]);

  useEffect(() => {
    moveMarker$.subscribe((marker) => {
      console.log(marker);
    });
  }, [moveMarker$]);

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
