import express from 'express';
import { getMockPropertyData } from '../services/propertyService';
import { scrapeZillowData, cleanSearchQuery } from '../services/scrapingService';
import { RentcastPropertyResponse } from '../types/rentcast';

const router = express.Router();

// In your route handler:
router.get('/', async (req, res) => {
    console.log('Received request query:', req.query);
    const { address } = req.query;
    
    console.log('Extracted address:', address);
    console.log('Request headers:', req.headers);
    
    if (!address) {
        console.log('address is falsy:', { address });
        return res.status(400).json({ error: 'Address is required' });
    }

    try {
        const response = await fetch(
            `https://api.rentcast.io/v1/properties?address=${encodeURIComponent(address as string)}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Api-Key': process.env.RENTCAST_API_KEY || ''
                }
            }
        );
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data: RentcastPropertyResponse = await response.json();
        res.json(data);
        
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