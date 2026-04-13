import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors, Fonts, FontSizes } from "../../src/constants/constants";
import { EditProfileDialog } from "../../src/features/profile/components/EditProfileDialog";
import { LogoutDialog } from "../../src/features/profile/components/LogoutDialog";
import { ProfileHeader } from "../../src/features/profile/components/ProfileHeader";
import {
  useLogout,
  useUpdateProfile,
  useUserProfile,
} from "../../src/features/profile/hooks";
import { EditProfileData } from "../../src/types/user";

export default function ProfileScreen() {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  const router = useRouter();

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
      color: Colors.secondary,
      onPress: () => setEditModalVisible(true),
    },
    {
      icon: "bell-outline",
      text: "My News",
      color: Colors.secondary,
      onPress: () => router.push("/create-news"),
    },
    {
      icon: "bookmark-outline",
      text: "Saved News",
      color: Colors.secondary,
      onPress: () => router.push("/saved"),
    },
    {
      icon: "cog-outline",
      text: "Settings",
      color: Colors.secondary,
      onPress: () => router.push("/settings"),
    },
    {
      icon: "logout",
      text: "Log Out",
      color: Colors.red,
      textColor: Colors.red,
      onPress: () => setLogoutDialogVisible(true),
      isDanger: true,
    },
  ];

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>

        <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 10 }}>
          <Text style={{ color: Colors.primary }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color={Colors.primary}
          />
        </TouchableOpacity>

        <Text style={styles.title}>My Profile</Text>

        <View style={{ width: 28 }} />
      </View>

      {/* Profile */}
      <ProfileHeader
        fullName={user.fullName}
        email={user.email}
        photoURL={user.photoURL}
      />

      {/* Menu */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <MaterialCommunityIcons
                name={item.icon as any}
                size={20}
                color={item.color}
              />
              <Text
                style={[
                  styles.menuItemText,
                  item.isDanger && styles.logoutText,
                ]}
              >
                {item.text}
              </Text>
            </View>

            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={Colors.secondary}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Edit Profile Modal */}
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

      {/* Logout Dialog */}
      <LogoutDialog
        visible={logoutDialogVisible}
        onCancel={() => setLogoutDialogVisible(false)}
        onConfirm={handleLogout}
        isLoading={logoutMutation.isPending}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    marginBottom: 20,
  },

  title: {
    fontSize: FontSizes.heading,
    fontFamily: Fonts.heading,
  },

  menuSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: Colors.white,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,

    marginBottom: 14,

    shadowColor: Colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  menuItemText: {
    fontSize: FontSizes.subheading,
    fontFamily: Fonts.body,
    color: Colors.black,
  },

  logoutText: {
    color: Colors.red,
  },

  errorText: {
    fontSize: FontSizes.subheading,
    color: Colors.red,
    fontFamily: Fonts.body,
    textAlign: "center",
  },
});