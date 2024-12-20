import * as puppeteer from 'puppeteer';

// Helper function to generate random delay between actions
function getRandomDelay(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Helper function to simulate human-like typing
async function humanTypeText(page: puppeteer.Page, selector: string, text: string) {
    await page.focus(selector);
    
    for (const char of text) {
        await page.keyboard.type(char, {
            delay: getRandomDelay(50, 150) // Random delay between keystrokes
        });
        
        // Occasionally pause while typing (10% chance)
        if (Math.random() < 0.1) {
            await new Promise(resolve => setTimeout(resolve, getRandomDelay(200, 500)));
        }
    }
}

export async function scrapeZillowData(searchQuery: string): Promise<string> {
    console.log('Starting scraping process for query:', searchQuery);
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        userDataDir: './temp-browser-data',
        handleSIGINT: true,
        handleSIGTERM: true,
        handleSIGHUP: true
    });
    let page;
    console.log('Browser launched successfully');

    try {
        page = await browser.newPage();
        console.log('New page created');

        // Set a realistic viewport size
        await page.setViewport({
            width: 1920,
            height: 1080
        });

        // Add random delay before navigation
        await new Promise(resolve => setTimeout(resolve, getRandomDelay(1000, 2000)));

        console.log('Navigating to Zillow.com...');
        await page.goto('https://www.zillow.com', {
            waitUntil: 'networkidle0'
        });
        console.log('Navigation complete');

        // Random delay after page load
        await new Promise(resolve => setTimeout(resolve, getRandomDelay(2000, 4000)));

        const initialContent = await page.content();
        console.log('Initial page HTML length:', initialContent.length);
        console.log('Current page URL:', await page.url());

        // Log available input elements
        const inputs = await page.$$eval('input', inputs => 
            inputs.map(input => ({
                id: input.id,
                type: input.type,
                placeholder: input.placeholder
            }))
        );
        console.log('Available input elements:', JSON.stringify(inputs, null, 2));

        console.log('Waiting for search input selector...');
        await page.waitForSelector('input[id="_c11n_oz16"]', {
            timeout: 30000,
            visible: true
        });
        console.log('Search input found');

        // Random delay before typing
        await new Promise(resolve => setTimeout(resolve, getRandomDelay(500, 1500)));

        console.log('Typing search query...');
        await humanTypeText(page, 'input[id="_c11n_oz16"]', searchQuery);
        console.log('Search query typed');

        // Random delay before pressing Enter
        await new Promise(resolve => setTimeout(resolve, getRandomDelay(800, 2000)));
        
        console.log('Pressing Enter...');
        await page.keyboard.press('Enter');
        console.log('Enter pressed');

        // Random delay before waiting for results
        await new Promise(resolve => setTimeout(resolve, getRandomDelay(1000, 2000)));

        console.log('Waiting for search results...');
        await page.waitForSelector('div[data-testid="search-page"]', {
            timeout: 10000
        });
        console.log('Search results loaded');

        // Final random delay before getting content
        await new Promise(resolve => setTimeout(resolve, getRandomDelay(1500, 3000)));

        const content = await page.content();
        console.log('Final page content length:', content.length);
        return content;

    } catch (error: unknown) {
        console.error('Detailed scraping error:', {
            message: (error as Error).message,
            name: (error as Error).name,
            stack: (error as Error).stack,
            url: await page?.url()
        });
        
        try {
            const errorPageContent = await page?.content();
            console.log('Page content at time of error (first 500 chars):', 
                errorPageContent?.substring(0, 500));
        } catch (contentError) {
            console.error('Could not get error page content:', contentError);
        }

        throw new Error(`Failed to fetch search results: ${(error as Error).message}`);
    } finally {
        try {
            if (page) {
                await page.close();
            }
            await browser.close();
            console.log('Browser closed');
        } catch (closeError) {
            console.error('Error while closing browser:', closeError);
        }
    }
}



export function cleanSearchQuery(searchQuery: string): string {
    return searchQuery
        .trim()
        .replace(/[^\w\s,]/g, '')
        .replace(/\s+/g, ' ');
} 