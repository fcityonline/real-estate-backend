import bcrypt from "bcrypt";
import prisma from "./lib/prisma.js";

const makeSlug = (title, city) =>
  `${title}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const listings = [
  {
    title: "Modern 3BHK Apartment in Sector 21C",
    price: 22000,
    address: "House No. 1456, Sector 21C, Faridabad, Haryana",
    city: "Faridabad",
    latitude: "28.4089",
    longitude: "77.3178",
    bedroom: 3,
    bathroom: 2,
    type: "rent",
    property: "apartment",
    images: [
      "https://images.pexels.com/photos/3736153/pexels-photo-3736153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    postDetail: {
      desc:
        "Spacious and well-ventilated 3BHK apartment available for rent in a prime location of Sector 21C. The property includes modular kitchen, 24/7 water supply, parking space, and is close to schools, markets, and public transport.",
      utilities: "owner",
      pet: "allowed",
      income: "Minimum monthly income ₹50,000 required",
      size: 1350,
      school: 500,
      bus: 200,
      restaurant: 300,
    },
  },
  {
    title: "Spacious 2BHK Apartment Near Sector 10 Market",
    price: 18000,
    address: "Plot 92, Sector 10, Faridabad, Haryana",
    city: "Faridabad",
    latitude: "28.4220",
    longitude: "77.3260",
    bedroom: 2,
    bathroom: 2,
    type: "rent",
    property: "apartment",
    images: [
      "https://images.pexels.com/photos/2061260/pexels-photo-2061260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    postDetail: {
      desc:
        "Bright and airy 2BHK apartment located near Sector 10 market with easy access to public transport, schools, and shopping. Ideal for families or professionals.",
      utilities: "owner",
      pet: "allowed",
      income: "Minimum monthly income ₹40,000 required",
      size: 1050,
      school: 400,
      bus: 150,
      restaurant: 250,
    },
  },
  {
    title: "Luxury 4BHK Penthouse in Sector 12",
    price: 38000,
    address: "Floor 7, Tower A, Sector 12, Faridabad, Haryana",
    city: "Faridabad",
    latitude: "28.3945",
    longitude: "77.3201",
    bedroom: 4,
    bathroom: 3,
    type: "rent",
    property: "apartment",
    images: [
      "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    postDetail: {
      desc:
        "Premium 4BHK penthouse with high-end finishes, panoramic windows, and private balcony. Perfect for those looking for luxury rental living in Faridabad.",
      utilities: "owner",
      pet: "allowed",
      income: "Minimum monthly income ₹85,000 required",
      size: 2200,
      school: 600,
      bus: 300,
      restaurant: 350,
    },
  },
  {
    title: "Cozy 1BHK Studio Near Metro Station",
    price: 12000,
    address: "11A, Sector 7, Faridabad, Haryana",
    city: "Faridabad",
    latitude: "28.4336",
    longitude: "77.3121",
    bedroom: 1,
    bathroom: 1,
    type: "rent",
    property: "apartment",
    images: [
      "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    postDetail: {
      desc:
        "Compact and affordable 1BHK studio apartment walking distance from the metro station, with modern amenities and a quiet neighborhood.",
      utilities: "owner",
      pet: "allowed",
      income: "Minimum monthly income ₹30,000 required",
      size: 650,
      school: 300,
      bus: 100,
      restaurant: 200,
    },
  },
  {
    title: "Family-Friendly 3BHK Apartment in Sector 15",
    price: 24000,
    address: "Block C-12, Sector 15, Faridabad, Haryana",
    city: "Faridabad",
    latitude: "28.3989",
    longitude: "77.3145",
    bedroom: 3,
    bathroom: 2,
    type: "rent",
    property: "apartment",
    images: [
      "https://images.pexels.com/photos/276551/pexels-photo-276551.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    postDetail: {
      desc:
        "Well-maintained family apartment close to parks and schools, featuring a large living area, balcony, and secure residential community.",
      utilities: "owner",
      pet: "allowed",
      income: "Minimum monthly income ₹50,000 required",
      size: 1450,
      school: 450,
      bus: 220,
      restaurant: 280,
    },
  },
  {
    title: "Bright 2BHK Apartment with Balcony",
    price: 20000,
    address: "A-34, Sector 18, Faridabad, Haryana",
    city: "Faridabad",
    latitude: "28.4033",
    longitude: "77.2993",
    bedroom: 2,
    bathroom: 2,
    type: "rent",
    property: "apartment",
    images: [
      "https://images.pexels.com/photos/3736125/pexels-photo-3736125.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/3768124/pexels-photo-3768124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    postDetail: {
      desc:
        "Light-filled 2BHK apartment with a spacious balcony and modern kitchen, located in a quiet residential block with easy transport access.",
      utilities: "owner",
      pet: "allowed",
      income: "Minimum monthly income ₹45,000 required",
      size: 1150,
      school: 350,
      bus: 180,
      restaurant: 260,
    },
  },
  {
    title: "Elegant 3BHK Apartment with Pool Access",
    price: 32000,
    address: "Skyview Tower, Sector 16, Faridabad, Haryana",
    city: "Faridabad",
    latitude: "28.3950",
    longitude: "77.3209",
    bedroom: 3,
    bathroom: 3,
    type: "rent",
    property: "apartment",
    images: [
      "https://images.pexels.com/photos/279719/pexels-photo-279719.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    postDetail: {
      desc:
        "Premium 3BHK apartment with pool access, security, and excellent community amenities, perfect for upscale rental living.",
      utilities: "owner",
      pet: "allowed",
      income: "Minimum monthly income ₹72,000 required",
      size: 1850,
      school: 520,
      bus: 310,
      restaurant: 400,
    },
  },
  {
    title: "Furnished 1BHK Near Delhi Public School",
    price: 14000,
    address: "115, Sector 19C, Faridabad, Haryana",
    city: "Faridabad",
    latitude: "28.4248",
    longitude: "77.3272",
    bedroom: 1,
    bathroom: 1,
    type: "rent",
    property: "apartment",
    images: [
      "https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    postDetail: {
      desc:
        "Fully furnished 1BHK apartment in a prime school district, with all utilities and a modern kitchenette included.",
      utilities: "owner",
      pet: "allowed",
      income: "Minimum monthly income ₹35,000 required",
      size: 700,
      school: 150,
      bus: 120,
      restaurant: 180,
    },
  },
  {
    title: "Premium 4BHK Apartment with Gym and Clubhouse",
    price: 42000,
    address: "Oasis Residency, Sector 20, Faridabad, Haryana",
    city: "Faridabad",
    latitude: "28.4142",
    longitude: "77.3331",
    bedroom: 4,
    bathroom: 4,
    type: "rent",
    property: "apartment",
    images: [
      "https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    postDetail: {
      desc:
        "Spacious 4BHK apartment with access to gym, clubhouse, and premium community services, set in a well-maintained high-rise tower.",
      utilities: "owner",
      pet: "allowed",
      income: "Minimum monthly income ₹95,000 required",
      size: 2400,
      school: 600,
      bus: 390,
      restaurant: 420,
    },
  },
  {
    title: "Affordable 2BHK Apartment Near Bus Stand",
    price: 16000,
    address: "55, Sector 21D, Faridabad, Haryana",
    city: "Faridabad",
    latitude: "28.4110",
    longitude: "77.3190",
    bedroom: 2,
    bathroom: 1,
    type: "rent",
    property: "apartment",
    images: [
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    postDetail: {
      desc:
        "Budget-friendly 2BHK apartment close to the bus stand, offering a comfortable living environment for young families or professionals.",
      utilities: "owner",
      pet: "allowed",
      income: "Minimum monthly income ₹35,000 required",
      size: 980,
      school: 500,
      bus: 60,
      restaurant: 140,
    },
  },
];

try {
  const hashedPassword = await bcrypt.hash("aku@123", 10);

  const user = await prisma.user.upsert({
    where: { username: "aku" },
    update: {
      email: "aku@email",
      role: "BUYER",
    },
    create: {
      username: "aku",
      email: "aku@email",
      password: hashedPassword,
      role: "BUYER",
      chatIDs: [],
    },
  });

  for (const listing of listings) {
    const slug = makeSlug(listing.title, listing.city);

    await prisma.post.upsert({
      where: { slug },
      update: {
        price: listing.price,
        address: listing.address,
        city: listing.city,
        latitude: listing.latitude,
        longitude: listing.longitude,
        bedroom: listing.bedroom,
        bathroom: listing.bathroom,
        type: listing.type,
        property: listing.property,
        images: listing.images,
        status: "ACTIVE",
        postDetail: {
          upsert: {
            create: listing.postDetail,
            update: listing.postDetail,
          },
        },
      },
      create: {
        title: listing.title,
        slug,
        price: listing.price,
        address: listing.address,
        city: listing.city,
        latitude: listing.latitude,
        longitude: listing.longitude,
        bedroom: listing.bedroom,
        bathroom: listing.bathroom,
        type: listing.type,
        property: listing.property,
        images: listing.images,
        status: "ACTIVE",
        userId: user.id,
        postDetail: {
          create: listing.postDetail,
        },
      },
    });
  }

  console.log("Seed completed successfully.");
} catch (error) {
  console.error("Seed failed:", error);
} finally {
  await prisma.$disconnect();
}
