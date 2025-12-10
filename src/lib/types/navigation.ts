export interface NavChild {
	name: string;
	href: string;
	icon?: string;
}

export interface NavItem {
	name: string;
	href: string;
	icon?: string;
	hasDropdown?: boolean;
	children?: NavChild[];
}

// Only admin and teacher roles
export type UserRole = 'admin' | 'teacher';

export interface User {
	id: number;
	username: string;
	email: string;
	role: UserRole;
}