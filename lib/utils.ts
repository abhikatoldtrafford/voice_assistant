import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import connectToDatabase from '@/lib/mongodb';
import UserProfile from '@/models/UserProfile';
import { SessionData } from '@auth0/nextjs-auth0/types';
import { auth0 } from './auth0';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export async function getUserProfile(session: SessionData) {
  // Connect to the database
  await connectToDatabase();

  const userId = session.user.sub;

  // Find existing user profile or create a new one
  let userProfile = await findOrCreateUserProfile(userId, session.user);

  return userProfile;
}

async function getRoles(id: string) {
  // TODO: Implement this
  return ["admin", "instructor", "student"];
}

async function findOrCreateUserProfile(auth0UserId: string, userData: any) {
  try {
    // Look for existing profile
    let userProfile = await UserProfile.findOne({ auth0Id: auth0UserId });

    // If profile doesn't exist, create a new one
    if (!userProfile) {
      userProfile = new UserProfile({
        auth0Id: auth0UserId,
        email: userData.email,
        name: userData.name || userData.nickname || 'User',
        picture: userData.picture,
        lastLogin: new Date(),
        roles: ["admin", "instructor", "student"],
        customData: {
          newUser: true,
        } // Any additional data you want to store
      });
      await userProfile.save();
      console.log("Created new user profile for:", auth0UserId);
    } else {
      // Update the existing profile with the latest login
      userProfile.lastLogin = new Date();
      if (userData.email && userProfile.email !== userData.email) {
        userProfile.email = userData.email;
      }
      if (userData.picture && userProfile.picture !== userData.picture) {
        userProfile.picture = userData.picture;
      }
      await userProfile.save();
    }

    return userProfile;
  } catch (error) {
    console.error("Error finding/creating user profile:", error);
    throw error;
  }
}

// Helper function to convert ObjectId to string safely
export function toStringId(id: any): string {
  if (!id) return '';
  return id.toString ? id.toString() : String(id);
}