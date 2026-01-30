import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nco-search';

// Test users to seed
const testUsers = [
    {
        phone: '8925341040',
        name: '8925341040 - Enumerator',
        role: 'ENUMERATOR',
        isActive: true
    },
    {
        phone: '8248805628',
        name: '8248805628 - Enumerator',
        role: 'ENUMERATOR',
        isActive: true
    },
    {
        phone: '8610873826',
        name: '8610873826 - Enumerator',
        role: 'ENUMERATOR',
        isActive: true
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected successfully');

        // Clear existing users (optional - comment out if you don't want to clear)
        await User.deleteMany({});
        console.log('🗑️  Cleared existing users');

        // Insert test users
        const result = await User.insertMany(testUsers);
        console.log(`✅ Successfully seeded ${result.length} users:`);

        result.forEach(user => {
            console.log(`   - ${user.name} (${user.phone}) - ${user.role}`);
        });

        console.log('\n📝 These phone numbers can now request OTP!');

        // Close connection
        await mongoose.connection.close();
        console.log('\n✅ Database seeding complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
}

seedDatabase();
