import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme }  from "../../../constants/ThemeContext";
import { Fonts, FontSizes } from "../../../constants/constants";
import { EditProfileDialog } from "../components/EditProfileDialog";
import { LogoutDialog } from "../components/LogoutDialog";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileMenuItem } from "../components/ProfileMenuItem";
 import {
  useLogout,
  useUpdateProfile,
  useUserProfile,
} from "../hooks/useProfile";
import { EditProfileData } from "../../../types/user";

export default function ProfileScreen() {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const { data: user, isLoading, error, refetch } = useUserProfile();
  const updateMutation = useUpdateProfile();
  const logoutMutation = useLogout();

  const handleEditProfile = async (data: EditProfileData) => {
    try {
      await updateMutation.mutateAsync(data);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setLogoutDialogVisible(false);
      router.replace("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const menuItems = [
    {
      icon: "pencil",
      text: "Edit Profile",
      color: theme.secondary,
      onPress: () => setEditModalVisible(true),
    },
    {
      icon: "bell-outline",
      text: "Notifications",
      color: theme.secondary,
      onPress: () => router.push("/notifications"),
    },
    {
      icon: "bookmark-outline",
      text: "Saved News",
      color: theme.secondary,
      onPress: () => router.push("/saved"),
    },
    {
      icon: "cog-outline",
      text: "Settings",
      color: theme.secondary,
      onPress: () => router.push("/settings"),
    },
    {
      icon: "logout",
      text: "Log Out",
      color: theme.red,
      isDanger: true,
      onPress: () => setLogoutDialogVisible(true),
    },
  ];

  if (isLoading) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error || !user) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.errorText, { color: theme.red }]}>
          Failed to load profile
        </Text>

        <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 10 }}>
          <Text style={{ color: theme.primary }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.headerWrapper,
          { paddingTop: insets.top, backgroundColor: theme.primary },
        ]}
      >
        <StatusBar backgroundColor={theme.primary} barStyle="light-content" />

        <View style={styles.navbar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.navButton}
          >
            <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>

          <View style={styles.navButton} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          fullName={user.fullName}
          email={user.email}
          photoURL={user.photoURL}
        />

        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <ProfileMenuItem
              key={item.text}
              icon={item.icon}
              text={item.text}
              color={item.color}
              isDanger={item.isDanger}
              onPress={item.onPress}
            />
          ))}
        </View>
      </ScrollView>

      <EditProfileDialog
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleEditProfile}
        initialData={{
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          bio: user.bio,
          photoURL: user.photoURL,
        }}
        isLoading={updateMutation.isPending}
      />

      <LogoutDialog
        visible={logoutDialogVisible}
        onCancel={() => setLogoutDialogVisible(false)}
        onConfirm={handleLogout}
        isLoading={logoutMutation.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerWrapper: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },

  navbar: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  navButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    fontFamily: Fonts.heading,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  menuSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  errorText: {
    fontSize: FontSizes.subheading,
    fontFamily: Fonts.body,
    textAlign: "center",
  },
});
