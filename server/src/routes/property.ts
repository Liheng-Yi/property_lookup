import express from 'express';
import { getMockPropertyData } from '../services/propertyService';
import { scrapeZillowData, cleanSearchQuery } from '../services/scrapingService';
import { RentcastPropertyResponse } from '../types/rentcast';
import { analyzePropertyData } from '../services/propertyAnalysis';
import * as fs from 'fs/promises';
import * as path from 'path';
import { getNearbySchools } from '../services/nearbySchoolsService';

const router = express.Router();

// In your route handler:
router.get('/', async (req, res) => {
    const { address } = req.query;
    
    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }

    try {
        // Fetch property details
        const propertyResponse = await fetch(
            `https://api.rentcast.io/v1/properties?address=${encodeURIComponent(address as string)}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'X-Api-Key': process.env.RENTCAST_API_KEY || ''
                }
            }
        );

        // Fetch property value estimate
        const valueResponse = await fetch(
            `https://api.rentcast.io/v1/avm/value?address=${encodeURIComponent(address as string)}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'X-Api-Key': process.env.RENTCAST_API_KEY || ''
                }
            }
        );

        if (!propertyResponse.ok || !valueResponse.ok) {
            throw new Error(`API request failed with status ${propertyResponse.status} or ${valueResponse.status}`);
        }

        const propertyData: RentcastPropertyResponse = await propertyResponse.json();
        const valueData = await valueResponse.json();

        const { comparables, ...valueDataWithoutComparables } = valueData;

        // Combine the property and value data
        const combinedData = {
            ...propertyData,
            ...valueDataWithoutComparables
        };

        const nearbySchools = await getNearbySchools({
            latitude: combinedData.latitude,
            longitude: combinedData.longitude
        });

        // Analyze the property data using OpenAI
        const analysisResult = await analyzePropertyData({
            combinedData,
            nearbySchools
        });

        // Combine all the data and send the response
        res.json({analysis: analysisResult.analysis});
        
    } catch (error: any) {
        console.error('Error fetching property data:', error);
        res.status(500).json({ 
            error: 'Failed to fetch property data',
            details: error.message 
        });
    }
});

router.post('/clean-search', (req, res) => {
    const { searchQuery } = req.body;
    if (!searchQuery) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    const cleanedQuery = cleanSearchQuery(searchQuery);
    res.json({ cleanedQuery });
});

router.get('/mock/:address', async (req, res) => {
    try {
        const data = await getMockPropertyData(req.params.address);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch property data' });
    }
});

export default router; 