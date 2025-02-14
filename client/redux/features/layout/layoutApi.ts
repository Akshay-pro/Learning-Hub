import { apiSlice } from "../api/api.slice";

export const layoutApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHeroData: builder.query({
            query: (type) => ({
                url: `get-layout/${type}`,
                method: "GET",
                credentials: "include",
            }),
        }),
        editLayout: builder.mutation({
            query: ({type, image, title, subTitle, faq, categories}) => ({
                url: "edit-layout",
                method: "PUT",
                credentials: "include",
                body: {type, image, title, subTitle, faq, categories},
            }),
        }),
    }),
});

export const { useGetHeroDataQuery, useEditLayoutMutation } = layoutApi;