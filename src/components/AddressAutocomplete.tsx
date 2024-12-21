import { useState, useRef, useEffect } from 'react';
import { PropertyService } from '../services/propertyService';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import './style.css';

interface PropertyInfo {
  analysis: {
    overview: string;
    propertyDetails: {
      size: number;
      bedrooms: number;
      bathrooms: number;
      estimatedValue: number;
      yearBuilt: number;
      propertyType: string;
      lotSize: number;
    };
    nearbySchools: Array<{
      name: string;
      type: string;
      distance: number;
      rating: number;
      address: string;
    }>;
  };
}

const AddressAutocomplete = () => {
  const [address, setAddress] = useState('');
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
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
    });
  }, [placeAutocomplete]);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) {
      setError('Please select a valid address');
      return;
    }
    setAddress(place.formatted_address || '');
    handleSearch();
  };

  const handleSearch = async () => {
    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await PropertyService.getPropertyInfo(address);
      setPropertyInfo(result);
    } catch (err) {
      setError('Failed to fetch property information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-search">
      <div className="search-container">
        <input
          ref={inputRef}
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter a property address..."
          className="address-input"
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? (
            <>
              Searching
              <span className="loading-spinner" />
            </>
          ) : (
            'Search'
          )}
        </button>
      </div>

      {propertyInfo && (
        <div className="results">
          <h2>Property Information</h2>
          
          <div className="section">
            <h3>Overview</h3>
            <p>{propertyInfo.analysis.overview}</p>
          </div>

          <div className="section">
            <h3>Property Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Property Type</label>
                <span>{propertyInfo.analysis.propertyDetails.propertyType || 'Unknown'}</span>
              </div>
              <div className="detail-item">
                <label>Size</label>
                <span>{propertyInfo.analysis.propertyDetails.size ? `${propertyInfo.analysis.propertyDetails.size.toLocaleString()} sq ft` : 'Unknown'}</span>
              </div>
              <div className="detail-item">
                <label>Bedrooms</label>
                <span>{propertyInfo.analysis.propertyDetails.bedrooms ?? 'Unknown'}</span>
              </div>
              <div className="detail-item">
                <label>Bathrooms</label>
                <span>{propertyInfo.analysis.propertyDetails.bathrooms ?? 'Unknown'}</span>
              </div>
              <div className="detail-item">
                <label>Estimated Value</label>
                <span>{propertyInfo.analysis.propertyDetails.estimatedValue ? `$${propertyInfo.analysis.propertyDetails.estimatedValue.toLocaleString()}` : 'Unknown'}</span>
              </div>
              <div className="detail-item">
                <label>Year Built</label>
                <span>{propertyInfo.analysis.propertyDetails.yearBuilt ?? 'Unknown'}</span>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Nearby Schools</h3>
            <div className="schools-grid">
              {propertyInfo.analysis.nearbySchools.map((school, index) => (
                <div key={index} className="school-item">
                  <h4>{school.name || 'Unknown'}</h4>
                  <div className="school-info">
                    <p>Distance: {school.distance ? `${school.distance} miles` : 'Unknown'}</p>
                    <p>Rating: {school.rating ? `${school.rating}/10` : 'Unknown'}</p>
                    <p>Type: {school.type || 'Unknown'}</p>
                    <p>Address: {school.address || 'Unknown'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete; 