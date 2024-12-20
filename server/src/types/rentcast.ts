export interface RentcastPropertyResponse {
    id: string;
    address: {
        line1: string;
        line2: string | null;
        city: string;
        state: string;
        zipCode: string;
        formattedAddress: string;
    };
    location: {
        latitude: number;
        longitude: number;
    };
    physical: {
        bedrooms: number;
        bathrooms: number;
        squareFootage: number;
        yearBuilt: number;
        lotSize: number;
    };
    market: {
        estimatedValue: number;
        rentEstimate: {
            average: number;
            low: number;
            high: number;
        };
        lastSalePrice?: number;
        lastSaleDate?: string;
    };
    propertyType: string;
    lastSeen: string;
    listedDate?: string;
    status: string;
} 