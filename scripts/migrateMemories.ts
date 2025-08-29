// scripts/migrateMemories.ts
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Set up paths to handle imports without the @ alias
const rootDir = path.resolve(process.cwd());
const modelsDir = path.join(rootDir, 'models');
const libDir = path.join(rootDir, 'lib');
const servicesDir = path.join(rootDir, 'actions');

// Dynamic imports to avoid path alias issues
async function runMigration() {
    try {
        // Import models and services using dynamic import
        const { default: connectToDB } = await import(`${libDir}/mongodb.ts`);
        const { default: UserLearningProfile } = await import(`${modelsDir}/ai-coach/UserLearningProfile.ts`);
        const { default: UserMemory } = await import(`${modelsDir}/ai-coach/UserMemory.ts`);
        const { generateEmbedding, updateUserSummary } = await import(`${servicesDir}/memory-retrival.ts`);

        // Connect to database
        await connectToDB();
        console.log('Connected to MongoDB');

        // Find all user profiles with memories
        const userProfiles = await UserLearningProfile.find({
            memory: { $exists: true, $ne: [] }
        });

        console.log(`Found ${userProfiles.length} profiles with memories to migrate`);

        // If no profiles with memories, exit early
        if (userProfiles.length === 0) {
            console.log('No memories to migrate. Exiting...');
            return;
        }

        for (const profile of userProfiles) {
            if (!profile.memory || profile.memory.length === 0) continue;

            console.log(`Migrating ${profile.memory.length} memories for user ${profile.userId}`);

            // Process each memory
            let successCount = 0;
            let failCount = 0;

            for (const memoryText of profile.memory) {
                try {
                    if (!memoryText || typeof memoryText !== 'string') {
                        console.log('Skipping invalid memory:', memoryText);
                        continue;
                    }

                    // Generate embedding for the memory
                    console.log('Generating embedding for memory...');
                    const embedding = await generateEmbedding(memoryText);

                    // Create new memory document
                    const newMemory = new UserMemory({
                        userId: profile.userId,
                        memory: memoryText,
                        vectorEmbedding: embedding,
                        tags: ['migrated'],
                        contextType: ['personal'],
                        importance: 5 // Default importance
                    });

                    await newMemory.save();
                    successCount++;
                    console.log(`Migrated memory: ${memoryText.substring(0, 30)}...`);
                } catch (memoryError) {
                    failCount++;
                    console.error(`Failed to migrate memory: ${memoryText ? memoryText.substring(0, 30) : 'undefined'}...`, memoryError);
                }
            }

            console.log(`Migration summary for user ${profile.userId}: ${successCount} successful, ${failCount} failed`);

            // Clear memories from the user profile
            try {
                await UserLearningProfile.updateOne(
                    { _id: profile._id },
                    { $unset: { memory: "" } }
                );
                console.log(`Cleared memories from profile for user ${profile.userId}`);
            } catch (clearError) {
                console.error(`Failed to clear memories for user ${profile.userId}`, clearError);
            }

            // Generate and save summary
            try {
                await updateUserSummary(profile.userId.toString());
                console.log(`Generated summary for user ${profile.userId}`);
            } catch (summaryError) {
                console.error(`Failed to generate summary for user ${profile.userId}`, summaryError);
            }
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the migration
runMigration()
    .then(() => {
        console.log('Migration script completed');
        process.exit(0);
    })
    .catch(err => {
        console.error('Migration script failed:', err);
        process.exit(1);
    });