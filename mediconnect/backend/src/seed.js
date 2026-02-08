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
      phone: '01140036376',
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
        department: 'General Medicine',
        specialization: 'General Physician & Internal Medicine',
        hospitalId: hospital._id,
        phone: '+919876543210',
        email: 'dr.rajesh@citycare.in',
        consultationFee: 500,
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        availableSlots: [
          '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
          '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        ],
        isActive: true,
      },
      {
        name: 'Dr. Priya Patel',
        department: 'Cardiology',
        specialization: 'Interventional Cardiologist',
        hospitalId: hospital._id,
        phone: '+919876543211',
        email: 'dr.priya@citycare.in',
        consultationFee: 1000,
        availableDays: ['monday', 'wednesday', 'friday'],
        availableSlots: [
          '10:00', '10:30', '11:00', '11:30',
          '15:00', '15:30', '16:00', '16:30',
        ],
        isActive: true,
      },
      {
        name: 'Dr. Amit Kumar',
        department: 'Orthopedics',
        specialization: 'Joint Replacement & Sports Medicine',
        hospitalId: hospital._id,
        phone: '+919876543212',
        email: 'dr.amit@citycare.in',
        consultationFee: 800,
        availableDays: ['tuesday', 'thursday', 'saturday'],
        availableSlots: [
          '09:00', '09:30', '10:00', '10:30', '11:00',
          '14:00', '14:30', '15:00', '15:30',
        ],
        isActive: true,
      },
      {
        name: 'Dr. Sunita Verma',
        department: 'Gynecology',
        specialization: 'Obstetrics & Gynecology',
        hospitalId: hospital._id,
        phone: '+919876543213',
        email: 'dr.sunita@citycare.in',
        consultationFee: 700,
        availableDays: ['monday', 'tuesday', 'thursday', 'friday'],
        availableSlots: [
          '10:00', '10:30', '11:00', '11:30',
          '16:00', '16:30', '17:00', '17:30',
        ],
        isActive: true,
      },
      {
        name: 'Dr. Vikram Singh',
        department: 'Dermatology',
        specialization: 'Skin & Hair Specialist',
        hospitalId: hospital._id,
        phone: '+919876543214',
        email: 'dr.vikram@citycare.in',
        consultationFee: 600,
        availableDays: ['monday', 'wednesday', 'friday', 'saturday'],
        availableSlots: [
          '11:00', '11:30', '12:00',
          '17:00', '17:30', '18:00', '18:30',
        ],
        isActive: true,
      },
      {
        name: 'Dr. Neha Gupta',
        department: 'Pediatrics',
        specialization: 'Child Specialist & Neonatologist',
        hospitalId: hospital._id,
        phone: '+919876543215',
        email: 'dr.neha@citycare.in',
        consultationFee: 600,
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        availableSlots: [
          '09:00', '09:30', '10:00', '10:30', '11:00',
          '16:00', '16:30', '17:00', '17:30', '18:00',
        ],
        isActive: true,
      },
    ]);

    console.log(`👨‍⚕️ Created ${doctors.length} doctors:`);
    doctors.forEach((d) => console.log(`   - ${d.name} (${d.department}) - ₹${d.consultationFee}`));

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
