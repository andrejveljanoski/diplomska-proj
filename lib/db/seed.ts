import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Load .env.local file BEFORE creating db connection
config({ path: ".env.local" });

// Debug: Check if DATABASE_URL is loaded
console.log("DATABASE_URL loaded:", process.env.DATABASE_URL ? "✓" : "✗");

// Create db connection using HTTP instead of Pool
import * as schema from "./schema";
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const { regions } = schema;

const macedoniaRegions = [
  {
    name: "Skopje",
    population: 506926,
    description:
      "The capital and largest city of North Macedonia, located on the Vardar River. A vibrant hub of culture, politics, and economy.",
    image: "https://images.unsplash.com/photo-1622495589041-64b01885f76d?w=500",
    placesToVisit: "Stone Bridge, Old Bazaar, Kale Fortress, Macedonia Square",
  },
  {
    name: "Bitola",
    population: 74550,
    description:
      "Known as the 'City of Consuls', Bitola is famous for its neoclassical architecture and rich history.",
    image: "https://images.unsplash.com/photo-1589394760642-6b1e6e8d8c9e?w=500",
    placesToVisit: "Heraclea Lyncestis, Shirok Sokak, Pelister National Park",
  },
  {
    name: "Kumanovo",
    population: 105484,
    description:
      "The third largest city in North Macedonia, known for its industrial heritage and cultural diversity.",
    image: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=500",
    placesToVisit: "Staro Nagorichane Monastery, Konjuh Mountain, City Park",
  },
  {
    name: "Prilep",
    population: 66246,
    description:
      "Famous for its tobacco production and medieval towers perched on granite rocks.",
    image: "https://images.unsplash.com/photo-1580837119756-563d608dd119?w=500",
    placesToVisit: "Marko's Towers, Treskavec Monastery, Clock Tower",
  },
  {
    name: "Tetovo",
    population: 52915,
    description:
      "A picturesque city at the foot of Šar Mountain, known for its colorful Painted Mosque.",
    image: "https://images.unsplash.com/photo-1601485066411-fde4b8f8e3d3?w=500",
    placesToVisit: "Painted Mosque, Tetovo Fortress, Šar Mountain",
  },
  {
    name: "Veles",
    population: 43716,
    description:
      "An ancient city on the Vardar River with a rich history dating back to antiquity.",
    image: "https://images.unsplash.com/photo-1578070181910-f1e514afdd08?w=500",
    placesToVisit:
      "Clock Tower, Saint Panteleimon Church, Archaeological Museum",
  },
  {
    name: "Ohrid",
    population: 42033,
    description:
      "A UNESCO World Heritage site on the shores of Lake Ohrid, one of Europe's oldest and deepest lakes.",
    image: "https://images.unsplash.com/photo-1585352650193-d7154b0c1b1d?w=500",
    placesToVisit:
      "Lake Ohrid, Saint Naum Monastery, Ancient Theatre, Samuel's Fortress",
  },
  {
    name: "Štip",
    population: 43652,
    description:
      "An important economic and cultural center in eastern Macedonia, known for its carnival traditions.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
    placesToVisit: "Isar Fortress, Bezisten, Church of Saint Nicholas",
  },
  {
    name: "Gostivar",
    population: 35847,
    description:
      "A multi-ethnic city in the Polog valley, gateway to Mavrovo National Park.",
    image: "https://images.unsplash.com/photo-1564594262-ab06888ba43f?w=500",
    placesToVisit: "Mavrovo Lake, Bigorski Monastery, Old Bazaar",
  },
  {
    name: "Strumica",
    population: 35311,
    description:
      "Located in the southeastern part of the country, known for its carnival and hot springs.",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500",
    placesToVisit: "Vodoca Monastery, Bansko Village, Strumica Carnival",
  },
  {
    name: "Kavadarci",
    population: 29188,
    description:
      "The heart of Macedonia's wine region, surrounded by vineyards and wineries.",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=500",
    placesToVisit: "Tikveš Wine Region, Stobi Archaeological Site",
  },
  {
    name: "Kočani",
    population: 28330,
    description:
      "Known for its rice production and beautiful natural surroundings in eastern Macedonia.",
    image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=500",
    placesToVisit: "Zrze Monastery, Morodvis Village, Rice Fields",
  },
  {
    name: "Struga",
    population: 16559,
    description:
      "A resort town on Lake Ohrid, famous for its poetry festival and crystal clear springs.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500",
    placesToVisit: "Lake Ohrid Beach, Drim River, Poetry Bridge",
  },
  {
    name: "Kičevo",
    population: 27067,
    description:
      "A town in the southwestern part of Macedonia, surrounded by mountains and forests.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500",
    placesToVisit: "Bigorski Monastery, Mavrovo National Park",
  },
  {
    name: "Gevgelija",
    population: 15685,
    description:
      "A border town known for its casino and as a gateway to Greece.",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500",
    placesToVisit: "Smrdliva Voda Spa, Dojran Lake",
  },
  {
    name: "Radoviš",
    population: 16223,
    description:
      "A small town in southeastern Macedonia with agricultural traditions.",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500",
    placesToVisit: "Church of Saint George, Plačkovica Mountain",
  },
  {
    name: "Debar",
    population: 14561,
    description:
      "A scenic town near Debar Lake, known for its woodcarving traditions and monasteries.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Debar Lake, Saint George Monastery, Rajcica Monastery",
  },
  {
    name: "Negotino",
    population: 13284,
    description:
      "A wine-producing town in the Tikveš region with ancient historical sites.",
    image: "https://images.unsplash.com/photo-1510133768164-a8f7e4d4e3dc?w=500",
    placesToVisit: "Tikveš Vineyards, Stobi Ancient City",
  },
  {
    name: "Sveti Nikole",
    population: 13746,
    description:
      "A town in the central part of Macedonia known for its agricultural production.",
    image: "https://images.unsplash.com/photo-1502920514313-52581002a659?w=500",
    placesToVisit: "Church of Saint Nicholas, Ovče Pole Plain",
  },
  {
    name: "Vinica",
    population: 10863,
    description:
      "A small town in eastern Macedonia with rich archaeological heritage.",
    image: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=500",
    placesToVisit: "Vinica Terracottas, Lesnovo Monastery",
  },
];

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Insert regions
    await db.insert(regions).values(macedoniaRegions);

    console.log("✅ Database seeded successfully!");
    console.log(`📍 Inserted ${macedoniaRegions.length} regions`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("🎉 Seed complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seed failed:", error);
    process.exit(1);
  });
