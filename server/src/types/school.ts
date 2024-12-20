export interface Location {
  latitude: number;
  longitude: number;
}

export interface School {
  name: string;
  distance: number;
  rating: number | null;
  type: 'Elementary' | 'Middle' | 'High' | null;
  address: string;
} 