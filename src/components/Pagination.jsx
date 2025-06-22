import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import PropTypes from "prop-types";

export default function Pagination({ limit, setLimit, totalPages }) {
  return (
    <section className="flex justify-center space-x-[25%] md:space-x-[20%]">
      <FaArrowLeft
        aria-label="Previous page"
        title="Previous page"
        className={limit < 1 && "text-gray-300 pointer-events-none"}
        onClick={() => {
          if (limit > 0) {
            setLimit((prev) => prev - 1);
          }
        }}
      />
      <p className="px-2 text-white rounded-full bg-slate-600">
        {limit < 0 ? 0 : limit}
      </p>
      <FaArrowRight
        aria-label="Next page"
        title="Next page"
        className={`${
          limit >= totalPages - 1 && "text-gray-300 pointer-events-none"
        }`}
        onClick={() => {
          if (limit < totalPages - 1) {
            setLimit((prev) => prev + 1);
          }
        }}
      />
    </section>
  );
}

Pagination.propTypes = {
  limit: PropTypes.number,
  setLimit: PropTypes.func,
  totalPages: PropTypes.number,
};
