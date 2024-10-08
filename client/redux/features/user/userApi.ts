import { apiSlice } from "../api/api.slice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateAvatar: builder.mutation({
            query: (avatar) => ({
                url: "update-avatar",
                method: "PUT",
                body: { avatar },
                credentials: "include" as const,
            }),
        }),
    }),
});


export const {useUpdateAvatarMutation} = userApi;