export const queryKeys = {
  allBlogs: (id: string | undefined, limit: number) =>
    ["all-blogs", { route: `blogs/${id}?page=${limit}` }] as const,

  yourBlogs: (id: string | undefined, limit: number) =>
    ["your-blogs", { route: `your-blogs/${id}?page=${limit}` }] as const,

  comments: (blogId: string) =>
    ["comments", { route: `blogs/${blogId}/comments` }] as const,

  replies: (commentId: string) =>
    ["replies", { route: `comments/${commentId}/replies` }] as const,
};
