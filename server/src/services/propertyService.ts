interface PropertyDetails {
  overview: string;
  details: {
    size: number;
    bedrooms: number;
    bathrooms: number;
    estimatedValue: number;
    yearBuilt?: number;
  };
}

interface School {
  name: string;
  distance: number;
  rating: number;
  type: 'Elementary' | 'Middle' | 'High';
  address: string;
}

interface PropertySearchResult {
  address: string;
  propertyDetails: PropertyDetails;
  nearbySchools: School[];
}

export async function getMockPropertyData(address: string): Promise<PropertySearchResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    address,
    propertyDetails: {
      overview: "Beautiful modern home in a quiet neighborhood. Recently renovated with high-end finishes and appliances. Features an open concept living area, updated kitchen, and spacious backyard.",
      details: {
        size: 2500,
        bedrooms: 4,
        bathrooms: 2.5,
        estimatedValue: 750000,
        yearBuilt: 1995
      }
    },
    nearbySchools: [
      {
        name: "Washington Elementary",
        distance: 0.5,
        rating: 8.5,
        type: "Elementary",
        address: "123 School St"
      },
      {
        name: "Lincoln Middle School",
        distance: 1.2,
        rating: 7.8,
        type: "Middle",
        address: "456 Education Ave"
      },
      {
        name: "Roosevelt High",
        distance: 2.1,
        rating: 8.2,
        type: "High",
        address: "789 Learning Blvd"
      }
    ]
  };
} 