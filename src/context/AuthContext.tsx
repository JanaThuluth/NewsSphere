import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { User } from "../types/user";

type AuthContextType = {
  user: FirebaseUser | null;
  userProfile: User | null;
  token: string | null;
  loading: boolean;
  refreshToken: () => Promise<string | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as User);
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.log("Load user profile error:", error);
      setUserProfile(null);
    }
  };

  const refreshToken = async () => {
    try {
      if (!auth.currentUser) return null;

      const freshToken = await auth.currentUser.getIdToken(true);
      setToken(freshToken);

      return freshToken;
    } catch (error) {
      console.log("Refresh token error:", error);
      return null;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);

      setUser(null);
      setUserProfile(null);
      setToken(null);
    } catch (error) {
      console.log("Logout error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setLoading(true);

        if (currentUser) {
          setUser(currentUser);

          const currentToken = await currentUser.getIdToken();
          setToken(currentToken);

          await loadUserProfile(currentUser.uid);
        } else {
          setUser(null);
          setUserProfile(null);
          setToken(null);
        }
      } catch (error) {
        console.log("Auth state error:", error);
        setUser(null);
        setUserProfile(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        token,
        loading,
        refreshToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}