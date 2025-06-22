export const fetchData = async ({ queryKey }) => {
  // eslint-disable-next-line no-unused-vars
  const [_key, { route }] = queryKey;
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${route}`);
  const baseRoute = route.split("/")[0];
  if (!res.ok) throw new Error(`Failed to fetch data from ${baseRoute}`);
  return res.json();
};
