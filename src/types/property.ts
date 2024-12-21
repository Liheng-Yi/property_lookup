export interface PropertyInfo {
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