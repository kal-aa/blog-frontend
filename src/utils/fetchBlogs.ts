import { QueryFunctionContext } from "@tanstack/react-query";

export const fetchData = async <T>({
  queryKey,
}: QueryFunctionContext<readonly [string, { route: string }]>): Promise<T> => {
  // eslint-disable-next-line no-unused-vars
  const [_key, { route }] = queryKey;
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${route}`);
  const baseRoute = route.split("/")[0];
  if (!res.ok) throw new Error(`Failed to fetch data from ${baseRoute}`);
  return res.json();
};
