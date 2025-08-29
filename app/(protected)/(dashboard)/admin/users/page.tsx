"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, MoreVertical, Shield, Ban, CheckCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { getAllUser } from "@/actions/user";
import { FlattenMaps } from "mongoose";
import { IUserProfile, IUserProfileData } from "@/models/UserProfile";

// Mock function to update user status - replace with real function
async function updateUserStatus(userId: string, status: string) {
	// In a real implementation, this would call your API
	console.log(`Updating user ${userId} status to ${status}`);
	return { success: true } as { success: true; error: string | undefined };
}

export default function AdminUsersPage() {
	const { toast } = useToast();
	const [users, setUsers] = useState<IUserProfileData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("all");

	// Fetch users on initial load
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setIsLoading(true);
				const result = await getAllUser();

				if (result.success) {
					setUsers(result.users);
				} else {
					setError(result.error || "Failed to load users");
					toast({
						title: "Error",
						description: result.error || "Failed to load users",
						variant: "destructive",
					});
				}
			} catch (error) {
				setError("An unexpected error occurred");
				toast({
					title: "Error",
					description: "An unexpected error occurred",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchUsers();
	}, [toast]);

	// Filter users based on search and role filter
	const filteredUsers = users.filter((user) => {
		const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());

		const matchesFilter =
			filter === "all" ||
			(filter === "students" && user.roles.includes("student")) ||
			(filter === "instructors" && user.roles.includes("instructor")) ||
			(filter === "admins" && user.roles.includes("admin")) ||
			(filter === "suspended" && user.status === "suspended");

		return matchesSearch && matchesFilter;
	});

	// Handle status change
	const handleStatusChange = async (userId: string, newStatus: IUserProfileData["status"]) => {
		try {
			const result = await updateUserStatus(userId, newStatus);

			if (result.success) {
				// Update local state
				setUsers(
					users.map((user) => {
						if (user._id === userId) {
							return { ...user, status: newStatus };
						}
						return user;
					})
				);

				toast({
					title: "Success",
					description: `User status updated to ${newStatus}`,
				});
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to update user status",
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		}
	};

	// Get badge color based on role
	const getRoleBadgeVariant = (role: string) => {
		switch (role) {
			case "admin":
				return "bg-red-100 text-red-800";
			case "instructor":
				return "bg-purple-100 text-purple-800";
			case "student":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold">User Management</h2>
				</div>
				<div className="flex justify-center items-center h-64">
					<div className="text-center">
						<div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
						<p className="text-muted-foreground">Loading users...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold">User Management</h2>
				</div>
				<div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">{error}</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">User Management</h2>
				<div className="flex items-center space-x-4">
					<select className="px-3 py-2 bg-transparent border rounded-md" value={filter} onChange={(e) => setFilter(e.target.value)}>
						<option value="all">All Users</option>
						<option value="students">Students</option>
						<option value="instructors">Instructors</option>
						<option value="admins">Admins</option>
						<option value="suspended">Suspended</option>
					</select>
					<div className="flex w-full max-w-sm items-center space-x-2">
						<Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
						<Button size="icon">
							<Search className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Users</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{filteredUsers.length === 0 ? (
							<div className="text-center p-6">
								<p className="text-muted-foreground">No users found matching your criteria</p>
							</div>
						) : (
							filteredUsers.map((user) => (
								<div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
									<div className="flex items-center space-x-4">
										<Avatar>{user.picture ? <AvatarImage src={user.picture} alt={user.name} /> : <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>}</Avatar>
										<div>
											<p className="font-medium">{user.name}</p>
											<p className="text-sm text-muted-foreground">{user.email}</p>
										</div>
										<div className="flex gap-2 ml-4">
											{user.roles.map((role) => (
												<Badge key={role} className={getRoleBadgeVariant(role)}>
													{role}
												</Badge>
											))}
											<Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
										</div>
									</div>
									<div className="flex items-center space-x-2">
										<Button variant="ghost" size="icon" asChild>
											<a href={`mailto:${user.email}`}>
												<Mail className="h-4 w-4" />
											</a>
										</Button>
										{user.status === "active" ? (
											<Button variant="destructive" size="sm" onClick={() => handleStatusChange(user._id, "suspended")}>
												<Ban className="h-4 w-4 mr-2" />
												Suspend
											</Button>
										) : (
											<Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange(user._id, "active")}>
												<CheckCircle className="h-4 w-4 mr-2" />
												Activate
											</Button>
										)}
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuItem>View Profile</DropdownMenuItem>
												<DropdownMenuItem>Edit Roles</DropdownMenuItem>
												<DropdownMenuItem>Reset Password</DropdownMenuItem>
												<DropdownMenuItem className="text-red-600">Delete Account</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							))
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
