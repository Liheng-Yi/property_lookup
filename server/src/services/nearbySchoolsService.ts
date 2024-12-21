import { Client } from '@googlemaps/google-maps-services-js';
import { Location, School } from '../types/school';
import { calculateDistance } from '../utils/distance';

const client = new Client({});

export async function getNearbySchools(location: Location): Promise<School[]> {
  console.log('Starting getNearbySchools with location:', location);
  
  try {
    const response = await client.placesNearby({
      params: {
        location: { lat: location.latitude, lng: location.longitude },
        radius: 3000, // 5km radius
        type: 'school',
        key: process.env.GOOGLE_MAPS_API_KEY || ''
      }
    });

    console.log('Places API response status:', response.data.status);

    if (response.data.status === 'OK' && response.data.results) {
      const schools: School[] = response.data.results
        .filter(place => isSchool(place) && place.geometry?.location)
        .map(place => {
          console.log('Processing school:', place.name);
          const distance = calculateDistance(
            location.latitude,
            location.longitude,
            place.geometry!.location.lat,
            place.geometry!.location.lng
          );

          return {
            name: place.name || 'Unknown School',
            distance: Number(distance.toFixed(1)),
            rating: place.rating || null,
            type: determineSchoolType(place),
            address: place.vicinity || ''
          };
        })
        .filter(school => school.type !== null);

      console.log('Processed schools:', schools);
      return schools
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5); // Only return top 5 schools
    }

    return [];
  } catch (error) {
    console.error('Error in getNearbySchools:', error);
    throw error;
  }
}

function isSchool(place: any): boolean {
  return place.types?.includes('school') || 
         place.types?.includes('primary_school') ||
         place.types?.includes('secondary_school') || 
         false;
}

function determineSchoolType(place: any): 'Elementary' | 'Middle' | 'High' | null {
  const types = place.types || [];
  const name = (place.name || '').toLowerCase();
  
  // Check Google Places types first
  if (types.includes('primary_school')) {
    return 'Elementary';
  }
  if (types.includes('secondary_school')) {
    return 'High';
  }
  
  // Fall back to name-based detection
  if (name.includes('elementary') || name.includes('primary')) {
    return 'Elementary';
  }
  if (name.includes('middle')) {
    return 'Middle';
  }
  if (name.includes('high') || name.includes('secondary')) {
    return 'High';
  }

  return null;
} 