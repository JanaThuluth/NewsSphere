import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EditProfileData } from "../../types/user";
import { fetchUserProfile, logoutUser, updateUserProfile } from "./api";

export const useUserProfile = () => {
    return useQuery({
        queryKey: ["userProfile"],
        queryFn: fetchUserProfile,
        staleTime: 1000 * 60 * 5,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: EditProfileData) => updateUserProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.clear();
        },
    });
};