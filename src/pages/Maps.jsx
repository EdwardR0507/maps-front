import { useSocketMapbox } from "../hooks/useSocketMapbox";

const Maps = () => {
  const { coords, setRef } = useSocketMapbox();
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
