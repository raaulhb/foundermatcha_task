/**
 * Script to populate Firestore with initial test data
 * This script creates sample users to facilitate application testing
 */

const admin = require("firebase-admin");

// Initialize Firebase Admin SDK connecting to local emulator
admin.initializeApp({
  projectId: "meeting-scheduler-demo",
});

// Connect to Firestore Emulator on port 8080
const db = admin.firestore();
db.settings({
  host: "localhost:8080",
  ssl: false,
});

// Connect to Auth Emulator on port 9099
process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";

/**
 * Sample user data
 * Each user has: email, name, bio and avatar
 */
const sampleUsers = [
  {
    id: "user1",
    email: "alice@example.com",
    displayName: "Alice Johnson",
    bio: "Product Manager at TechCorp",
    avatar: "https://i.pravatar.cc/150?img=1",
    createdAt: admin.firestore.Timestamp.now(),
  },
  {
    id: "user2",
    email: "bob@example.com",
    displayName: "Bob Smith",
    bio: "Software Engineer",
    avatar: "https://i.pravatar.cc/150?img=3",
    createdAt: admin.firestore.Timestamp.now(),
  },
  {
    id: "user3",
    email: "charlie@example.com",
    displayName: "Charlie Davis",
    bio: "UX Designer",
    avatar: "https://i.pravatar.cc/150?img=5",
    createdAt: admin.firestore.Timestamp.now(),
  },
  {
    id: "user4",
    email: "diana@example.com",
    displayName: "Diana Martinez",
    bio: "Marketing Director",
    avatar: "https://i.pravatar.cc/150?img=9",
    createdAt: admin.firestore.Timestamp.now(),
  },
  {
    id: "user5",
    email: "eve@example.com",
    displayName: "Eve Wilson",
    bio: "Data Scientist",
    avatar: "https://i.pravatar.cc/150?img=10",
    createdAt: admin.firestore.Timestamp.now(),
  },
];

/**
 * Main function that executes the seed
 */
async function seedData() {
  try {
    console.log("🌱 Starting data seed...\n");

    // Create users in Firebase Authentication
    console.log("📝 Creating users in Authentication...");
    for (const user of sampleUsers) {
      try {
        await admin.auth().createUser({
          uid: user.id,
          email: user.email,
          password: "password123", // Default password for all (development only)
          displayName: user.displayName,
          photoURL: user.avatar,
        });
        console.log(`✅ User created: ${user.displayName} (${user.email})`);
      } catch (error) {
        if (error.code === "auth/uid-already-exists") {
          console.log(`⚠️  User already exists: ${user.displayName}`);
        } else {
          throw error;
        }
      }
    }

    // Create user documents in Firestore
    console.log("\n📝 Creating user documents in Firestore...");
    for (const user of sampleUsers) {
      await db.collection("users").doc(user.id).set(user);
      console.log(`✅ Document created: ${user.displayName}`);
    }

    console.log("\n✨ Seed completed successfully!");
    console.log("\n📋 Access credentials:");
    console.log("   Email: any of the above listed");
    console.log("   Password: password123\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

// Execute seed
seedData();
