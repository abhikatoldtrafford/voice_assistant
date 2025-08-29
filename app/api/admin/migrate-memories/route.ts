// app/api/admin/migrate-memories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import UserLearningProfile from '@/models/ai-coach/UserLearningProfile';
import UserMemory from '@/models/ai-coach/UserMemory';
import { generateEmbedding, updateUserSummary } from '@/actions/memory-retrival';
import { getCurrentUser } from '@/actions/user';
import connectToDatabase from '@/lib/mongodb';

export async function POST(req: NextRequest) {
    try {
        // Security check - only allow admin users
        // const currentUser = await getCurrentUser();
        // if (!currentUser || !currentUser.roles?.includes('admin')) {
        //     return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        // }

        await connectToDatabase()
        // Find all user profiles with memories
        const userProfiles = await UserLearningProfile.find({
            memory: { $exists: true, $ne: [] }
        });

        console.log(`Found ${userProfiles.length} profiles with memories to migrate`);

        const results = {
            totalUsers: userProfiles.length,
            processedUsers: 0,
            totalMemories: 0,
            successfulMemories: 0,
            failedMemories: 0,
            errors: [] as any[]
        };

        // for (const profile of userProfiles) {
        //     if (!profile.memory || profile.memory.length === 0) continue;

        //     results.totalMemories += profile.memory.length;

        //     // Process each memory
        //     for (const memoryText of profile.memory) {
        //         try {
        //             // Generate embedding for the memory
        //             const embedding = await generateEmbedding(memoryText);

        //             // Create new memory document
        //             const newMemory = new UserMemory({
        //                 userId: profile.userId,
        //                 memory: memoryText,
        //                 vectorEmbedding: embedding,
        //                 tags: ['migrated'],
        //                 contextType: ['personal'],
        //                 importance: 5 // Default importance
        //             });

        //             await newMemory.save();
        //             results.successfulMemories++;
        //         } catch (memoryError) {
        //             results.failedMemories++;
        //             results.errors.push({
        //                 userId: profile.userId.toString(),
        //                 error: (memoryError as Error).message,
        //                 memory: memoryText.substring(0, 100)
        //             });
        //         }
        //     }

        //     // Clear memories from the user profile
        //     await UserLearningProfile.updateOne(
        //         { _id: profile._id },
        //         { $unset: { memory: "" } }
        //     );

        //     // Generate and save summary
        //     try {
        //         await updateUserSummary(profile.userId.toString());
        //     } catch (summaryError) {
        //         results.errors.push({
        //             userId: profile.userId.toString(),
        //             error: (summaryError as Error).message,
        //             operation: 'generate-summary'
        //         });
        //     }

        //     results.processedUsers++;
        // }

        return NextResponse.json({
            success: true,
            results
        });
    } catch (error) {
        console.error('Migration failed:', error);
        return NextResponse.json({
            success: false,
            error: (error as Error).message
        }, { status: 500 });
    }
}