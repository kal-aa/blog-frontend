import { BeatLoader } from "react-spinners";

export default function SuspenseFallback() {
  return (
    <div className="flex flex-col items-center justify-center px-2 py-2 bg-black rounded-xl text-white/90">
      <BeatLoader size={10} color="white" />
      <p className="">Loading...</p>
    </div>
  );
}
