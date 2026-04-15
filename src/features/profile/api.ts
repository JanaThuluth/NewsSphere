import { signOut as authSignOut } from "firebase/auth";
import {
    doc,
    getDoc,
    serverTimestamp,
    updateDoc
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { EditProfileData, User } from "../../types/user";

export const fetchUserProfile = async (): Promise<User | null> => {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    if (!userDoc.exists()) return null;

    return {
        uid: userDoc.data().uid,
        fullName: userDoc.data().fullName,
        email: userDoc.data().email,
        createdAt: userDoc.data().createdAt?.toDate() || new Date(),
        photoURL: userDoc.data().photoURL,
        bio: userDoc.data().bio,
        phone: userDoc.data().phone,
        location: userDoc.data().location,
    };
};

export const updateUserProfile = async (
  data: EditProfileData
): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User not authenticated");

  const cleanedData = Object.fromEntries(
    Object.entries({
      ...data,
      updatedAt: serverTimestamp(),
    }).filter(([, value]) => value !== undefined)
  );

  await updateDoc(doc(db, "users", currentUser.uid), cleanedData);
};

export const logoutUser = async (): Promise<void> => {
    await authSignOut(auth);
};