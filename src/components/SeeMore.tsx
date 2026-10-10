function SeeMore({
  value,
  isFull,
  setIsFullValue,
}: {
  value: string;
  isFull: boolean;
  setIsFullValue: (isFull: boolean) => void;
}) {
  return (
    <>
      {value.length < 15 ? value : isFull ? value : value.slice(0, 15) + "..."}

      {value.length >= 15 && (
        <span
          onClick={() => setIsFullValue(!isFull)}
          className="ml-1 text-xs text-blue-300 cursor-pointer hover:text-blue-400"
        >
          {!isFull ? "see more" : "see less"}
        </span>
      )}
    </>
  );
}

export default SeeMore;
