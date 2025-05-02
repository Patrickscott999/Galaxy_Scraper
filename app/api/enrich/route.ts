import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@/lib/firebase';

// Initialize OpenAI with the API key from environment variables
// Use server-side environment variable for security (not NEXT_PUBLIC_)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Common response format for enriched entities
interface EnrichedEntity {
  entity: string;
  type: string; // person, organization, location, etc.
  confidence: number;
  metadata?: Record<string, any>;
}

// Helper function to verify user subscription tier and enforce limits
async function verifyUserAccess(userId: string) {
  // For development and testing, allow access even without userId
  // In production, you would validate the Firebase token properly
  if (!userId && process.env.NODE_ENV === 'production') {
    return { allowed: false, error: 'User ID is required' };
  }

  // For testing purposes, always allow access to the API in development
  // In production, this would come from your database
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Get user tier from userId or use 'free' as fallback
  // In development, we'll check a hardcoded value for testing
  const userTier = isDevelopment ? 'enterprise' : 'free';

  // All tiers now have access, but with different limits
  // Define tier-specific limits
  const tierLimits: Record<string, { maxItemsPerRequest: number, allowedEnrichmentTypes: string[] }> = {
    'free': {
      maxItemsPerRequest: 5,  // Free tier can enrich 5 items
      allowedEnrichmentTypes: ['entities', 'sentiment'] // Limited options
    },
    'basic': {
      maxItemsPerRequest: 5,  // Basic tier can enrich 5 items
      allowedEnrichmentTypes: ['entities', 'sentiment'] // Limited options
    },
    'pro': {
      maxItemsPerRequest: 50, // Pro tier can enrich 50 items
      allowedEnrichmentTypes: ['entities', 'sentiment', 'categories', 'keywords']
    },
    'enterprise': {
      maxItemsPerRequest: Infinity, // Enterprise tier has unlimited items
      allowedEnrichmentTypes: ['entities', 'sentiment', 'categories', 'keywords', 'summaries', 'relations']
    }
  };

  // Return access with appropriate limits
  return {
    allowed: true,
    tier: userTier,
    limits: tierLimits[userTier] || tierLimits['free'] // Default to free tier limits if tier not found
  };
}

// Extract named entities using OpenAI
async function extractEntities(text: string): Promise<EnrichedEntity[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `Extract named entities from the text. Return a JSON array of objects with the following structure:
          { "entity": "entity name", "type": "type of entity", "confidence": 0.0-1.0 }
          
          Entity types include: person, organization, location, product, event, date, etc.
          Base confidence on how certain you are about the entity type.`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0]?.message?.content || '{"entities": []}';
    const parsedContent = JSON.parse(content);
    return parsedContent.entities || [];
  } catch (error) {
    console.error('Error extracting entities:', error);
    return [];
  }
}

// Categorize text content using OpenAI
async function categorizeContent(text: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `Categorize the following text. Return a JSON object with a "categories" property 
          that contains an array of category names. Provide 2-5 specific categories that best describe the content.`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0]?.message?.content || '{"categories": []}';
    const parsedContent = JSON.parse(content);
    return parsedContent.categories || [];
  } catch (error) {
    console.error('Error categorizing content:', error);
    return [];
  }
}

// Analyze sentiment of text content using OpenAI
async function analyzeSentiment(text: string): Promise<{ sentiment: string; score: number; aspects: Record<string, string> }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `Analyze the sentiment of the following text. Return a JSON object with:
          1. A "sentiment" property with value "positive", "negative", or "neutral"
          2. A "score" property with a number from -1.0 (very negative) to 1.0 (very positive)
          3. An "aspects" property with an object mapping key aspects to their sentiment`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0]?.message?.content || '{"sentiment": "neutral", "score": 0, "aspects": {}}';
    const parsedContent = JSON.parse(content);
    return {
      sentiment: parsedContent.sentiment || 'neutral',
      score: parsedContent.score || 0,
      aspects: parsedContent.aspects || {}
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return { sentiment: 'neutral', score: 0, aspects: {} };
  }
}

// Extract keywords using OpenAI
async function extractKeywords(text: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `Extract important keywords from the text. Return a JSON object with a "keywords" property 
          that contains an array of keywords. Focus on terms that are most representative of the main topics.`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0]?.message?.content || '{"keywords": []}';
    const parsedContent = JSON.parse(content);
    return parsedContent.keywords || [];
  } catch (error) {
    console.error('Error extracting keywords:', error);
    return [];
  }
}

// Generate a summary using OpenAI (enterprise tier feature)
async function generateSummary(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `Generate a concise summary of the following text in 2-3 sentences. 
          Focus on the main points and key information.`
        },
        {
          role: "user",
          content: text
        }
      ]
    });
    
    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating summary:', error);
    return '';
  }
}

// Identify relationships between entities (enterprise tier feature)
async function identifyRelations(text: string, entities: EnrichedEntity[]): Promise<Record<string, string[]>> {
  try {
    if (entities.length < 2) {
      return {};
    }
    
    const entityNames = entities.map(e => e.entity).join(', ');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `Identify relationships between the following entities found in the text: ${entityNames}.
          Return a JSON object where keys are entity names and values are arrays of strings describing 
          relationships to other entities. Only include relationships that are explicitly or strongly implied in the text.`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0]?.message?.content || '{}';
    const parsedContent = JSON.parse(content);
    return parsedContent;
  } catch (error) {
    console.error('Error identifying relations:', error);
    return {};
  }
}

// Main enrichment function
async function enrichData(data: any[], enrichmentTypes: string[], userTier: string): Promise<Record<string, any>> {
  // For each item in the data array, process it based on the enrichment types
  const results: Record<string, any> = {};
  
  // Convert object array to a single text block for processing
  const combineObjectsToText = (items: any[]): string => {
    return items.map(item => Object.entries(item)
      .map(([key, value]) => `${key}: ${value}`)
      .join('. ')
    ).join('\n\n');
  };
  
  const combinedText = combineObjectsToText(data);
  
  // Only process if we have text
  if (!combinedText) {
    return { error: 'No content to enrich' };
  }
  
  // Process each enrichment type in parallel for efficiency
  const enrichmentPromises: Promise<any>[] = [];
  
  if (enrichmentTypes.includes('entities')) {
    enrichmentPromises.push(
      extractEntities(combinedText).then(entities => {
        results.entities = entities;
      })
    );
  }
  
  if (enrichmentTypes.includes('categories')) {
    enrichmentPromises.push(
      categorizeContent(combinedText).then(categories => {
        results.categories = categories;
      })
    );
  }
  
  if (enrichmentTypes.includes('sentiment')) {
    enrichmentPromises.push(
      analyzeSentiment(combinedText).then(sentiment => {
        results.sentiment = sentiment;
      })
    );
  }
  
  if (enrichmentTypes.includes('keywords')) {
    enrichmentPromises.push(
      extractKeywords(combinedText).then(keywords => {
        results.keywords = keywords;
      })
    );
  }
  
  // Enterprise-only features
  if (userTier === 'enterprise') {
    if (enrichmentTypes.includes('summaries')) {
      enrichmentPromises.push(
        generateSummary(combinedText).then(summary => {
          results.summary = summary;
        })
      );
    }
    
    // Relations need entities, so we'll handle this after entities are processed
    if (enrichmentTypes.includes('relations') && enrichmentTypes.includes('entities')) {
      // We'll add this after all other promises are resolved
    }
  }
  
  // Wait for all enrichment processes to complete
  await Promise.all(enrichmentPromises);
  
  // Handle relations after entities are available (for enterprise tier)
  if (userTier === 'enterprise' && 
      enrichmentTypes.includes('relations') && 
      enrichmentTypes.includes('entities') && 
      results.entities) {
    results.relations = await identifyRelations(combinedText, results.entities);
  }
  
  return results;
}

// Main API route handler
export async function POST(request: Request) {
  try {
    const { data, userId = 'anonymous', enrichmentTypes = ['entities', 'sentiment', 'categories'] } = await request.json() as {
      data: any[];
      userId?: string;
      enrichmentTypes?: string[];
    };
    
    // Validate request
    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    
    // In development mode, skip authentication checks
    let accessCheck;
    if (process.env.NODE_ENV === 'development') {
      // For development, auto-approve with enterprise tier
      const tierLimits = await verifyUserAccess('dev-test-user');
      accessCheck = tierLimits;
    } else {
      // In production, check user access
      accessCheck = await verifyUserAccess(userId);
      if (!accessCheck.allowed) {
        return NextResponse.json({ error: accessCheck.error }, { status: 403 });
      }
    }
    
    // Apply tier limits
    const limits = accessCheck.limits || {
      maxItemsPerRequest: 10,
      allowedEnrichmentTypes: ['entities', 'sentiment', 'categories']
    };
    const limitedData = data.slice(0, limits.maxItemsPerRequest);
    
    // Filter requested enrichment types based on tier permissions
    const allowedEnrichmentTypes = enrichmentTypes.filter((type: string) => 
      limits.allowedEnrichmentTypes.includes(type)
    );
    
    // Perform the enrichment
    const enrichedData = await enrichData(limitedData, allowedEnrichmentTypes, accessCheck.tier || 'pro');
    
    // Return the enriched data
    return NextResponse.json({
      success: true,
      enriched: enrichedData,
      tierInfo: {
        tier: accessCheck.tier,
        limits: limits
      }
    });
  } catch (error) {
    console.error('Error in enrich API:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
