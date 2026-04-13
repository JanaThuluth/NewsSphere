export interface User {
    uid: string;
    fullName: string;
    email: string;
    createdAt: Date;
    photoURL?: string;
    bio?: string;
    phone?: string;
    location?: string;
}

export interface EditProfileData {
    fullName: string;
    email: string;
    phone?: string;
    bio?: string;
    photoURL?: string;
}