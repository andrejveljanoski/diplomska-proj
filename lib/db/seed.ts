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
    code: "mk-01",
    name: "Aračinovo",
    population: 11233,
    description:
      "A municipality in the Skopje region with traditional Macedonian villages.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Traditional Villages, Local Wineries, Mountain Trails",
  },
  {
    code: "mk-02",
    name: "Berovo",
    population: 13878,
    description:
      "A municipality in eastern Macedonia known for its mining heritage.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Maleševo Mountains, Mining Museum, Berovo Lake",
  },
  {
    code: "mk-03",
    name: "Bitola",
    population: 74550,
    description:
      "Known as the 'City of Consuls', Bitola is famous for its neoclassical architecture and rich history.",
    image: "https://images.unsplash.com/photo-1589394760642-6b1e6e8d8c9e?w=500",
    placesToVisit: "Heraclea Lyncestis, Shirok Sokak, Pelister National Park",
  },
  {
    code: "mk-04",
    name: "Bogdanci",
    population: 8709,
    description:
      "A municipality in southeastern Macedonia known for its tobacco production.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Tobacco Fields, Dojran Lake, Border Markets",
  },
  {
    code: "mk-05",
    name: "Bogovinje",
    population: 28402,
    description:
      "A municipality in the Polog region with diverse cultural heritage.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Bogovinje Fortress, Šar Mountain, Cultural Centers",
  },
  {
    code: "mk-06",
    name: "Bosilovo",
    population: 14487,
    description:
      "A municipality in southeastern Macedonia known for its agricultural traditions.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Bosilovo Monastery, Wine Cellars, Rural Landscapes",
  },
  {
    code: "mk-07",
    name: "Brvenica",
    population: 15293,
    description: "A municipality in the Polog region with mountainous terrain.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Brvenica Canyon, Mountain Villages, Hiking Trails",
  },
  {
    code: "mk-08",
    name: "Valandovo",
    population: 11444,
    description:
      "A municipality in southeastern Macedonia with agricultural focus.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Valandovo Fortress, Tobacco Fields, Local Markets",
  },
  {
    code: "mk-09",
    name: "Vasilevo",
    population: 12013,
    description:
      "A municipality in southeastern Macedonia known for its wine production.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Wine Cellars, Vasilevo Monastery, Vineyards",
  },
  {
    code: "mk-10",
    name: "Vevčani",
    population: 2419,
    description:
      "A small municipality in southwestern Macedonia with scenic landscapes.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Vevčani Lake, Mountain Views, Traditional Houses",
  },
  {
    code: "mk-11",
    name: "Veles",
    population: 43716,
    description:
      "An ancient city on the Vardar River with a rich history dating back to antiquity.",
    image: "https://images.unsplash.com/photo-1578070181910-f1e514afdd08?w=500",
    placesToVisit:
      "Clock Tower, Saint Panteleimon Church, Archaeological Museum",
  },
  {
    code: "mk-12",
    name: "Vinica",
    population: 10863,
    description:
      "A small town in eastern Macedonia with rich archaeological heritage.",
    image: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=500",
    placesToVisit: "Vinica Terracottas, Lesnovo Monastery",
  },
  {
    code: "mk-13",
    name: "Vrapčište",
    population: 25108,
    description:
      "A municipality in the Polog region known for its cultural diversity.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Vrapčište Monastery, Šar Mountain, Cultural Sites",
  },
  {
    code: "mk-14",
    name: "Gevgelija",
    population: 15685,
    description:
      "A border town known for its casino and as a gateway to Greece.",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500",
    placesToVisit: "Smrdliva Voda Spa, Dojran Lake",
  },
  {
    code: "mk-15",
    name: "Gostivar",
    population: 35847,
    description:
      "A multi-ethnic city in the Polog valley, gateway to Mavrovo National Park.",
    image: "https://images.unsplash.com/photo-1564594262-ab06888ba43f?w=500",
    placesToVisit: "Mavrovo Lake, Bigorski Monastery, Old Bazaar",
  },
  {
    code: "mk-16",
    name: "Gradsko",
    population: 3741,
    description:
      "A municipality in southeastern Macedonia with agricultural traditions.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Gradsko Monastery, Rural Landscapes, Local Markets",
  },
  {
    code: "mk-17",
    name: "Debar",
    population: 14561,
    description:
      "A scenic town near Debar Lake, known for its woodcarving traditions and monasteries.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Debar Lake, Saint George Monastery, Rajcica Monastery",
  },
  {
    code: "mk-18",
    name: "Delčevo",
    population: 17444,
    description:
      "A municipality in eastern Macedonia known for its mining industry.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Delčevo Mines, Mountain Trails, Mining Museum",
  },
  {
    code: "mk-19",
    name: "Demir Hisar",
    population: 7635,
    description:
      "A municipality in southwestern Macedonia with mountainous landscapes.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Demir Hisar Fortress, Mountain Villages, Hiking Routes",
  },
  {
    code: "mk-20",
    name: "Demir Kapija",
    population: 4305,
    description:
      "A municipality in southeastern Macedonia with historical significance.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Demir Kapija Gorge, Ancient Ruins, River Views",
  },
  {
    code: "mk-21",
    name: "Dolneni",
    population: 13537,
    description: "A municipality in the Polog region with agricultural focus.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Dolneni Monastery, Rural Areas, Local Farms",
  },
  {
    code: "mk-22",
    name: "Želino",
    population: 24435,
    description: "A municipality in the Polog region with diverse communities.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Želino Monastery, Cultural Sites, Mountain Views",
  },
  {
    code: "mk-23",
    name: "Zelenikovo",
    population: 4084,
    description: "A municipality in the Skopje region with suburban character.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Zelenikovo Monastery, Suburban Areas, Nature Trails",
  },
  {
    code: "mk-24",
    name: "Zrnovci",
    population: 3240,
    description:
      "A municipality in southeastern Macedonia with agricultural focus.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Zrnovci Monastery, Rural Areas, Local Vineyards",
  },
  {
    code: "mk-25",
    name: "Ilinden",
    population: 16131,
    description:
      "A municipality in Skopje region with industrial and residential areas.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Industrial Sites, Residential Areas, Local Parks",
  },
  {
    code: "mk-26",
    name: "Jegunovce",
    population: 10489,
    description:
      "A municipality in the Polog region with traditional villages.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Jegunovce Monastery, Mountain Villages, Cultural Heritage",
  },
  {
    code: "mk-27",
    name: "Kavadarci",
    population: 29188,
    description:
      "The heart of Macedonia's wine region, surrounded by vineyards and wineries.",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=500",
    placesToVisit: "Tikveš Wine Region, Stobi Archaeological Site",
  },
  {
    code: "mk-28",
    name: "Karbinci",
    population: 4007,
    description:
      "A municipality in eastern Macedonia with agricultural traditions.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Karbinci Monastery, Rural Landscapes, Local Farms",
  },
  {
    code: "mk-29",
    name: "Kičevo",
    population: 27067,
    description:
      "A town in the southwestern part of Macedonia, surrounded by mountains and forests.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500",
    placesToVisit: "Bigorski Monastery, Mavrovo National Park",
  },
  {
    code: "mk-30",
    name: "Kočani",
    population: 28330,
    description:
      "Known for its rice production and beautiful natural surroundings in eastern Macedonia.",
    image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=500",
    placesToVisit: "Zrze Monastery, Morodvis Village, Rice Fields",
  },
  {
    code: "mk-31",
    name: "Konče",
    population: 3534,
    description:
      "A municipality in southeastern Macedonia with rural character.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Konče Monastery, Rural Areas, Agricultural Lands",
  },
  {
    code: "mk-32",
    name: "Kratovo",
    population: 10695,
    description:
      "A municipality in eastern Macedonia known for its medieval fortress.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Kratovo Fortress, Medieval Town, Mountain Views",
  },
  {
    code: "mk-33",
    name: "Kriva Palanka",
    population: 20813,
    description:
      "A municipality in eastern Macedonia with mountainous terrain.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Kriva Palanka Monastery, Mountain Trails, Osogovo Mountains",
  },
  {
    code: "mk-34",
    name: "Krivogaštani",
    population: 6156,
    description:
      "A municipality in southwestern Macedonia with traditional villages.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Krivogaštani Monastery, Traditional Villages, Mountain Views",
  },
  {
    code: "mk-35",
    name: "Kruševo",
    population: 8937,
    description:
      "A municipality in southwestern Macedonia known for its revolutionary history.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Kruševo Republic Memorial, Mountain Views, Historical Sites",
  },
  {
    code: "mk-36",
    name: "Kumanovo",
    population: 105484,
    description:
      "The third largest city in Macedonia, known for its industrial heritage and cultural diversity.",
    image: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=500",
    placesToVisit: "Staro Nagorichane Monastery, Konjuh Mountain, City Park",
  },
  {
    code: "mk-37",
    name: "Lipkovo",
    population: 27030,
    description: "A municipality in the Polog region with diverse communities.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Lipkovo Monastery, Cultural Sites, Mountain Landscapes",
  },
  {
    code: "mk-38",
    name: "Lozovo",
    population: 2858,
    description:
      "A municipality in southeastern Macedonia with agricultural focus.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Lozovo Monastery, Rural Areas, Local Vineyards",
  },
  {
    code: "mk-39",
    name: "Mavrovo i Rostuša",
    population: 8642,
    description:
      "A municipality in southwestern Macedonia known for its national park.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Mavrovo National Park, Mountain Lakes, Ski Resorts",
  },
  {
    code: "mk-40",
    name: "Makedonska Kamenica",
    population: 8108,
    description: "A municipality in eastern Macedonia with mining heritage.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Mining Sites, Mountain Trails, Local Museums",
  },
  {
    code: "mk-41",
    name: "Makedonski Brod",
    population: 7141,
    description:
      "A municipality in southwestern Macedonia with scenic landscapes.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Makedonski Brod Monastery, Mountain Views, River Valleys",
  },
  {
    code: "mk-42",
    name: "Mogila",
    population: 6727,
    description:
      "A municipality in southeastern Macedonia with agricultural traditions.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Mogila Monastery, Rural Landscapes, Local Markets",
  },
  {
    code: "mk-43",
    name: "Negotino",
    population: 13284,
    description:
      "A wine-producing town in the Tikveš region with ancient historical sites.",
    image: "https://images.unsplash.com/photo-1510133768164-a8f7e4d4e3dc?w=500",
    placesToVisit: "Tikveš Vineyards, Stobi Ancient City",
  },
  {
    code: "mk-44",
    name: "Novaci",
    population: 3601,
    description:
      "A municipality in southwestern Macedonia with mountainous terrain.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Novaci Monastery, Mountain Villages, Hiking Trails",
  },
  {
    code: "mk-45",
    name: "Novo Selo",
    population: 11439,
    description:
      "A municipality in southeastern Macedonia with border location.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Novo Selo Monastery, Border Areas, Rural Landscapes",
  },
  {
    code: "mk-46",
    name: "Ohrid",
    population: 42033,
    description:
      "A UNESCO World Heritage site on the shores of Lake Ohrid, one of Europe's oldest and deepest lakes.",
    image: "https://images.unsplash.com/photo-1585352650193-d7154b0c1b1d?w=500",
    placesToVisit:
      "Lake Ohrid, Saint Naum Monastery, Ancient Theatre, Samuel's Fortress",
  },
  {
    code: "mk-47",
    name: "Pehčevo",
    population: 5523,
    description: "A municipality in eastern Macedonia with mining traditions.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Pehčevo Mines, Mountain Landscapes, Local Museums",
  },
  {
    code: "mk-48",
    name: "Petrovec",
    population: 8314,
    description: "A municipality in the Skopje region with suburban character.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Petrovec Monastery, Suburban Areas, Nature Trails",
  },
  {
    code: "mk-49",
    name: "Plasnica",
    population: 4538,
    description:
      "A municipality in southwestern Macedonia with mountainous terrain.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Plasnica Monastery, Mountain Villages, Hiking Routes",
  },
  {
    code: "mk-50",
    name: "Prilep",
    population: 66246,
    description:
      "Famous for its tobacco production and medieval towers perched on granite rocks.",
    image: "https://images.unsplash.com/photo-1580837119756-563d608dd119?w=500",
    placesToVisit: "Marko's Towers, Treskavec Monastery, Clock Tower",
  },
  {
    code: "mk-51",
    name: "Probištip",
    population: 16022,
    description:
      "A municipality in eastern Macedonia with industrial heritage.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Probištip Mines, Industrial Sites, Mountain Views",
  },
  {
    code: "mk-52",
    name: "Radoviš",
    population: 16223,
    description:
      "A small town in southeastern Macedonia with agricultural traditions.",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500",
    placesToVisit: "Church of Saint George, Plačkovica Mountain",
  },
  {
    code: "mk-53",
    name: "Rankovce",
    population: 4147,
    description:
      "A municipality in northeastern Macedonia with rural character.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Rankovce Monastery, Rural Areas, Agricultural Lands",
  },
  {
    code: "mk-54",
    name: "Resen",
    population: 16537,
    description: "A municipality in southwestern Macedonia with lake views.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Resen Lake, Mountain Views, Local Monasteries",
  },
  {
    code: "mk-55",
    name: "Rosoman",
    population: 4141,
    description:
      "A municipality in southeastern Macedonia with agricultural focus.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Rosoman Monastery, Rural Landscapes, Local Vineyards",
  },
  {
    code: "mk-56",
    name: "Sopište",
    population: 5658,
    description:
      "A municipality in the Polog region with traditional villages.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Sopište Monastery, Mountain Villages, Cultural Sites",
  },
  {
    code: "mk-57",
    name: "Staro Nagoričane",
    population: 4848,
    description:
      "A municipality in northeastern Macedonia with historical sites.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Staro Nagoričane Monastery, Historical Ruins, Mountain Views",
  },
  {
    code: "mk-58",
    name: "Struga",
    population: 16559,
    description:
      "A resort town on Lake Ohrid, famous for its poetry festival and crystal clear springs.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500",
    placesToVisit: "Lake Ohrid Beach, Drim River, Poetry Bridge",
  },
  {
    code: "mk-59",
    name: "Strumica",
    population: 35311,
    description:
      "Located in the southeastern part of the country, known for its carnival and hot springs.",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500",
    placesToVisit: "Vodoca Monastery, Bansko Village, Strumica Carnival",
  },
  {
    code: "mk-60",
    name: "Studeničani",
    population: 17219,
    description: "A municipality in the Skopje region with suburban areas.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Studeničani Monastery, Suburban Areas, Nature Trails",
  },
  {
    code: "mk-61",
    name: "Štip",
    population: 43652,
    description:
      "An important economic and cultural center in eastern Macedonia, known for its carnival traditions.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
    placesToVisit: "Isar Fortress, Bezisten, Church of Saint Nicholas",
  },
  {
    code: "mk-62",
    name: "Tearce",
    population: 22624,
    description: "A municipality in the Polog region with diverse communities.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Tearce Monastery, Cultural Sites, Mountain Landscapes",
  },
  {
    code: "mk-63",
    name: "Tetovo",
    population: 52915,
    description:
      "A picturesque city at the foot of Šar Mountain, known for its colorful Painted Mosque.",
    image: "https://images.unsplash.com/photo-1601485066411-fde4b8f8e3d3?w=500",
    placesToVisit: "Painted Mosque, Tetovo Fortress, Šar Mountain",
  },
  {
    code: "mk-64",
    name: "Centar Župa",
    population: 4540,
    description:
      "A municipality in southwestern Macedonia with mountainous terrain.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Centar Župa Monastery, Mountain Villages, Hiking Trails",
  },
  {
    code: "mk-65",
    name: "Čaška",
    population: 7847,
    description:
      "A municipality in the Vardar region with agricultural traditions.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Čaška Monastery, Rural Areas, River Valleys",
  },
  {
    code: "mk-66",
    name: "Češinovo-Obleševo",
    population: 7447,
    description: "A municipality in eastern Macedonia with mining heritage.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Češinovo Monastery, Mining Sites, Mountain Trails",
  },
  {
    code: "mk-67",
    name: "Čučer-Sandevo",
    population: 8448,
    description: "A municipality in the Skopje region with suburban character.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Čučer Monastery, Suburban Areas, Nature Trails",
  },
  {
    code: "mk-68",
    name: "Debarca",
    population: 6200,
    description:
      "A small municipality near Ohrid with rural villages and natural scenery.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Local Villages, Scenic Views, Traditional Churches",
  },
  {
    code: "mk-69",
    name: "Sveti Nikole",
    population: 18600,
    description:
      "A municipality in central Macedonia known for agriculture and historical sites.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Boshkov Most Reservoir, Local Markets, Historic Churches",
  },
  {
    code: "mk-70",
    name: "Dojran",
    population: 3100,
    description:
      "A small southeastern municipality on Lake Dojran, known for its lake and beaches.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit: "Lake Dojran, Beach Resorts, Local Fish Restaurants",
  },
  {
    code: "mk-71",
    name: "Skopje",
    population: 506926,
    description:
      "The capital and largest city in Macedonia, located on the Vardar River. A vibrant hub of culture, politics, and economy.",
    image: "https://images.unsplash.com/photo-1622495589041-64b01885f76d?w=500",
    placesToVisit: "Stone Bridge, Old Bazaar, Kale Fortress, Macedonia Square",
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
    console.error(" Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("🎉 Seed complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
