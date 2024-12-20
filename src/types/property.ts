export interface PropertyDetails {
  overview: string;
  details: {
    size: number;
    bedrooms: number;
    bathrooms: number;
    estimatedValue: number;
    yearBuilt?: number;
  };
}

export interface School {
  name: string;
  distance: number;
  rating: number;
  type: 'Elementary' | 'Middle' | 'High';
  address: string;
}

export interface PropertySearchResult {
  address: string;
  propertyDetails: PropertyDetails;
  nearbySchools: School[];
} 