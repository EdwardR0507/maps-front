import { useMapBox } from "../hooks/useMapBox";

const entryPoint = {
  lng: -82.994,
  lat: -13.0628,
  zoom: 3,
};

const Maps = () => {
  const { coords, setRef } = useMapBox(entryPoint);
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
