import axios from 'axios';
import { PropertyInfo } from '../types/property';

export class PropertyService {
  private static BASE_URL = 'http://localhost:5000/api';  // We'll create this API later

  static async getPropertyInfo(address: string): Promise<PropertyInfo> {
    try {
      const response = await axios.get(`${this.BASE_URL}/property`, {
        params: { address }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching property information:', error);
      throw error;
    }
  }
} 