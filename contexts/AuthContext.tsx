"use client";

import { IUserProfile, IUserProfileData } from "@/models/UserProfile";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the type for the context
type AuthContextType = {
	isAuthenticated: boolean;
	isLoading: boolean;
	session: any | null;
	profile: IUserProfileData | null;
	refreshProfile: () => Promise<void>;
};

// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children, initialSession, initialProfile }: { children: ReactNode; initialSession: any | null; initialProfile: IUserProfileData | null }) {
	const [session, setSession] = useState<any | null>(initialSession);
	const [profile, setProfile] = useState<IUserProfileData | null>(initialProfile);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Determine authentication status based on session
	const isAuthenticated = !!session;

	// Function to refresh the profile data
	const refreshProfile = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/user/profile");
			if (!response.ok) throw new Error("Failed to fetch profile");

			const data = await response.json();
			setProfile(data.profile);
		} catch (error) {
			console.error("Error refreshing profile:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// Make the context values available to children components
	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				isLoading,
				session,
				profile,
				refreshProfile,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

// Custom hook for using the auth context
export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
