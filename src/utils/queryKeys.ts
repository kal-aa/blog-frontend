export const queryKeys = {
  allBlogs: (id: string | undefined, limit: number) => ["all-blogs", { route: `blogs/${id}?page=${limit}` }] as const,

  yourBlogs: ["your-blogs"] as const,

  comments: (blogId: string) =>
    ["comments", { route: `blogs/${blogId}/comments` }] as const,
  replies: (commentId: string) =>
    ["replies", { route: `comments/${commentId}/replies` }] as const,  
};
