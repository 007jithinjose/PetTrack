//src/utils/seedHospitals.ts
import mongoose from 'mongoose';
import Hospital from '../models/Hospital.model';
import { MONGODB_URI } from '../config/config'; // Import the specific constant
import logger from './logger';

const hospitalsData = [
  {
    name: "Paws & Claws Animal Hospital",
    address: {
      street: "123 Pet Care Lane",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    contactNumber: "+1-212-555-0123",
    email: "info@pawsandclaws.com",
    services: [
      "General Checkup",
      "Vaccinations",
      "Dental Care",
      "Surgery",
      "Emergency Care",
      "Grooming"
    ],
    doctors: []
  },
  {
    name: "Urban Veterinary Center",
    address: {
      street: "456 Animal Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA"
    },
    contactNumber: "+1-310-555-0456",
    email: "contact@urbanvet.com",
    services: [
      "Internal Medicine",
      "Oncology",
      "Cardiology",
      "Neurology",
      "Physical Therapy"
    ],
    doctors: []
  },
  {
    name: "Countryside Animal Clinic",
    address: {
      street: "789 Farm Road",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      country: "USA"
    },
    contactNumber: "+1-512-555-0789",
    email: "hello@countrysideclinic.com",
    services: [
      "Large Animal Care",
      "Equine Medicine",
      "Livestock Health",
      "Preventive Care",
      "Reproductive Services"
    ],
    doctors: []
  },
  {
    name: "Oceanview Pet Hospital",
    address: {
      street: "321 Beach Boulevard",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA"
    },
    contactNumber: "+1-305-555-0321",
    email: "support@oceanviewpets.com",
    services: [
      "Exotic Animal Care",
      "Avian Medicine",
      "Reptile Health",
      "Aquatic Animal Care",
      "Behavioral Counseling"
    ],
    doctors: []
  },
  {
    name: "Mountain Peak Veterinary",
    address: {
      street: "654 Highland Drive",
      city: "Denver",
      state: "CO",
      zipCode: "80201",
      country: "USA"
    },
    contactNumber: "+1-303-555-0654",
    email: "care@mountainpeakvet.com",
    services: [
      "Emergency Surgery",
      "Trauma Care",
      "Critical Care",
      "Orthopedics",
      "Rehabilitation"
    ],
    doctors: []
  }
];

export const seedHospitals = async () => {
  try {
    // Connect to MongoDB using the MONGODB_URI constant
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB for seeding');

    // Clear existing hospitals
    await Hospital.deleteMany({});
    logger.info('Cleared existing hospitals');

    // Insert new hospitals
    const hospitals = await Hospital.insertMany(hospitalsData);
    logger.info(`Seeded ${hospitals.length} hospitals successfully`);

    // Display seeded hospitals
    hospitals.forEach(hospital => {
      logger.info(`- ${hospital.name} (${hospital.email})`);
    });

    await mongoose.connection.close();
    logger.info('Database connection closed');
    
    return hospitals;
  } catch (error) {
    logger.error('Error seeding hospitals:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  seedHospitals()
    .then(() => {
      logger.info('Hospital seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Hospital seeding failed:', error);
      process.exit(1);
    });
}