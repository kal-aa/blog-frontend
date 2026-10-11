import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { PaginationProps } from "../types/miscellaneous";

export default function Pagination({
  limit,
  setLimit,
  totalPages,
}: PaginationProps) {
  return (
    <section className="flex justify-center space-x-[25%] md:space-x-[20%]">
      <FaArrowLeft
        aria-label="Previous page"
        title="Previous page"
        className={
          limit < 1 ? "text-gray-300 pointer-events-none" : "cursor-pointer"
        }
        onClick={() => {
          if (limit > 0) setLimit(limit - 1);
        }}
      />
      <p
        className={
          totalPages > 1 ? "px-2 text-white rounded-full bg-slate-600" : ""
        }
      >
        {totalPages > 1 ? (limit < 0 ? 1 : limit + 1) : ""}
      </p>
      <FaArrowRight
        aria-label="Next page"
        title="Next page"
        className={`${
          limit >= totalPages - 1
            ? "text-gray-300 pointer-events-none"
            : "cursor-pointer"
        }`}
        onClick={() => {
          if (limit < totalPages - 1) {
            setLimit(limit + 1);
          }
        }}
      />
    </section>
  );
}
