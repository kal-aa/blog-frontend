export default function NoInternetConnection() {
  return (
    <div className="flex flex-col items-center w-full pb-2 border-b-4 border-black rounded-full">
      <p className="font-bold">No internet connection</p>
      <button
        onClick={() => window.location.reload()}
        className="px-8 border rounded-2xl hover:bg-white/10 border-black/30"
      >
        Try again
      </button>
    </div>
  );
}
