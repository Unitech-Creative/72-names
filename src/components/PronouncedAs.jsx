export const PronouncedAs = function({ pronounced }) {
  return (
    <div className="flex flex-col place-items-center font-serif">
      <div className="rounded-full border border-cal-700 px-5 py-1 font-semibold">
        <div className={`leading-6 text-cal-400`}>{pronounced}</div>
      </div>
    </div>
  );
}
