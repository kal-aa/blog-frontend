import PropTypes from "prop-types";

function SeeMore({ value, isFull }) {
  return (
    <>
      {value.length < 15 ? value : isFull ? value : value.slice(0, 15) + "..."}

      {value.length >= 15 && (
        <span className="ml-1 text-xs text-blue-300 cursor-pointer hover:text-blue-400">
          {!isFull && "-see more-"}
        </span>
      )}
    </>
  );
}

SeeMore.propTypes = {
  value: PropTypes.string,
  isFull: PropTypes.bool,
};

export default SeeMore;
