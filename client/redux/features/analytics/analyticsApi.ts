import { apiSlice } from "../api/api.slice";

export const analyticsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCourseAnalytics: builder.query({
            query: () => ({
                url: `get-courses-analytics`,
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        getUserAnalytics: builder.query({
            query: () => ({
                url: `get-users-analytics`,
                method: "GET",
                credentials: "include" as const,
            }),
        }),
    }),
})

export const { useGetCourseAnalyticsQuery, useGetUserAnalyticsQuery } = analyticsApi;