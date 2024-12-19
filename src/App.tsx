import { APIProvider } from '@vis.gl/react-google-maps';
import './App.css';
import AddressAutocomplete from './components/AddressAutocomplete';

function App() {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="app-container">
        <header className="app-header">
          <h1>Property Search</h1>
          <p>Enter an address to get detailed property information and nearby schools</p>
        </header>
        <AddressAutocomplete />
      </div>
    </APIProvider>
  );
}

export default App;
