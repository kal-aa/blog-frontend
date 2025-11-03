export interface ErrorState {
  message: string | null;
}

// Pagination.tsx
export interface PaginationProps {
  limit: number;
  setLimit: (limit: number) => void;
  totalPages: number;
}