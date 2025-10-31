import { QueryClient } from "@tanstack/react-query";

export const invalidateBlogQueries = (
  queryClient: QueryClient,
  keysToInvalidate: string[] = ["all-blogs", "your-blogs"]
) => {
  //   queryClient.invalidateQueries({ queryKey: ["all-blogs"] });
  //   queryClient.invalidateQueries({ queryKey: ["your-blogs"] });
  keysToInvalidate.forEach((key) =>
    queryClient.invalidateQueries({ queryKey: [key] })
  );
};
