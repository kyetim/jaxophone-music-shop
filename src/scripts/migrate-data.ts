import { ProductService, CategoryService, BrandService } from '@/lib/firestore';

// Sample Music Instruments Data
const sampleProducts = [
    // Guitars
    {
        name: "Fender Player Stratocaster",
        description: "The inspiring sound of a Stratocaster is one of the foundations of Fender. Featuring this classic sound—bell-like high end, punchy mids and robust low end, combined with crystal-clear articulation—the sonically versatile Player Stratocaster is packed with authentic Fender feel and style.",
        price: 35000,
        originalPrice: 42000,
        imageUrl: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=600&h=400&fit=crop",
        category: "guitars",
        brand: "Fender",
        inStock: true,
        stockQuantity: 15,
        rating: 4.8,
        reviewCount: 127,
        tags: ["electric", "stratocaster", "professional", "versatile"]
    },
    {
        name: "Gibson Les Paul Standard",
        description: "The Gibson Les Paul Standard returns to the classic design that made it relevant, played and loved -- shaping sound across every style of music.",
        price: 58000,
        originalPrice: 65000,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
        category: "guitars",
        brand: "Gibson",
        inStock: true,
        stockQuantity: 8,
        rating: 4.9,
        reviewCount: 89,
        tags: ["electric", "les paul", "mahogany", "humbuckers"]
    },
    {
        name: "Taylor 814ce Acoustic Guitar",
        description: "Taylor's 814ce pairs Indian rosewood back and sides with a Sitka spruce top for a guitar that projects with power and warmth.",
        price: 72000,
        originalPrice: 80000,
        imageUrl: "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&h=400&fit=crop",
        category: "guitars",
        brand: "Taylor",
        inStock: true,
        stockQuantity: 5,
        rating: 4.9,
        reviewCount: 63,
        tags: ["acoustic", "cutaway", "electronics", "rosewood"]
    },

    // Pianos & Keyboards
    {
        name: "Yamaha P-45 Digital Piano",
        description: "The P-45 digital piano features the GHS weighted action with heavier touch in the low end and lighter touch in the high end, just like the hammers inside an acoustic piano.",
        price: 18500,
        originalPrice: 22000,
        imageUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=400&fit=crop",
        category: "keyboards",
        brand: "Yamaha",
        inStock: true,
        stockQuantity: 12,
        rating: 4.6,
        reviewCount: 245,
        tags: ["digital piano", "88 keys", "weighted", "portable"]
    },
    {
        name: "Roland RD-2000 Stage Piano",
        description: "The RD-2000 is a premium stage piano with dual sound engines, providing the most authentic acoustic piano experience along with electric pianos, organs, and synth sounds.",
        price: 85000,
        imageUrl: "https://images.unsplash.com/photo-1571974599782-87624638275b?w=600&h=400&fit=crop",
        category: "keyboards",
        brand: "Roland",
        inStock: true,
        stockQuantity: 3,
        rating: 4.8,
        reviewCount: 56,
        tags: ["stage piano", "professional", "dual engine", "88 keys"]
    },

    // Drums
    {
        name: "Pearl Export Series Drum Set",
        description: "The Export Series delivers the classic Pearl sound in an affordable package. Featuring 100% poplar shells, this kit provides excellent tone and projection.",
        price: 28500,
        originalPrice: 32000,
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
        category: "drums",
        brand: "Pearl",
        inStock: true,
        stockQuantity: 6,
        rating: 4.5,
        reviewCount: 78,
        tags: ["acoustic drums", "5-piece", "poplar", "cymbals included"]
    },
    {
        name: "Roland TD-17KVX Electronic Drum Kit",
        description: "The TD-17KVX delivers the most authentic playing experience in its class, with superior sound quality and natural stick response across every surface.",
        price: 42000,
        imageUrl: "https://images.unsplash.com/photo-1562103966-e1c207af58c7?w=600&h=400&fit=crop",
        category: "drums",
        brand: "Roland",
        inStock: true,
        stockQuantity: 4,
        rating: 4.7,
        reviewCount: 92,
        tags: ["electronic drums", "mesh heads", "bluetooth", "recording"]
    },

    // Brass & Wind
    {
        name: "Yamaha YAS-280 Alto Saxophone",
        description: "The YAS-280 is perfect for student musicians. The addition of a key guard and other enhancements makes this instrument more durable and extends the life of the pads.",
        price: 32000,
        originalPrice: 38000,
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop",
        category: "brass-wind",
        brand: "Yamaha",
        inStock: true,
        stockQuantity: 7,
        rating: 4.4,
        reviewCount: 34,
        tags: ["saxophone", "alto", "student", "lacquered"]
    },
    {
        name: "Bach Stradivarius 180S37 Trumpet",
        description: "The Bach Stradivarius 180S37 trumpet is the most widely used professional trumpet in the world. It offers superior intonation and an even scale in all registers.",
        price: 68000,
        imageUrl: "https://images.unsplash.com/photo-1558035509-6c5b5d1fceb8?w=600&h=400&fit=crop",
        category: "brass-wind",
        brand: "Bach",
        inStock: true,
        stockQuantity: 3,
        rating: 4.9,
        reviewCount: 41,
        tags: ["trumpet", "professional", "stradivarius", "silver plated"]
    },

    // Strings
    {
        name: "Yamaha V3 SKA Violin 4/4",
        description: "The V3 SKA features a solid spruce top with maple back and sides. Hand-applied oil varnish gives this violin a beautiful, classic appearance.",
        price: 15500,
        originalPrice: 18000,
        imageUrl: "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=600&h=400&fit=crop",
        category: "strings",
        brand: "Yamaha",
        inStock: true,
        stockQuantity: 9,
        rating: 4.3,
        reviewCount: 67,
        tags: ["violin", "4/4", "solid spruce", "oil varnish"]
    },
    {
        name: "Cort Action Bass V Plus",
        description: "The Action Bass V Plus features a lightweight poplar body with bolt-on maple neck, providing excellent sustain and bright, punchy tone.",
        price: 12500,
        originalPrice: 15000,
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
        category: "strings",
        brand: "Cort",
        inStock: true,
        stockQuantity: 11,
        rating: 4.2,
        reviewCount: 89,
        tags: ["bass guitar", "5-string", "active pickups", "poplar"]
    }
];

const sampleCategories = [
    {
        name: "Gitar",
        description: "Elektrik, akustik ve klasik gitarlar",
        imageUrl: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400&h=300&fit=crop",
        slug: "guitars"
    },
    {
        name: "Klavye & Piyano",
        description: "Dijital piyanolar, synthesizer ve klavyeler",
        imageUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=300&fit=crop",
        slug: "keyboards"
    },
    {
        name: "Davul",
        description: "Akustik ve elektronik davul setleri",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
        slug: "drums"
    },
    {
        name: "Nefesli Çalgılar",
        description: "Saksafon, trompet, flüt ve diğer nefesli enstrümanlar",
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
        slug: "brass-wind"
    },
    {
        name: "Yaylı Çalgılar",
        description: "Keman, viyola, çello ve kontrbas",
        imageUrl: "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=400&h=300&fit=crop",
        slug: "strings"
    }
];

const sampleBrands = [
    {
        name: "Fender",
        description: "Amerikan gitar ve amfi üreticisi, 1946'dan beri müzik dünyasında",
        logoUrl: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=200&h=100&fit=crop",
        website: "https://www.fender.com"
    },
    {
        name: "Gibson",
        description: "Efsanevi Les Paul ve SG gitarlarının yaratıcısı",
        logoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=100&fit=crop",
        website: "https://www.gibson.com"
    },
    {
        name: "Yamaha",
        description: "Tüm enstrüman kategorilerinde kaliteli ürünler sunan Japon markası",
        logoUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=200&h=100&fit=crop",
        website: "https://www.yamaha.com"
    },
    {
        name: "Roland",
        description: "Elektronik müzik enstrümanları ve teknolojilerinde öncü",
        logoUrl: "https://images.unsplash.com/photo-1571974599782-87624638275b?w=200&h=100&fit=crop",
        website: "https://www.roland.com"
    },
    {
        name: "Pearl",
        description: "Dünya çapında tanınan davul ve perküsyon markası",
        logoUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=100&fit=crop",
        website: "https://www.pearldrum.com"
    },
    {
        name: "Taylor",
        description: "Premium akustik gitar üreticisi, el yapımı kalite",
        logoUrl: "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=200&h=100&fit=crop",
        website: "https://www.taylorguitars.com"
    },
    {
        name: "Bach",
        description: "Profesyonel nefesli çalgılar konusunda dünya standardı",
        logoUrl: "https://images.unsplash.com/photo-1558035509-6c5b5d1fceb8?w=200&h=100&fit=crop",
        website: "https://www.bachbrass.com"
    },
    {
        name: "Cort",
        description: "Uygun fiyatlı kaliteli enstrümanlar sunan güney Kore markası",
        logoUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=100&fit=crop",
        website: "https://www.cortguitars.com"
    }
];

export async function migrateData() {
    console.log('🚀 Starting data migration...');

    try {
        // 1. Migrate Categories
        console.log('📁 Migrating categories...');
        for (const category of sampleCategories) {
            const id = await CategoryService.create(category);
            console.log(`✅ Category created: ${category.name} (${id})`);
        }

        // 2. Migrate Brands
        console.log('🏷️ Migrating brands...');
        for (const brand of sampleBrands) {
            const id = await BrandService.create(brand);
            console.log(`✅ Brand created: ${brand.name} (${id})`);
        }

        // 3. Migrate Products
        console.log('🎸 Migrating products...');
        for (const product of sampleProducts) {
            const id = await ProductService.create(product);
            console.log(`✅ Product created: ${product.name} (${id})`);
        }

        console.log('🎉 Data migration completed successfully!');
        console.log(`📊 Migrated: ${sampleCategories.length} categories, ${sampleBrands.length} brands, ${sampleProducts.length} products`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

// Run migration if this file is executed directly
if (typeof window === 'undefined') {
    migrateData().catch(console.error);
} 