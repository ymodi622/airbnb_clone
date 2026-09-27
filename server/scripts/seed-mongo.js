'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../src/config/env');
const User = require('../src/models/User');
const Listing = require('../src/models/Listing');
const Wishlist = require('../src/models/Wishlist');

async function seed() {
  try {
    console.log(`[seed] Connecting to MongoDB: ${config.mongoUri}`);
    await mongoose.connect(config.mongoUri);

    // 1. Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Wishlist.deleteMany({});
    console.log('[seed] Cleared old collections.');

    // 2. Create Default User (root@solstice.com / root1234)
    const password_hash = await bcrypt.hash('root1234', 12);
    const user = await User.create({
      email: 'root@solstice.com',
      password_hash,
    });
    console.log(`[seed] User created: ${user.email}`);

    // 3. Create Listing — Candolim Goa property
    // Photos ordered strictly by ROOM_ORDER:
    // Living room → Kitchen → Bedroom → Bathroom → Pool → Gym → Exterior → Other
    const listing = await Listing.create({
      numericId: 1,
      title: 'Romantic Jacuzzi 1BHK Candolim | Mirashya UG10',
      subtitle: 'Entire serviced apartment in Candolim, India',
      description:
        '🌴 Plan Your Relaxing Holiday at Amor De Goa by Mirashya Homes! ✨ Stay in this cozy 1BHK in the heart of Candolim, featuring a private jacuzzi 🛁 for the perfect unwind. Enjoy high-speed WiFi 💻, Smart TV 📺, pet-friendly comfort 🐾, and stylish interiors. Just minutes from Candolim Beach 🏖️, popular cafés, restaurants, and nightlife 🍹, it\'s ideal for couples or small families.',
      property_type: 'Serviced apartment',
      location: 'Candolim, Goa, India',
      price_per_night: 4500,
      guests: 3,
      bedrooms: 1,
      beds: 1,
      baths: 1,
      rating: 4.95,
      review_count: 124,
      host_name: 'Mirashya Homes',
      host_since: 2023,
      host_is_superhost: true,
      photos: [
        // Living room (sort_order 0–9)
        { url: '/images/lr1.jpeg',  room_label: 'Living room', caption: 'Open-plan living and dining area',       sort_order: 0  },
        { url: '/images/lr2.jpeg',  room_label: 'Living room', caption: 'Cosy living room with warm accents',     sort_order: 1  },
        { url: '/images/lr3.jpeg',  room_label: 'Living room', caption: 'Sunlit lounge with tropical plants',     sort_order: 2  },
        { url: '/images/lr4.jpeg',  room_label: 'Living room', caption: 'Living room – evening ambiance',         sort_order: 3  },
        { url: '/images/lr5.jpeg',  room_label: 'Living room', caption: 'Dining nook with artisan furnishings',   sort_order: 4  },
        { url: '/images/lr6.jpeg',  room_label: 'Living room', caption: 'Reading corner by the window',           sort_order: 5  },
        { url: '/images/lr7.jpeg',  room_label: 'Living room', caption: 'Bright open living space',               sort_order: 6  },
        { url: '/images/lr8.jpeg',  room_label: 'Living room', caption: 'Living room – natural light',            sort_order: 7  },
        { url: '/images/lr9.jpeg',  room_label: 'Living room', caption: 'Relaxed seating with balcony access',    sort_order: 8  },
        { url: '/images/lr10.jpeg', room_label: 'Living room', caption: 'Spacious lounge area',                   sort_order: 9  },
        // Kitchen (sort_order 10–11)
        { url: '/images/k1.jpeg',   room_label: 'Kitchen',     caption: 'Fully equipped modular kitchen',         sort_order: 10 },
        { url: '/images/k2.jpeg',   room_label: 'Kitchen',     caption: 'Kitchen counter with modern appliances', sort_order: 11 },
        // Bedroom (sort_order 12–17)
        { url: '/images/b1.jpeg',   room_label: 'Bedroom',     caption: 'Master bedroom with king bed',           sort_order: 12 },
        { url: '/images/b2.jpeg',   room_label: 'Bedroom',     caption: 'Second bedroom – queen bed',             sort_order: 13 },
        { url: '/images/b3.jpeg',   room_label: 'Bedroom',     caption: 'Third bedroom with wooden accents',      sort_order: 14 },
        { url: '/images/b4.jpeg',   room_label: 'Bedroom',     caption: 'Bedroom with balcony view',              sort_order: 15 },
        { url: '/images/b5.jpeg',   room_label: 'Bedroom',     caption: 'Guest bedroom – cosy and bright',        sort_order: 16 },
        { url: '/images/b6.jpeg',   room_label: 'Bedroom',     caption: 'Bedroom – morning light',                sort_order: 17 },
        // Bathroom (sort_order 18)
        { url: '/images/bh1.jpeg',  room_label: 'Bathroom',    caption: 'En-suite bathroom with rainfall shower', sort_order: 18 },
        // Pool (sort_order 19–21)
        { url: '/images/p1.jpeg',   room_label: 'Pool',        caption: 'Resort-style swimming pool',             sort_order: 19 },
        { url: '/images/p2.jpeg',   room_label: 'Pool',        caption: 'Pool deck with sun loungers',            sort_order: 20 },
        { url: '/images/p3.jpeg',   room_label: 'Pool',        caption: 'Private plunge pool with jacuzzi',       sort_order: 21 },
        // Gym (sort_order 22–26)
        { url: '/images/g1.jpeg',   room_label: 'Gym',         caption: 'Fully equipped fitness centre',          sort_order: 22 },
        { url: '/images/g2.jpeg',   room_label: 'Gym',         caption: 'Cardio machines and free weights',       sort_order: 23 },
        { url: '/images/g3.jpeg',   room_label: 'Gym',         caption: 'Gym – strength training area',           sort_order: 24 },
        { url: '/images/g4.jpeg',   room_label: 'Gym',         caption: 'Open gym floor with equipment',          sort_order: 25 },
        { url: '/images/g5.jpeg',   room_label: 'Gym',         caption: 'Gym – stretching and yoga space',        sort_order: 26 },
        // Exterior (sort_order 27–31)
        { url: '/images/e1.jpeg',   room_label: 'Exterior',    caption: 'Aerial view of the property',            sort_order: 27 },
        { url: '/images/e2.jpeg',   room_label: 'Exterior',    caption: 'Building façade and entrance',           sort_order: 28 },
        { url: '/images/e3.jpeg',   room_label: 'Exterior',    caption: 'Property exterior – sunset view',        sort_order: 29 },
        { url: '/images/e4.jpeg',   room_label: 'Exterior',    caption: 'Garden and outdoor common area',         sort_order: 30 },
        { url: '/images/e5.jpeg',   room_label: 'Exterior',    caption: 'Terrace and surroundings',               sort_order: 31 },
        // Other (sort_order 32–41)
        { url: '/images/a1.jpeg',   room_label: 'Other',       caption: 'Poolside lounge seating',                sort_order: 32 },
        { url: '/images/a2.jpeg',   room_label: 'Other',       caption: 'Additional amenities area',              sort_order: 33 },
        { url: '/images/a3.jpeg',   room_label: 'Other',       caption: 'Property highlights',                    sort_order: 34 },
        { url: '/images/a4.jpeg',   room_label: 'Other',       caption: 'Common area and facilities',             sort_order: 35 },
        { url: '/images/a5.jpeg',   room_label: 'Other',       caption: 'Additional photo',                       sort_order: 36 },
        { url: '/images/a6.jpeg',   room_label: 'Other',       caption: 'Additional photo',                       sort_order: 37 },
        { url: '/images/a7.jpeg',   room_label: 'Other',       caption: 'Additional photo',                       sort_order: 38 },
        { url: '/images/a8.jpeg',   room_label: 'Other',       caption: 'Additional photo',                       sort_order: 39 },
        { url: '/images/a9.jpeg',   room_label: 'Other',       caption: 'Additional photo',                       sort_order: 40 },
        { url: '/images/a10.jpeg',  room_label: 'Other',       caption: 'Additional photo',                       sort_order: 41 },
      ],
      amenities: [
        { label: 'Kitchen',                             icon_key: 'soup_kitchen'           },
        { label: 'Wifi',                                icon_key: 'wifi'                   },
        { label: 'Dedicated workspace',                 icon_key: 'laptop_mac'             },
        { label: 'Free parking on premises',            icon_key: 'local_parking'          },
        { label: 'Pool',                                icon_key: 'pool'                   },
        { label: 'Hot tub / Jacuzzi',                   icon_key: 'hot_tub'                },
        { label: 'Pets allowed',                        icon_key: 'pets'                   },
        { label: 'Exterior security cameras',           icon_key: 'videocam'               },
        { label: 'Hairdryer',                           icon_key: 'dry'                    },
        { label: 'Cleaning products',                   icon_key: 'cleaning_services'      },
        { label: 'Shampoo',                             icon_key: 'shampoo'                },
        { label: 'Hot water',                           icon_key: 'water_drop'             },
        { label: 'Shower gel',                          icon_key: 'soap'                   },
        { label: 'Washing machine',                     icon_key: 'local_laundry_service'  },
        { label: 'Hangers',                             icon_key: 'checkroom'              },
        { label: 'Bed linen',                           icon_key: 'bed'                    },
        { label: 'Room-darkening blinds',               icon_key: 'blinds'                 },
        { label: 'Fully equipped modular kitchen',      icon_key: 'countertops'            },
        { label: 'Microwave & Coffee maker',            icon_key: 'coffee_maker'           },
        { label: 'Air conditioning',                    icon_key: 'ac_unit'                },
        { label: 'Smart TV',                            icon_key: 'tv'                     },
        { label: 'Ceiling fan',                         icon_key: 'mode_fan'               },
        { label: 'Gym / Fitness centre',                icon_key: 'fitness_center'         },
        { label: 'Self check-in (building staff)',      icon_key: 'door_front'             },
      ],
    });

    console.log(`[seed] Listing created: "${listing.title}" (numericId: 1, _id: ${listing._id})`);
    console.log('[seed] Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[seed] Error seeding MongoDB:', err);
    process.exit(1);
  }
}

seed();
