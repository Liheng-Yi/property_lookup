import { useState } from 'react'
import { APIProvider } from '@vis.gl/react-google-maps';
import './App.css'
import AddressAutocomplete from './compoents/AddressAutocomplete'

function App() {
  console.log('Google Maps API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

  return (
    <>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <div>
          <h1>Property Search</h1>
          <AddressAutocomplete />
        </div>
      </APIProvider>
    </>
  )
}

export default App
