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
    population: 12676,
    shortDescription: "Traditional Macedonian villages with local charm",
    description:
      "A municipality in the Skopje region with traditional Macedonian villages. Aračinovo offers visitors an authentic glimpse into rural Macedonian life, featuring traditional architecture, local crafts, and warm hospitality. The region is known for its agricultural traditions and beautiful countryside landscapes.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Traditional Villages, Local Wineries, Mountain Trails, Craft Markets, Rural Homestays",
  },
  {
    code: "mk-02",
    name: "Berovo",
    population: 10890,
    shortDescription:
      "Mining heritage and mountain beauty in eastern Macedonia",
    description:
      "A municipality in eastern Macedonia known for its mining heritage and natural resources. Berovo sits in the picturesque Maleševo region, surrounded by mountains and forests. The area offers stunning landscapes, a serene lake, and a fascinating history of mineral extraction that shaped the local economy.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Maleševo Mountains, Mining Museum, Berovo Lake, Mountain Trails, Local Markets",
  },
  {
    code: "mk-03",
    name: "Bitola",
    population: 85163,
    shortDescription: "City of Consuls with stunning neoclassical architecture",
    description:
      "Known as the 'City of Consuls', Bitola is one of Macedonia's jewels, famous for its impressive neoclassical architecture and rich Ottoman heritage. The city was once a major trading center with consulates from many nations. Today, visitors can explore historic buildings, the vibrant Shirok Sokak pedestrian street, and access the nearby Pelister National Park with its pristine nature.",
    image: "https://images.unsplash.com/photo-1589394760642-6b1e6e8d8c9e?w=500",
    placesToVisit:
      "Heraclea Lyncestis, Shirok Sokak, Pelister National Park, Old Bazaar, Museum of Bitola",
  },
  {
    code: "mk-04",
    name: "Bogdanci",
    population: 7339,
    shortDescription: "Agricultural center near scenic Lake Dojran",
    description:
      "A municipality in southeastern Macedonia known for its tobacco production and agricultural heritage. Bogdanci is situated close to the beautiful Lake Dojran, offering a blend of farming traditions and natural beauty. The region provides opportunities to experience local farming practices and enjoy the peaceful landscape.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Tobacco Fields, Dojran Lake, Border Markets, Local Farms, Agricultural Museums",
  },
  {
    code: "mk-05",
    name: "Bogovinje",
    population: 22906,
    shortDescription: "Cultural crossroads in the Polog region",
    description:
      "A municipality in the Polog region with diverse cultural heritage influenced by various Macedonian traditions. Bogovinje is known for its rich history, strategic location, and blend of communities. The area offers insights into Macedonian mountain life with traditional customs and local crafts.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Bogovinje Fortress, Šar Mountain, Cultural Centers, Traditional Crafts, Historic Sites",
  },
  {
    code: "mk-06",
    name: "Bosilovo",
    population: 11508,
    shortDescription: "Agricultural traditions and wine production",
    description:
      "A municipality in southeastern Macedonia with strong agricultural traditions and wine production heritage. Bosilovo is known for its vineyards and wine cellars, where visitors can taste local varieties and learn about winemaking techniques passed down through generations. The region maintains authentic rural character.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Bosilovo Monastery, Wine Cellars, Vineyards, Rural Landscapes, Tasting Rooms",
  },
  {
    code: "mk-07",
    name: "Brvenica",
    population: 13645,
    shortDescription: "Mountain gateway to Polog region",
    description:
      "A municipality in the Polog region characterized by mountainous terrain and stunning natural landscapes. Brvenica offers excellent opportunities for hiking and outdoor activities, with traditional mountain villages dotting the region. The area is perfect for nature lovers seeking authentic mountain experiences.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Brvenica Canyon, Mountain Villages, Hiking Trails, Nature Reserves, Scenic Viewpoints",
  },
  {
    code: "mk-08",
    name: "Valandovo",
    population: 10508,
    shortDescription: "Agricultural hub with historical fortifications",
    description:
      "A municipality in southeastern Macedonia with a strong focus on agriculture and farming. Valandovo boasts historical fortifications and serves as an agricultural hub for the region. The area is known for tobacco cultivation and traditional farming methods that have sustained the community for centuries.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Valandovo Fortress, Tobacco Fields, Local Markets, Agricultural Centers, Historic Ruins",
  },
  {
    code: "mk-09",
    name: "Vasilevo",
    population: 10552,
    shortDescription: "Wine region with monastic heritage",
    description:
      "A municipality in southeastern Macedonia renowned for its wine production and monastic heritage. Vasilevo is situated in a region famous for viticulture, with numerous vineyards producing quality wines. The ancient monastery adds spiritual and historical significance to this charming wine country.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Wine Cellars, Vasilevo Monastery, Vineyards, Tasting Rooms, Rural Villages",
  },
  {
    code: "mk-10",
    name: "Vevčani",
    population: 2359,
    shortDescription: "Small mountain village with scenic alpine setting",
    description:
      "A small municipality in southwestern Macedonia offering a pristine alpine setting with scenic landscapes. Vevčani is known for its traditional architecture and peaceful environment, making it an ideal destination for those seeking solitude and natural beauty in the mountains.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Vevčani Lake, Mountain Views, Traditional Houses, Walking Trails, Alpine Views",
  },
  {
    code: "mk-11",
    name: "Veles",
    population: 48463,
    shortDescription: "Ancient city on the Vardar River with rich history",
    description:
      "An ancient city on the Vardar River with a history dating back to antiquity. Veles served as an important trading center and fortress throughout various empires. Today, it offers visitors beautiful architecture, including its iconic clock tower, historic churches, and archaeological discoveries that showcase its significant past.",
    image: "https://images.unsplash.com/photo-1578070181910-f1e514afdd08?w=500",
    placesToVisit:
      "Clock Tower, Saint Panteleimon Church, Archaeological Museum, Vardar Viewpoints, Old Town",
  },
  {
    code: "mk-12",
    name: "Vinica",
    population: 14475,
    shortDescription: "Archaeological treasure with terracotta heritage",
    description:
      "A small town in eastern Macedonia with remarkable archaeological heritage, famous for its ancient terracottas. Vinica sits at a crossroads of history, with artifacts revealing settlement patterns from various periods. The area offers insights into ancient Macedonian civilization and craftsmanship.",
    image: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=500",
    placesToVisit:
      "Vinica Terracottas, Lesnovo Monastery, Archaeological Sites, Museum, Historic Villages",
  },
  {
    code: "mk-13",
    name: "Vrapčište",
    population: 19842,
    shortDescription: "Cultural diversity in the Polog mountains",
    description:
      "A municipality in the Polog region known for its cultural diversity and multi-ethnic heritage. Vrapčište sits in a mountainous region offering both cultural exploration and natural beauty. The area is characterized by traditional customs, historic monasteries, and stunning mountain scenery.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Vrapčište Monastery, Šar Mountain, Cultural Sites, Mountain Trails, Villages",
  },
  {
    code: "mk-14",
    name: "Gevgelija",
    population: 21582,
    shortDescription: "Border town gateway with thermal springs",
    description:
      "A border town in southeastern Macedonia known as a gateway to Greece and famous for its natural thermal springs. Gevgelija offers relaxation at spa facilities and serves as an important transit point. The nearby Lake Dojran provides recreational opportunities in a scenic setting.",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500",
    placesToVisit:
      "Smrdliva Voda Spa, Dojran Lake, Beach Resorts, Border Museums, Thermal Centers",
  },
  {
    code: "mk-15",
    name: "Gostivar",
    population: 59770,
    shortDescription: "Gateway to Mavrovo and mountain adventure",
    description:
      "A multi-ethnic city in the Polog valley serving as the gateway to Mavrovo National Park. Gostivar is a vibrant urban center with markets, cultural sites, and excellent access to mountain activities. The city balances urban amenities with proximity to pristine natural areas.",
    image: "https://images.unsplash.com/photo-1564594262-ab06888ba43f?w=500",
    placesToVisit:
      "Mavrovo Lake, Bigorski Monastery, Old Bazaar, Mountain Trails, National Park",
  },
  {
    code: "mk-16",
    name: "Gradsko",
    population: 3233,
    shortDescription: "Peaceful rural community in southeastern Macedonia",
    description:
      "A small municipality in southeastern Macedonia with a peaceful, rural character. Gradsko maintains traditional agricultural practices and village life, offering visitors a quiet retreat and authentic experience of village Macedonia. The area is known for its peaceful atmosphere and agricultural heritage.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Gradsko Monastery, Rural Landscapes, Local Markets, Agricultural Lands, Villages",
  },
  {
    code: "mk-17",
    name: "Debar",
    population: 15412,
    shortDescription: "Lake town with monastic treasures and craft traditions",
    description:
      "A scenic town near beautiful Debar Lake, renowned for its woodcarving traditions and important monasteries. Debar combines natural beauty with cultural heritage, offering visitors opportunities to appreciate traditional crafts and spiritual sites. The town serves as a base for exploring nearby lakes and mountains.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Debar Lake, Saint George Monastery, Rajcica Monastery, Craft Workshops, Scenic Views",
  },
  {
    code: "mk-18",
    name: "Delčevo",
    population: 13585,
    shortDescription: "Mining region with mountain heritage",
    description:
      "A municipality in eastern Macedonia with a significant mining industry heritage. Delčevo is surrounded by mountains and offers insight into mining history and mountain culture. The region provides hiking opportunities and connections to the industrial heritage that shaped local development.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Delčevo Mines, Mountain Trails, Mining Museum, Mountain Villages, Scenic Vistas",
  },
  {
    code: "mk-19",
    name: "Demir Hisar",
    population: 7260,
    shortDescription: "Mountainous fortress region with medieval heritage",
    description:
      "A municipality in southwestern Macedonia characterized by mountainous landscapes and medieval fortifications. Demir Hisar offers hikers and history enthusiasts access to mountain trails, traditional villages, and remnants of historical fortresses. The region showcases how Macedonia's geography influenced settlement patterns.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Demir Hisar Fortress, Mountain Villages, Hiking Routes, Medieval Sites, Viewpoints",
  },
  {
    code: "mk-20",
    name: "Demir Kapija",
    population: 3777,
    shortDescription: "Dramatic river gorge with ancient significance",
    description:
      "A small municipality in southeastern Macedonia known for its dramatic river gorge and historical significance. Demir Kapija sits at a strategic point on the Vardar River, offering stunning geological formations and ancient ruins. The gorge provides a spectacular landscape for adventure seekers.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Demir Kapija Gorge, Ancient Ruins, River Views, Scenic Hikes, Geological Sites",
  },
  {
    code: "mk-21",
    name: "Dolneni",
    population: 13126,
    shortDescription: "Agricultural farming community in Polog",
    description:
      "A municipality in the Polog region with a strong focus on agriculture and farming. Dolneni maintains traditional agricultural practices and rural customs. The region offers visitors insight into Macedonia's agricultural heritage and rural lifestyle.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Dolneni Monastery, Rural Areas, Local Farms, Agricultural Museums, Villages",
  },
  {
    code: "mk-22",
    name: "Željino",
    population: 18988,
    shortDescription: "Multi-ethnic community with diverse cultural heritage",
    description:
      "A municipality in the Polog region with diverse communities and rich cultural heritage. Željino represents Macedonia's multicultural character with various traditions and customs. The area offers cultural exploration and mountain scenery combined.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Željino Monastery, Cultural Sites, Mountain Views, Traditional Crafts, Villages",
  },
  {
    code: "mk-23",
    name: "Zelenikovo",
    population: 3361,
    shortDescription: "Suburban Skopje area with monasteries",
    description:
      "A municipality in the Skopje region with suburban character. Zelenikovo serves as a residential area for Skopje commuters while maintaining its own identity and monastic heritage. The area offers peaceful surroundings and access to nature trails.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Zelenikovo Monastery, Suburban Areas, Nature Trails, Parks, Day-trip Destinations",
  },
  {
    code: "mk-24",
    name: "Zrnovci",
    population: 2086,
    shortDescription: "Wine-producing village in southeast Macedonia",
    description:
      "A small municipality in southeastern Macedonia with a focus on agriculture and wine production. Zrnovci is known for its vineyards and traditional winemaking. The village maintains authentic rural character while producing quality local wines.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Zrnovci Monastery, Rural Areas, Local Vineyards, Wine Cellars, Agricultural Areas",
  },
  {
    code: "mk-25",
    name: "Ilinden",
    population: 17435,
    shortDescription: "Industrial and residential Skopje suburb",
    description:
      "A municipality in the Skopje region with industrial heritage and residential areas. Ilinden serves as an important residential area and manufacturing center. The area contains historical monuments commemorating Macedonia's revolutionary heritage.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Industrial Sites, Residential Areas, Local Parks, Historical Monuments, Museums",
  },
  {
    code: "mk-26",
    name: "Jegunovce",
    population: 8895,
    shortDescription: "Traditional Polog village with monastic heritage",
    description:
      "A municipality in the Polog region with traditional villages and cultural heritage. Jegunovce maintains authentic Macedonian customs and monastic traditions. The area offers insight into mountain village life and spiritual heritage.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Jegunovce Monastery, Mountain Villages, Cultural Heritage, Traditional Crafts, Nature",
  },
  {
    code: "mk-27",
    name: "Kavadarci",
    population: 35733,
    shortDescription: "Heart of Macedonia's famous Tikveš wine region",
    description:
      "The center of Macedonia's celebrated Tikveš wine region, surrounded by vineyards and wineries. Kavadarci is the wine capital of Macedonia, offering wine tastings, vineyard tours, and cellar visits. The region produces some of the finest Macedonian wines and provides deep cultural experience.",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=500",
    placesToVisit:
      "Tikveš Wine Region, Wineries, Wine Tastings, Stobi Archaeological Site, Vineyards",
  },
  {
    code: "mk-28",
    name: "Karbinci",
    population: 3420,
    shortDescription: "Small agricultural village in eastern Macedonia",
    description:
      "A small municipality in eastern Macedonia with strong agricultural traditions. Karbinci maintains traditional farming practices and village customs. The area is known for its produce and rural character.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Karbinci Monastery, Rural Landscapes, Local Farms, Agricultural Museum, Villages",
  },
  {
    code: "mk-29",
    name: "Kičevo",
    population: 39669,
    shortDescription: "Mountain gateway to Mavrovo National Park",
    description:
      "A town in southwestern Macedonia surrounded by mountains and forests. Kičevo serves as a gateway to Mavrovo National Park and offers excellent access to natural attractions. The town balances urban amenities with proximity to wilderness and outdoor activities.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500",
    placesToVisit:
      "Bigorski Monastery, Mavrovo National Park, Mountain Trails, Lakes, Scenic Areas",
  },
  {
    code: "mk-30",
    name: "Kočani",
    population: 31602,
    shortDescription: "Rice farming region with beautiful countryside",
    description:
      "Known for its rice production and beautiful natural surroundings in eastern Macedonia. Kočani is the rice basket of Macedonia, where traditional rice farming has been practiced for centuries. The region offers scenic countryside and agricultural heritage sites.",
    image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=500",
    placesToVisit:
      "Zrze Monastery, Morodvis Village, Rice Fields, Agricultural Museums, Scenic Routes",
  },
  {
    code: "mk-31",
    name: "Konče",
    population: 2725,
    shortDescription: "Rural village in southeastern Macedonia",
    description:
      "A small municipality in southeastern Macedonia with a rural character. Konče maintains traditional village life and agricultural practices. The area offers a peaceful retreat and authentic village experience.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Konče Monastery, Rural Areas, Agricultural Lands, Traditional Villages, Nature",
  },
  {
    code: "mk-32",
    name: "Kratovo",
    population: 7545,
    shortDescription: "Medieval fortress town with historic charm",
    description:
      "A municipality in eastern Macedonia renowned for its medieval fortress and historic significance. Kratovo sits atop strategic hills and offers visitors a journey into Macedonia's feudal past. The town preserves medieval architecture and offers mountain views.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Kratovo Fortress, Medieval Town, Mountain Views, Historic Sites, Local Museums",
  },
  {
    code: "mk-33",
    name: "Kriva Palanka",
    population: 18059,
    shortDescription: "Mountain town near Osogovo Mountains",
    description:
      "A municipality in eastern Macedonia with mountainous terrain and access to the stunning Osogovo Mountains. Kriva Palanka serves as a base for mountain exploration and offers outdoor activities. The town combines mountain lifestyle with cultural heritage.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Kriva Palanka Monastery, Mountain Trails, Osogovo Mountains, Mountain Peaks, Scenic Views",
  },
  {
    code: "mk-34",
    name: "Krivogaštani",
    population: 5167,
    shortDescription: "Mountain village in southwestern Macedonia",
    description:
      "A municipality in southwestern Macedonia with traditional villages set in mountainous terrain. Krivogaštani maintains authentic village customs and monastic traditions. The area offers mountain scenery and cultural heritage.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Krivogaštani Monastery, Traditional Villages, Mountain Views, Hiking Routes, Nature",
  },
  {
    code: "mk-35",
    name: "Kruševo",
    population: 8385,
    shortDescription: "Historic revolutionary town on the mountain",
    description:
      "A municipality in southwestern Macedonia known for its revolutionary history and mountain location. Kruševo hosted the famous Kruševo Republic and maintains strong historical significance. The town offers mountain views and revolutionary heritage sites.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Kruševo Republic Memorial, Mountain Views, Historical Sites, Revolutionary Museum, Viewpoints",
  },
  {
    code: "mk-36",
    name: "Kumanovo",
    population: 98104,
    shortDescription: "Third largest city with industrial heritage",
    description:
      "The third largest city in Macedonia, known for its industrial heritage and cultural diversity. Kumanovo serves as an important economic and cultural center in northeastern Macedonia. The city combines industrial significance with cultural attractions and regional importance.",
    image: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=500",
    placesToVisit:
      "Staro Nagorichane Monastery, Konjuh Mountain, City Park, Museums, Old Town",
  },
  {
    code: "mk-37",
    name: "Lipkovo",
    population: 22308,
    shortDescription: "Multi-ethnic community in the Polog region",
    description:
      "A municipality in the Polog region with diverse communities and multicultural character. Lipkovo represents Macedonia's ethnic diversity and cultural coexistence. The area offers cultural exploration and mountain landscapes.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Lipkovo Monastery, Cultural Sites, Mountain Landscapes, Traditional Crafts, Villages",
  },
  {
    code: "mk-38",
    name: "Lozovo",
    population: 2264,
    shortDescription: "Wine village in southeastern Macedonia",
    description:
      "A small municipality in southeastern Macedonia with wine production heritage. Lozovo is known for its vineyards and wine cellars. The village maintains agricultural traditions and produces quality local wines.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Lozovo Monastery, Rural Areas, Local Vineyards, Wine Cellars, Agricultural Lands",
  },
  {
    code: "mk-39",
    name: "Mavrovo i Rostuša",
    population: 5042,
    shortDescription: "Gateway to Macedonia's premier national park",
    description:
      "A municipality in southwestern Macedonia serving as gateway to the famous Mavrovo National Park. The area is known for its pristine natural environment with mountain lakes and ski facilities. Mavrovo offers year-round outdoor activities and nature exploration.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Mavrovo National Park, Mountain Lakes, Ski Resorts, Hiking Trails, Scenic Views",
  },
  {
    code: "mk-40",
    name: "Makedonska Kamenica",
    population: 6439,
    shortDescription: "Mining area with mountain character",
    description:
      "A municipality in eastern Macedonia with mining heritage and mountain character. Makedonska Kamenica is surrounded by mountains offering hiking opportunities. The area combines industrial heritage with natural beauty.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Mining Sites, Mountain Trails, Local Museums, Mining Heritage, Scenic Areas",
  },
  {
    code: "mk-41",
    name: "Makedonski Brod",
    population: 5889,
    shortDescription: "Mountain valley with monastic heritage",
    description:
      "A municipality in southwestern Macedonia with scenic mountain valleys and monastic heritage. Makedonski Brod offers beautiful landscapes and spiritual sites. The area is known for its monastery and river valleys.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Makedonski Brod Monastery, Mountain Views, River Valleys, Hiking Routes, Nature",
  },
  {
    code: "mk-42",
    name: "Mogila",
    population: 5283,
    shortDescription: "Agricultural village with monastic tradition",
    description:
      "A municipality in southeastern Macedonia with strong agricultural traditions. Mogila maintains rural customs and monastic heritage. The area is known for its produce and peaceful village character.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Mogila Monastery, Rural Landscapes, Local Markets, Agricultural Areas, Villages",
  },
  {
    code: "mk-43",
    name: "Negotino",
    population: 18194,
    shortDescription: "Wine town with ancient archaeological sites",
    description:
      "A wine-producing town in the famous Tikveš region with significant archaeological heritage. Negotino is located near Stobi, one of Macedonia's most important ancient cities. The town combines wine culture with ancient history exploration.",
    image: "https://images.unsplash.com/photo-1510133768164-a8f7e4d4e3dc?w=500",
    placesToVisit:
      "Tikveš Vineyards, Stobi Ancient City, Wine Cellars, Tasting Rooms, Archaeological Sites",
  },
  {
    code: "mk-44",
    name: "Novaci",
    population: 2648,
    shortDescription: "Mountain monastery village",
    description:
      "A small municipality in southwestern Macedonia with mountainous terrain and monastic significance. Novaci maintains traditional village life in mountain setting. The area offers mountain scenery and spiritual heritage.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Novaci Monastery, Mountain Villages, Hiking Trails, Scenic Views, Nature",
  },
  {
    code: "mk-45",
    name: "Novo Selo",
    population: 6972,
    shortDescription: "Border region with monastic sites",
    description:
      "A municipality in southeastern Macedonia located near the national border. Novo Selo serves as a border community with historical and monastic significance. The area offers cultural heritage and rural character.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Novo Selo Monastery, Border Areas, Rural Landscapes, Historical Sites, Villages",
  },
  {
    code: "mk-46",
    name: "Ohrid",
    population: 51428,
    shortDescription:
      "UNESCO World Heritage lakeside gem with ancient heritage",
    description:
      "A UNESCO World Heritage site on the shores of Lake Ohrid, one of Europe's oldest and deepest lakes. Ohrid is a living museum combining natural beauty with centuries of cultural heritage. The city features ancient theaters, monasteries, and stunning lakeside architecture that showcase layers of history from Macedonia's past.",
    image: "https://images.unsplash.com/photo-1585352650193-d7154b0c1b1d?w=500",
    placesToVisit:
      "Lake Ohrid, Saint Naum Monastery, Ancient Theatre, Samuel's Fortress, Old Town, Museums",
  },
  {
    code: "mk-47",
    name: "Pehčevo",
    population: 3983,
    shortDescription: "Mountain mining town with industrial heritage",
    description:
      "A municipality in eastern Macedonia with mining traditions and mountain setting. Pehčevo combines industrial heritage with natural mountain landscape. The area offers insight into Macedonia's mining history.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Pehčevo Mines, Mountain Landscapes, Local Museums, Mining Heritage, Scenic Routes",
  },
  {
    code: "mk-48",
    name: "Petrovec",
    population: 9150,
    shortDescription: "Suburban Skopje area with monastery",
    description:
      "A municipality in the Skopje region with suburban character serving as residential area for the capital. Petrovec maintains its own identity with monastic heritage. The area offers convenient access to Skopje with peaceful surroundings.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Petrovec Monastery, Suburban Areas, Nature Trails, Parks, Day-trip Destinations",
  },
  {
    code: "mk-49",
    name: "Plasnica",
    population: 4222,
    shortDescription: "Mountain monastery village in southwest",
    description:
      "A small municipality in southwestern Macedonia with mountainous terrain and monastic heritage. Plasnica maintains traditional village customs in a mountain setting. The area offers mountain scenery and cultural heritage.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Plasnica Monastery, Mountain Villages, Hiking Routes, Scenic Views, Nature Trails",
  },
  {
    code: "mk-50",
    name: "Prilep",
    population: 69025,
    shortDescription: "Tobacco city with medieval towers and spiritual sites",
    description:
      "Famous for its tobacco production and medieval towers perched dramatically on granite rocks. Prilep is a major industrial city with strong cultural heritage, featuring monasteries, museums, and unique rock formations. The city combines urban energy with historical significance.",
    image: "https://images.unsplash.com/photo-1580837119756-563d608dd119?w=500",
    placesToVisit:
      "Marko's Towers, Treskavec Monastery, Clock Tower, Museums, Rock Formations",
  },
  {
    code: "mk-51",
    name: "Probištip",
    population: 13417,
    shortDescription: "Industrial mining town in eastern Macedonia",
    description:
      "A municipality in eastern Macedonia with significant industrial and mining heritage. Probištip serves as an industrial center with surrounding mountains providing natural scenery. The area offers insight into Macedonia's mineral resources.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Probištip Mines, Industrial Sites, Mountain Views, Mining Museum, Heritage Sites",
  },
  {
    code: "mk-52",
    name: "Radoviš",
    population: 24122,
    shortDescription: "Agricultural town on Plačkovica Mountain",
    description:
      "A small town in southeastern Macedonia with agricultural traditions and mountain location. Radoviš is situated near the scenic Plačkovica Mountain, offering natural beauty and rural character. The area maintains agricultural heritage.",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500",
    placesToVisit:
      "Church of Saint George, Plačkovica Mountain, Agricultural Areas, Scenic Routes, Villages",
  },
  {
    code: "mk-53",
    name: "Rankovce",
    population: 3465,
    shortDescription: "Rural village in northeastern Macedonia",
    description:
      "A small municipality in northeastern Macedonia with rural character and agricultural focus. Rankovce maintains traditional village life and farming practices. The area offers peaceful countryside experience.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Rankovce Monastery, Rural Areas, Agricultural Lands, Traditional Villages, Nature",
  },
  {
    code: "mk-54",
    name: "Resen",
    population: 14373,
    shortDescription: "Mountain town with lake views",
    description:
      "A municipality in southwestern Macedonia with lake views and mountain setting. Resen sits near scenic lakes and offers mountain activities. The area combines natural beauty with monastic heritage.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Resen Lake, Mountain Views, Local Monasteries, Scenic Routes, Hiking Trails",
  },
  {
    code: "mk-55",
    name: "Rosoman",
    population: 3796,
    shortDescription: "Wine village in southeastern Macedonia",
    description:
      "A small municipality in southeastern Macedonia known for wine production. Rosoman maintains agricultural traditions with focus on viticulture. The village is known for quality local wines.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Rosoman Monastery, Rural Landscapes, Local Vineyards, Wine Cellars, Agricultural Areas",
  },
  {
    code: "mk-56",
    name: "Sopište",
    population: 6713,
    shortDescription: "Polog mountain village with traditions",
    description:
      "A municipality in the Polog region with traditional village character. Sopište maintains authentic Macedonian customs and monastic heritage. The area offers cultural experience in mountain setting.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Sopište Monastery, Mountain Villages, Cultural Sites, Traditional Crafts, Nature",
  },
  {
    code: "mk-57",
    name: "Staro Nagoričane",
    population: 3501,
    shortDescription: "Historic northeast with monastic significance",
    description:
      "A municipality in northeastern Macedonia with significant historical sites and monastic heritage. Staro Nagoričane features important medieval monastery and ruins. The area offers historical exploration and mountain scenery.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Staro Nagoričane Monastery, Historical Ruins, Mountain Views, Medieval Sites, Nature",
  },
  {
    code: "mk-58",
    name: "Struga",
    population: 50980,
    shortDescription: "Resort town on Lake Ohrid with literary tradition",
    description:
      "A resort town on Lake Ohrid, famous for its prestigious annual poetry festival and crystal clear springs. Struga combines beach resort amenities with cultural significance. The town serves as a popular destination for water activities and literary events.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500",
    placesToVisit:
      "Lake Ohrid Beach, Drim River, Poetry Bridge, Museums, Cultural Centers",
  },
  {
    code: "mk-59",
    name: "Strumica",
    population: 49995,
    shortDescription: "Carnival city with thermal springs",
    description:
      "Located in southeastern Macedonia, Strumica is known internationally for its carnival traditions and famous hot springs. The city combines cultural celebration with therapeutic thermal facilities. The area offers unique cultural experiences and health tourism.",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500",
    placesToVisit:
      "Vodoca Monastery, Bansko Village, Strumica Carnival, Thermal Springs, Museums",
  },
  {
    code: "mk-60",
    name: "Studeničani",
    population: 21970,
    shortDescription: "Suburban Skopje area with monastery",
    description:
      "A municipality in the Skopje region with suburban character serving as residential extension of the capital. Studeničani has monastic heritage and offers peaceful surroundings. The area provides convenient access to Skopje.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Studeničani Monastery, Suburban Areas, Nature Trails, Parks, Day-trip Destinations",
  },
  {
    code: "mk-61",
    name: "Štip",
    population: 44866,
    shortDescription: "Cultural center with carnival traditions",
    description:
      "An important economic and cultural center in eastern Macedonia, known for its vibrant carnival traditions. Štip serves as a major regional hub with historical sites and modern amenities. The city combines cultural significance with contemporary urban life.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
    placesToVisit:
      "Isar Fortress, Bezisten, Church of Saint Nicholas, Museums, Old Town",
  },
  {
    code: "mk-62",
    name: "Tearce",
    population: 17694,
    shortDescription: "Multicultural Polog community",
    description:
      "A municipality in the Polog region with diverse communities and multicultural heritage. Tearce represents Macedonia's ethnic diversity. The area offers cultural exploration combined with mountain landscapes.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Tearce Monastery, Cultural Sites, Mountain Landscapes, Traditional Crafts, Villages",
  },
  {
    code: "mk-63",
    name: "Tetovo",
    population: 84770,
    shortDescription: "Mountain city with colorful Painted Mosque",
    description:
      "A picturesque city at the foot of Šar Mountain, internationally recognized for its colorful Painted Mosque (Sarena Dzamija). Tetovo combines spiritual significance with stunning mountain location and multicultural heritage. The city offers cultural richness and natural beauty.",
    image: "https://images.unsplash.com/photo-1601485066411-fde4b8f8e3d3?w=500",
    placesToVisit:
      "Painted Mosque, Tetovo Fortress, Šar Mountain, Museums, Old Bazaar",
  },
  {
    code: "mk-64",
    name: "Centar Župa",
    population: 3720,
    shortDescription: "Mountain monastery village",
    description:
      "A small municipality in southwestern Macedonia with mountainous terrain and monastic heritage. Centar Župa maintains traditional village customs in mountain setting. The area offers mountain scenery and spiritual heritage.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Centar Župa Monastery, Mountain Villages, Hiking Trails, Scenic Views, Nature",
  },
  {
    code: "mk-65",
    name: "Čaška",
    population: 7942,
    shortDescription: "Vardar valley agricultural community",
    description:
      "A municipality in the Vardar region with agricultural traditions. Čaška maintains farming practices and rural customs. The area is known for agricultural production.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Čaška Monastery, Rural Areas, River Valleys, Agricultural Lands, Villages",
  },
  {
    code: "mk-66",
    name: "Češinovo-Obleševo",
    population: 5471,
    shortDescription: "Eastern mining municipality",
    description:
      "A municipality in eastern Macedonia with mining heritage and mountain character. Česinovo-Obleševo combines industrial history with natural surroundings. The area offers mining heritage exploration.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Česinovo Monastery, Mining Sites, Mountain Trails, Heritage Sites, Scenic Areas",
  },
  {
    code: "mk-67",
    name: "Čučer Sandevo",
    population: 9200,
    shortDescription: "Suburban Skopje with monastic heritage",
    description:
      "A municipality in the Skopje region with suburban character. Čučer Sandevo maintains monastic heritage while serving as residential area. The area offers peaceful surroundings near the capital.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Čučer Monastery, Suburban Areas, Nature Trails, Parks, Day-trip Destinations",
  },
  {
    code: "mk-68",
    name: "Debarca",
    population: 3719,
    shortDescription: "Lakeside village near Ohrid",
    description:
      "A small municipality near Ohrid with rural villages and natural scenery. Debarca offers access to Lake Ohrid and maintains traditional village character. The area combines natural beauty with peaceful lifestyle.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Local Villages, Scenic Views, Traditional Churches, Lake Access, Nature",
  },
  {
    code: "mk-69",
    name: "Sveti Nikole",
    population: 15320,
    shortDescription: "Central Macedonian agricultural hub",
    description:
      "A municipality in central Macedonia known for agriculture and historical sites. Sveti Nikole serves as an agricultural center with recreational facilities. The area maintains rural character while offering modern services.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Boshkov Most Reservoir, Local Markets, Historic Churches, Agricultural Areas, Villages",
  },
  {
    code: "mk-70",
    name: "Dojran",
    population: 3084,
    shortDescription: "Lake town with beach resort character",
    description:
      "A small southeastern municipality on beautiful Lake Dojran, known for its beach resorts and fishing traditions. Dojran offers water-based activities and serves as a relaxation destination. The town combines resort amenities with authentic fishing village character.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    placesToVisit:
      "Lake Dojran, Beach Resorts, Local Fish Restaurants, Water Sports, Scenic Views",
  },
  {
    code: "mk-71",
    name: "Skopje",
    population: 526502,
    shortDescription: "Capital city - political, cultural and economic hub",
    description:
      "The capital and largest city of Macedonia, located on the Vardar River. Skopje is a vibrant metropolis combining ancient history with modern development. The city serves as the nation's political, economic, and cultural center, offering museums, theaters, markets, and monuments that showcase Macedonia's rich heritage and contemporary dynamism.",
    image: "https://images.unsplash.com/photo-1622495589041-64b01885f76d?w=500",
    placesToVisit:
      "Stone Bridge, Old Bazaar, Kale Fortress, Macedonia Square, Museums, Theaters",
  },
];

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Clear existing regions
    await db.delete(regions);
    console.log("🗑️  Cleared existing regions");

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
    console.error("Seed failed:", error);
    process.exit(1);
  });
