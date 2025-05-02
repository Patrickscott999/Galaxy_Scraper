/**
 * Sample data for each data type, organized by subscription tier
 * This helps showcase the differences between tiers to encourage upgrades
 */

export type DataTypeSample = {
  type: string;
  icon: string;
  description: string;
  tiers: {
    basic?: {
      available: boolean;
      sampleData: any[];
      limits: string[];
    };
    pro?: {
      available: boolean;
      sampleData: any[];
      limits: string[];
    };
    enterprise?: {
      available: boolean;
      sampleData: any[];
      limits: string[];
    };
  };
};

// Sample data for each type
export const dataTypeSamples: DataTypeSample[] = [
  {
    type: "jobs",
    icon: "briefcase",
    description: "Extract job listings from career sites, including titles, companies, and salaries.",
    tiers: {
      basic: {
        available: true,
        sampleData: [
          { title: "Software Engineer", company: "TechCorp", location: "San Francisco, CA", salary: "$120K-150K" },
          { title: "Product Manager", company: "StartupXYZ", location: "Remote", salary: "$90K-110K" },
        ],
        limits: ["Limited to 5 requests/day", "Maximum 10 results per request", "Basic fields only"]
      },
      pro: {
        available: true,
        sampleData: [
          { title: "Software Engineer", company: "TechCorp", location: "San Francisco, CA", salary: "$120K-150K", description: "Developing cloud-based solutions...", requirements: "5+ years experience in...", benefits: "Health insurance, 401k..." },
          { title: "Product Manager", company: "StartupXYZ", location: "Remote", salary: "$90K-110K", description: "Leading product development...", requirements: "3+ years experience in...", benefits: "Flexible schedule, equity..." },
          { title: "Data Scientist", company: "AI Innovations", location: "Boston, MA", salary: "$130K-160K", description: "Building machine learning models...", requirements: "MS/PhD in related field...", benefits: "Research budget, conference stipend..." },
        ],
        limits: ["Up to 20 requests/day", "Maximum 50 results per request", "Extended data fields", "AI-powered insights"]
      },
      enterprise: {
        available: true,
        sampleData: [
          { title: "Software Engineer", company: "TechCorp", location: "San Francisco, CA", salary: "$120K-150K", description: "Developing cloud-based solutions...", requirements: "5+ years experience in...", benefits: "Health insurance, 401k...", applicationUrl: "https://example.com/apply", postedDate: "2025-04-28", industry: "Technology", companySize: "1000-5000 employees" },
          { title: "Product Manager", company: "StartupXYZ", location: "Remote", salary: "$90K-110K", description: "Leading product development...", requirements: "3+ years experience in...", benefits: "Flexible schedule, equity...", applicationUrl: "https://example.com/apply", postedDate: "2025-04-30", industry: "SaaS", companySize: "50-200 employees" },
          { title: "Data Scientist", company: "AI Innovations", location: "Boston, MA", salary: "$130K-160K", description: "Building machine learning models...", requirements: "MS/PhD in related field...", benefits: "Research budget, conference stipend...", applicationUrl: "https://example.com/apply", postedDate: "2025-05-01", industry: "Artificial Intelligence", companySize: "200-500 employees" },
          { title: "Frontend Developer", company: "WebUI Inc", location: "Austin, TX", salary: "$100K-125K", description: "Creating responsive UI...", requirements: "3+ years React experience...", benefits: "Unlimited PTO, home office stipend...", applicationUrl: "https://example.com/apply", postedDate: "2025-04-25", industry: "Web Development", companySize: "50-200 employees" },
        ],
        limits: ["Unlimited requests", "Up to 200 results per request", "Complete data fields", "Advanced AI analysis", "Historical data access"]
      }
    }
  },
  {
    type: "prices",
    icon: "tag",
    description: "Collect pricing data from e-commerce sites for products, services, and subscriptions.",
    tiers: {
      basic: {
        available: true,
        sampleData: [
          { product: "Smartphone X", price: "$799.99", store: "ElectroMart" },
          { product: "Wireless Headphones", price: "$149.99", store: "AudioWorld" },
        ],
        limits: ["Limited to 5 requests/day", "Maximum 10 results per request", "Basic fields only"]
      },
      pro: {
        available: true,
        sampleData: [
          { product: "Smartphone X", price: "$799.99", store: "ElectroMart", availability: "In Stock", shipping: "Free", rating: "4.7/5", saleEnds: "05/15/2024" },
          { product: "Wireless Headphones", price: "$149.99", store: "AudioWorld", availability: "Ships in 2-3 days", shipping: "$4.99", rating: "4.5/5", saleEnds: "None" },
          { product: "Smart Watch", price: "$299.99", store: "TechGadgets", availability: "In Stock", shipping: "Free", rating: "4.2/5", saleEnds: "05/10/2024" },
        ],
        limits: ["Up to 20 requests/day", "Maximum 50 results per request", "Extended data fields", "Price comparison"]
      },
      enterprise: {
        available: true,
        sampleData: [
          { product: "Smartphone X", price: "$799.99", store: "ElectroMart", availability: "In Stock", shipping: "Free", rating: "4.7/5", saleEnds: "05/15/2024", priceHistory: "-5% from last month", lowestPrice: "$749.99 (March 2024)", specs: "6.7\" display, 128GB", alternativeStores: ["TechStop: $849.99", "MegaElectronics: $799.99"] },
          { product: "Wireless Headphones", price: "$149.99", store: "AudioWorld", availability: "Ships in 2-3 days", shipping: "$4.99", rating: "4.5/5", saleEnds: "None", priceHistory: "Stable for 3 months", lowestPrice: "$129.99 (Holiday Sale)", specs: "Noise cancelling, 30hr battery", alternativeStores: ["SoundShop: $159.99", "ElectroMart: $149.99"] },
          { product: "Smart Watch", price: "$299.99", store: "TechGadgets", availability: "In Stock", shipping: "Free", rating: "4.2/5", saleEnds: "05/10/2024", priceHistory: "New product", lowestPrice: "Current price is lowest", specs: "AMOLED display, 5-day battery", alternativeStores: ["WearableTech: $329.99", "ElectroMart: $309.99"] },
          { product: "Tablet Pro", price: "$649.99", store: "MegaElectronics", availability: "In Stock", shipping: "Free", rating: "4.8/5", saleEnds: "05/20/2024", priceHistory: "-10% from launch", lowestPrice: "Current price is lowest", specs: "10.9\" display, 256GB", alternativeStores: ["TechStop: $679.99", "ElectroMart: $649.99"] },
        ],
        limits: ["Unlimited requests", "Up to 200 results per request", "Complete data fields", "Price history tracking", "Competitor analysis"]
      }
    }
  },
  {
    type: "news",
    icon: "newspaper",
    description: "Extract news articles, headlines, and content from news sites and blogs.",
    tiers: {
      basic: {
        available: false,
        sampleData: [],
        limits: ["Not available in Basic tier"]
      },
      pro: {
        available: true,
        sampleData: [
          { title: "Tech Giant Announces New AI Product", source: "TechNews", date: "May 1, 2024", summary: "Leading technology company unveiled its latest AI-powered product line today..." },
          { title: "Global Markets Report", source: "Finance Daily", date: "May 2, 2024", summary: "Markets showed strong gains across all sectors following positive economic data..." },
          { title: "Sports Championship Results", source: "Sports Center", date: "May 1, 2024", summary: "The finals concluded with an unexpected upset as the underdog team claimed victory..." },
        ],
        limits: ["Up to 20 requests/day", "Maximum 50 results per request", "Headlines and summaries", "Basic sentiment analysis"]
      },
      enterprise: {
        available: true,
        sampleData: [
          { title: "Tech Giant Announces New AI Product", source: "TechNews", date: "May 1, 2024", summary: "Leading technology company unveiled its latest AI-powered product line today...", author: "Jane Smith", category: "Technology", sentiment: "Positive", relatedStories: ["AI Industry Growth Projections", "Competing Products Analysis"], fullText: "Full article text available...", images: ["headline.jpg", "product.jpg"] },
          { title: "Global Markets Report", source: "Finance Daily", date: "May 2, 2024", summary: "Markets showed strong gains across all sectors following positive economic data...", author: "John Doe", category: "Finance", sentiment: "Positive", relatedStories: ["Economic Forecast", "Industry Leaders Performance"], fullText: "Full article text available...", images: ["markets.jpg", "chart.jpg"] },
          { title: "Sports Championship Results", source: "Sports Center", date: "May 1, 2024", summary: "The finals concluded with an unexpected upset as the underdog team claimed victory...", author: "Mike Johnson", category: "Sports", sentiment: "Neutral", relatedStories: ["Team History", "Player Profiles"], fullText: "Full article text available...", images: ["game.jpg", "celebration.jpg"] },
          { title: "New Environmental Policy Announced", source: "World News", date: "May 2, 2024", summary: "Government officials released details of a comprehensive environmental protection plan...", author: "Sarah Williams", category: "Politics", sentiment: "Mixed", relatedStories: ["Industry Reactions", "Expert Analysis"], fullText: "Full article text available...", images: ["press.jpg", "document.jpg"] },
        ],
        limits: ["Unlimited requests", "Up to 200 results per request", "Complete article text", "Advanced sentiment analysis", "Related content linking"]
      }
    }
  },
  {
    type: "real_estate",
    icon: "home",
    description: "Collect property listings data including prices, locations, and features.",
    tiers: {
      basic: {
        available: false,
        sampleData: [],
        limits: ["Not available in Basic tier"]
      },
      pro: {
        available: false,
        sampleData: [],
        limits: ["Not available in Pro tier"]
      },
      enterprise: {
        available: true,
        sampleData: [
          { address: "123 Main St, San Francisco, CA", price: "$1,250,000", bedrooms: "3", bathrooms: "2", sqft: "1,850", propertyType: "Single Family", yearBuilt: "1998", lotSize: "0.15 acres", daysOnMarket: "12", schoolDistrict: "San Francisco Unified", walkScore: "85", taxHistory: "2023: $12,500", nearbyAmenities: "Parks, shopping, transit" },
          { address: "456 Park Ave, New York, NY", price: "$2,750,000", bedrooms: "2", bathrooms: "2.5", sqft: "1,500", propertyType: "Condo", yearBuilt: "2010", lotSize: "N/A", daysOnMarket: "8", schoolDistrict: "NYC District 2", walkScore: "98", taxHistory: "2023: $24,000", nearbyAmenities: "Restaurants, museums, subway" },
          { address: "789 Lake Dr, Chicago, IL", price: "$875,000", bedrooms: "4", bathrooms: "3", sqft: "2,400", propertyType: "Single Family", yearBuilt: "2005", lotSize: "0.25 acres", daysOnMarket: "21", schoolDistrict: "Chicago Public Schools", walkScore: "78", taxHistory: "2023: $9,200", nearbyAmenities: "Lake, parks, shopping" },
          { address: "101 Oak St, Austin, TX", price: "$650,000", bedrooms: "3", bathrooms: "2", sqft: "1,950", propertyType: "Single Family", yearBuilt: "2015", lotSize: "0.2 acres", daysOnMarket: "5", schoolDistrict: "Austin ISD", walkScore: "72", taxHistory: "2023: $8,100", nearbyAmenities: "Restaurants, parks, shopping" },
        ],
        limits: ["Unlimited requests", "Up to 200 results per request", "Complete property details", "Historical price data", "Neighborhood analytics"]
      }
    }
  },
];
