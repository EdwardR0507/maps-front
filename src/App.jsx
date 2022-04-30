import { SocketProvider } from "./context/SocketContext";
import Maps from "./pages/Maps";

function App() {
  return (
    <SocketProvider>
      <Maps />
    </SocketProvider>
  );
}

export default App;
