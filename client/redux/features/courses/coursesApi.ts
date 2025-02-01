import { apiSlice } from "../api/api.slice";

export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createFullCourse: builder.mutation({
            query: ({ data }) => ({
                    url: "create-course",
                    method: "POST",
                    body: {
                        data
                    },
                    credentials: "include" as const,
            }),
        }),
    }),
});

export const { useCreateFullCourseMutation } = courseApi;
