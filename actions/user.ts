'use server'
import connectToDatabase from '@/lib/mongodb';
import UserProfile, { IUserProfile, IUserProfileData } from '@/models/UserProfile';
import { auth0 } from '@/lib/auth0';
import { getUserProfile } from '@/lib/utils';

export async function getCurrentUser() {
    let session = await auth0.getSession()
    if (!session) {
        throw new Error('No session found');
    }
    let userProfile = await getUserProfile(session)
    if (!userProfile) {
        throw new Error('User not found');
    }
    return userProfile.toJSON({ flattenObjectIds: true }) as any as IUserProfileData;
}

export async function getUserById(id: string) {
    // Connect to MongoDB
    await connectToDatabase();

    let userProfile = await UserProfile.findOne({ _id: id });
    if (!userProfile) {
        throw new Error('User not found');
    }
    return userProfile.toObject();
}

export async function getAllUser() {
    // Connect to MongoDB
    await connectToDatabase();

    let userProfiles = await UserProfile.find({}).lean();
    if (!userProfiles) {
        throw new Error('Users not found');
    }
    return {
        success: true,
        users: userProfiles.map(userProfile => {
            return {
                ...userProfile,
                _id: userProfile._id.toString(),
            } as IUserProfileData;
        }),
        error: null as string | null
    };
}