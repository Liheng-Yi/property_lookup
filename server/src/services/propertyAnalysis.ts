import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

interface PropertyData {
    combinedData: any;
    nearbySchools: any;
}

export async function analyzePropertyData(propertyData: PropertyData) {
    const systemPrompt = `Analyze the following property data and nearby schools and return a JSON response with the following structure. Here are two examples of the expected format:

Example 1:
{
    "overview": "Welcome to this stunning modern masterpiece in the heart of Silicon Valley! This meticulously maintained 4-bedroom home offers the perfect blend of luxury and comfort. Featuring an open-concept layout, soaring ceilings, and abundant natural light, this property is ideal for both entertaining and everyday living. The gourmet kitchen boasts high-end stainless steel appliances and quartz countertops. Located in the prestigious Cupertino School District, this home is just minutes from major tech campuses and premium shopping destinations.",
    "propertyDetails": {
        "size": 2800,
        "bedrooms": 4,
        "bathrooms": 3,
        "estimatedValue": 2450000,
        "yearBuilt": 2015,
        "propertyType": "Single Family Home",
        "lotSize": 6000
    },
    "nearbySchools": [
        {
            "name": "Cupertino High",
            "type": "High",
            "distance": 0.8,
            "rating": 9,
            "address": "10100 Finch Avenue, Cupertino"
        }
    ]
}

Example 2:
{
    "overview": "Discover urban living at its finest in this luxurious downtown penthouse! Perched on the 20th floor, this sophisticated 2-bedroom residence offers breathtaking city views through floor-to-ceiling windows. The chef's kitchen features premium Viking appliances and Italian cabinetry. Building amenities include 24/7 concierge, rooftop pool, and state-of-the-art fitness center. Walking distance to world-class restaurants, theaters, and public transit. A perfect blend of luxury, convenience, and style in the city's most desirable location.",
    "propertyDetails": {
        "size": 1850,
        "bedrooms": 2,
        "bathrooms": 2.5,
        "estimatedValue": 1850000,
        "yearBuilt": 2019,
        "propertyType": "Condo",
        "lotSize": 0
    },
    "nearbySchools": [
        {
            "name": "Downtown Elementary",
            "type": "Elementary",
            "distance": 0.3,
            "rating": 8,
            "address": "123 Main Street"
        }
    ]
}

Now analyze this property data and nearby schools and return a similar response:
${JSON.stringify({
    property: propertyData.combinedData,
    schools: propertyData.nearbySchools
}, null, 2)}`;


    const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
            {
                role: "system",
                content: "You are an experienced luxury real estate agent known for compelling property descriptions. Return only valid JSON that matches the specified structure."
            },
            {
                role: "user",
                content: systemPrompt
            }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" }
    });

    if (!completion.choices[0].message.content) {
        throw new Error('No content received from OpenAI');
    }

    return {
        analysis: JSON.parse(completion.choices[0].message.content),
        usage: completion.usage
    };
} 