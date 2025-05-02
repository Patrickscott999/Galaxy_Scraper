import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { auth } from '@/lib/firebase';

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Helper function to verify user subscription tier and enforce limits
async function verifyUserAccess(userId: string, dataType: string) {
  if (!userId) {
    return { allowed: false, error: 'User ID is required' };
  }

  // In a production app, you would fetch the user's subscription from your database
  // For now, we'll use localStorage simulation from the client side
  
  // Default to basic tier if we can't determine the subscription
  const userTier = 'basic';

  // Define tier limits
  const tierLimits = {
    basic: {
      requestsPerDay: 5,
      dataPointsPerRequest: 10,
      aiAnalysis: false,
      dataTypes: ['jobs', 'prices']
    },
    pro: {
      requestsPerDay: 20,
      dataPointsPerRequest: 50,
      aiAnalysis: true,
      dataTypes: ['jobs', 'prices', 'news']
    },
    enterprise: {
      requestsPerDay: 100,
      dataPointsPerRequest: 200,
      aiAnalysis: true,
      dataTypes: ['jobs', 'prices', 'news', 'real_estate']
    }
  };

  // Check if the data type is allowed for this tier
  const limits = tierLimits[userTier as keyof typeof tierLimits];
  if (!limits.dataTypes.includes(dataType.toLowerCase())) {
    return {
      allowed: false,
      error: `Your ${userTier} tier doesn't have access to ${dataType} data. Please upgrade your subscription.`
    };
  }

  // In a real app, you would check the user's request count against their daily limit
  
  return { allowed: true, limits };
}

// Function to scrape data from a website
async function scrapeWebsite(url: string, dataType: string) {
  try {
    // Fetch the HTML content of the website
    const response = await axios.get(url);
    const html = response.data;
    
    // Use cheerio to parse the HTML
    const $ = cheerio.load(html);
    
    // Extract relevant data based on the data type
    let extractedData: any[] = [];
    
    switch(dataType.toLowerCase()) {
      case 'jobs':
        // This is a simplified example, actual selectors would depend on the target website
        $('div.job-listing').each((index, element) => {
          if (index < 10) { // Limit to 10 items for demonstration
            extractedData.push({
              title: $(element).find('.job-title').text().trim(),
              company: $(element).find('.company-name').text().trim(),
              location: $(element).find('.location').text().trim(),
              salary: $(element).find('.salary').text().trim(),
              description: $(element).find('.description').text().trim(),
            });
          }
        });
        break;
        
      case 'prices':
        $('div.product').each((index, element) => {
          if (index < 10) {
            extractedData.push({
              product: $(element).find('.product-name').text().trim(),
              price: $(element).find('.price').text().trim(),
              store: $(element).find('.store-name').text().trim(),
              availability: $(element).find('.availability').text().trim(),
            });
          }
        });
        break;
        
      case 'news':
        $('article.news-item').each((index, element) => {
          if (index < 10) {
            extractedData.push({
              title: $(element).find('.headline').text().trim(),
              source: $(element).find('.source').text().trim(),
              date: $(element).find('.date').text().trim(),
              summary: $(element).find('.summary').text().trim(),
            });
          }
        });
        break;
        
      case 'real_estate':
        $('div.property').each((index, element) => {
          if (index < 10) {
            extractedData.push({
              address: $(element).find('.address').text().trim(),
              price: $(element).find('.price').text().trim(),
              bedrooms: $(element).find('.bedrooms').text().trim(),
              bathrooms: $(element).find('.bathrooms').text().trim(),
              sqft: $(element).find('.sqft').text().trim(),
            });
          }
        });
        break;
        
      default:
        throw new Error(`Unsupported data type: ${dataType}`);
    }

    // If no data was extracted with specific selectors, use AI to extract structured data
    if (extractedData.length === 0) {
      extractedData = await extractDataWithAI(html, dataType);
    }
    
    return extractedData;
  } catch (error) {
    console.error('Error scraping website:', error);
    throw error;
  }
}

// Function to extract data using OpenAI
async function extractDataWithAI(html: string, dataType: string) {
  try {
    // Simplify HTML to reduce token usage
    const simplifiedHtml = simplifyHtml(html);
    
    // Define the expected structure based on the data type
    let structure = '';
    switch(dataType.toLowerCase()) {
      case 'jobs':
        structure = '{ title: string, company: string, location: string, salary: string, description: string }';
        break;
      case 'prices':
        structure = '{ product: string, price: string, store: string, availability: string }';
        break;
      case 'news':
        structure = '{ title: string, source: string, date: string, summary: string }';
        break;
      case 'real_estate':
        structure = '{ address: string, price: string, bedrooms: string, bathrooms: string, sqft: string }';
        break;
      default:
        structure = '{ [key: string]: string }';
    }
    
    // Use OpenAI to extract structured data
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are a web scraping assistant. Extract structured data from the provided HTML. 
                   Return ONLY a valid JSON array of objects with the following structure: ${structure}.
                   Do not include any explanations or markdown formatting, only the raw JSON array.`
        },
        {
          role: "user",
          content: `Extract ${dataType} data from the following HTML: ${simplifiedHtml}`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the response from OpenAI
    const content = response.choices[0]?.message?.content || '{"results": []}';
    const parsedContent = JSON.parse(content);
    return parsedContent.results || [];
  } catch (error) {
    console.error('Error extracting data with AI:', error);
    // Return empty array as fallback
    return [];
  }
}

// Function to simplify HTML to reduce token usage
function simplifyHtml(html: string) {
  const $ = cheerio.load(html);
  
  // Remove scripts, styles, and comments
  $('script, style, comment').remove();
  
  // Extract only the main content
  let mainContent = $('main').html() || $('article').html() || $('body').html() || '';
  
  // Truncate if too long
  if (mainContent.length > 10000) {
    mainContent = mainContent.substring(0, 10000);
  }
  
  return mainContent;
}

// Analyze the scraped data using OpenAI
async function analyzeDataWithAI(data: any[], dataType: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a data analysis assistant. Analyze the provided data and provide insights."
        },
        {
          role: "user",
          content: `Analyze this ${dataType} data and provide 3-5 key insights: ${JSON.stringify(data)}`
        }
      ]
    });
    
    return response.choices[0]?.message?.content || "No insights available.";
  } catch (error) {
    console.error('Error analyzing data with AI:', error);
    return "Error generating insights.";
  }
}

// Main API route handler
export async function POST(request: Request) {
  try {
    const { url, dataType, userId } = await request.json();
    
    // Validate request
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    
    if (!dataType) {
      return NextResponse.json({ error: 'Data type is required' }, { status: 400 });
    }
    
    // Verify user access based on their subscription tier
    const accessCheck = await verifyUserAccess(userId, dataType);
    if (!accessCheck.allowed) {
      return NextResponse.json({ error: accessCheck.error }, { status: 403 });
    }
    
    // Scrape the website
    const scrapedData = await scrapeWebsite(url, dataType);
    
    // Apply tier-based limits to the data
    const tierLimits = accessCheck.limits || {
      dataPointsPerRequest: 10,
      aiAnalysis: false
    };
    const limitedData = scrapedData.slice(0, tierLimits.dataPointsPerRequest);
    
    // Generate AI analysis if the user's tier allows it
    let analysis = null;
    if (tierLimits.aiAnalysis && limitedData.length > 0) {
      analysis = await analyzeDataWithAI(limitedData, dataType);
    }
    
    // Return the scraped data and analysis
    return NextResponse.json({
      success: true,
      data: limitedData,
      analysis,
      tierInfo: {
        tier: 'basic', // This would be the actual user tier in production
        limits: tierLimits
      }
    });
  } catch (error) {
    console.error('Error in scrape API:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
