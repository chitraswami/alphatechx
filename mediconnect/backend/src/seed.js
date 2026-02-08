/**
 * MediConnect Seed Data
 * Seeds a demo hospital with doctors for testing
 * Run: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Hospital = require('./models/Hospital');
const Doctor = require('./models/Doctor');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Hospital.deleteMany({});
    await Doctor.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create demo hospital
    const hospital = await Hospital.create({
      name: 'City Care Hospital',
      slug: 'city-care-hospital',
      address: '123 MG Road, Sector 15, Noida, UP 201301',
      phoneNumber: '01140036376',
      email: 'info@citycarehospital.in',
      exophoneNumber: '01140036376',
      isActive: true,
      settings: {
        exophoneNumber: '01140036376',
        defaultLanguage: 'hi-IN',
        workingHours: { start: '09:00', end: '21:00' },
        slotDuration: 30,
      },
      billing: {
        plan: 'professional',
        perCallRate: 50,
      },
    });

    console.log(`🏥 Created hospital: ${hospital.name} (${hospital._id})`);

    // Create doctors
    const doctors = await Doctor.insertMany([
      {
        name: 'Dr. Rajesh Sharma',
        specialty: 'general',
        qualification: 'MBBS, MD (Internal Medicine)',
        experience: 15,
        hospitalId: hospital._id,
        phoneNumber: '+919876543210',
        email: 'dr.rajesh@citycare.in',
        consultationFee: 500,
        availableSlots: [
          { day: 'monday', startTime: '09:00', endTime: '12:00' },
          { day: 'monday', startTime: '14:00', endTime: '17:00' },
          { day: 'tuesday', startTime: '09:00', endTime: '12:00' },
          { day: 'wednesday', startTime: '09:00', endTime: '12:00' },
          { day: 'thursday', startTime: '09:00', endTime: '12:00' },
          { day: 'friday', startTime: '09:00', endTime: '12:00' },
          { day: 'saturday', startTime: '09:00', endTime: '12:00' },
        ],
        isActive: true,
      },
      {
        name: 'Dr. Priya Patel',
        specialty: 'cardiology',
        qualification: 'MBBS, MD (Cardiology), DNB',
        experience: 12,
        hospitalId: hospital._id,
        phoneNumber: '+919876543211',
        email: 'dr.priya@citycare.in',
        consultationFee: 1000,
        availableSlots: [
          { day: 'monday', startTime: '10:00', endTime: '12:00' },
          { day: 'monday', startTime: '15:00', endTime: '17:00' },
          { day: 'wednesday', startTime: '10:00', endTime: '12:00' },
          { day: 'friday', startTime: '10:00', endTime: '12:00' },
        ],
        isActive: true,
      },
      {
        name: 'Dr. Amit Kumar',
        specialty: 'orthopedics',
        qualification: 'MBBS, MS (Orthopedics)',
        experience: 10,
        hospitalId: hospital._id,
        phoneNumber: '+919876543212',
        email: 'dr.amit@citycare.in',
        consultationFee: 800,
        availableSlots: [
          { day: 'tuesday', startTime: '09:00', endTime: '11:00' },
          { day: 'tuesday', startTime: '14:00', endTime: '16:00' },
          { day: 'thursday', startTime: '09:00', endTime: '11:00' },
          { day: 'saturday', startTime: '09:00', endTime: '11:00' },
        ],
        isActive: true,
      },
      {
        name: 'Dr. Sunita Verma',
        specialty: 'gynecology',
        qualification: 'MBBS, MS (Obstetrics & Gynecology)',
        experience: 18,
        hospitalId: hospital._id,
        phoneNumber: '+919876543213',
        email: 'dr.sunita@citycare.in',
        consultationFee: 700,
        availableSlots: [
          { day: 'monday', startTime: '10:00', endTime: '12:00' },
          { day: 'monday', startTime: '16:00', endTime: '18:00' },
          { day: 'tuesday', startTime: '10:00', endTime: '12:00' },
          { day: 'thursday', startTime: '10:00', endTime: '12:00' },
          { day: 'friday', startTime: '10:00', endTime: '12:00' },
        ],
        isActive: true,
      },
      {
        name: 'Dr. Vikram Singh',
        specialty: 'dermatology',
        qualification: 'MBBS, MD (Dermatology)',
        experience: 8,
        hospitalId: hospital._id,
        phoneNumber: '+919876543214',
        email: 'dr.vikram@citycare.in',
        consultationFee: 600,
        availableSlots: [
          { day: 'monday', startTime: '11:00', endTime: '13:00' },
          { day: 'monday', startTime: '17:00', endTime: '19:00' },
          { day: 'wednesday', startTime: '11:00', endTime: '13:00' },
          { day: 'friday', startTime: '11:00', endTime: '13:00' },
          { day: 'saturday', startTime: '11:00', endTime: '13:00' },
        ],
        isActive: true,
      },
      {
        name: 'Dr. Neha Gupta',
        specialty: 'pediatrics',
        qualification: 'MBBS, MD (Pediatrics)',
        experience: 14,
        hospitalId: hospital._id,
        phoneNumber: '+919876543215',
        email: 'dr.neha@citycare.in',
        consultationFee: 600,
        availableSlots: [
          { day: 'monday', startTime: '09:00', endTime: '11:00' },
          { day: 'monday', startTime: '16:00', endTime: '18:00' },
          { day: 'tuesday', startTime: '09:00', endTime: '11:00' },
          { day: 'wednesday', startTime: '09:00', endTime: '11:00' },
          { day: 'thursday', startTime: '09:00', endTime: '11:00' },
          { day: 'friday', startTime: '09:00', endTime: '11:00' },
          { day: 'saturday', startTime: '09:00', endTime: '11:00' },
        ],
        isActive: true,
      },
    ]);

    console.log(`👨‍⚕️ Created ${doctors.length} doctors:`);
    doctors.forEach((d) => console.log(`   - ${d.name} (${d.specialty}) - ₹${d.consultationFee}`));

    console.log('\n🎉 Seed complete!');
    console.log(`\n📞 Exophone: 01140036376`);
    console.log(`🏥 Hospital ID: ${hospital._id}`);
    console.log(`\n🔗 Exotel webhook URL: https://alfatechx.com/mediconnect/api/voice/incoming`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
