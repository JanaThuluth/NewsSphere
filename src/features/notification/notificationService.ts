import {
    addDoc,
    collection,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
    writeBatch
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export interface NotificationData {
    title: string;
    message: string;
    imageUrl: string;
    articleId: string;
    sourceName: string;
    publishedAt: string;
    description: string;
}

export interface Notification extends NotificationData {
    id: string;
    userId: string;
    isRead: boolean;
    createdAt: any;
}

export const saveUserPushToken = async (userId: string, token: string) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            pushToken: token,
            lastActive: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating push token", error);
    }
};

export const getNotifications = async (): Promise<Notification[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Notification[];
};

export const createNotification = async (data: NotificationData) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const q = query(
            collection(db, "notifications"),
            where("userId", "==", user.uid),
            where("articleId", "==", data.articleId),
            limit(1)
        );
        const existing = await getDocs(q);

        if (existing.empty) {
            await addDoc(collection(db, "notifications"), {
                userId: user.uid,
                ...data,
                isRead: false,
                createdAt: serverTimestamp()
            });
            console.log("✅ Notification created with full article data");
        }
    } catch (error) {
        console.error("❌ Error creating notification:", error);
    }
};

export const markAllAsRead = async (notificationIds: string[]) => {
    if (notificationIds.length === 0) return;
    const batch = writeBatch(db);
    notificationIds.forEach((id) => {
        const ref = doc(db, "notifications", id);
        batch.update(ref, { isRead: true });
    });
    await batch.commit();
};