import React, { useState, useRef, useEffect } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface AddressAutocompleteProps {
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  onLocationError?: (error: string) => void;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onPlaceSelect,
  onLocationError
}) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [address, setAddress] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'formatted_address'],
      types: ['address'],
      componentRestrictions: { country: 'us' }
    };
    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;
    placeAutocomplete.addListener('place_changed', () => {
      const place = placeAutocomplete.getPlace();
      handlePlaceSelect(place);
      setSelectedPlace(place);
    });
  }, [placeAutocomplete]);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) {
      const error = 'Please select a valid address';
      setLocationError(error);
      onLocationError?.(error);
      return;
    }

    const lat: number = typeof place.geometry.location.lat === 'function' 
      ? place.geometry.location.lat() 
      : Number(place.geometry.location.lat);
    
    const lng: number = typeof place.geometry.location.lng === 'function' 
      ? place.geometry.location.lng() 
      : Number(place.geometry.location.lng);

    setAddress(place.formatted_address || '');
    onPlaceSelect?.(place);
    setLocationError(null);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  return (
    <div>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter address"
          ref={inputRef}
          value={address}
          onChange={handleAddressChange}
        />
      </div>
      {locationError && (
        <div className="text-danger small mt-1">{locationError}</div>
      )}
    </div>
  );
};

export default AddressAutocomplete; 