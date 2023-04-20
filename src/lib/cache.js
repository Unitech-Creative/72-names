export default function setCache(res, seconds) {
  const maxAge = seconds || 60;
  const staleWhileRevalidate = maxAge + 60;

  res.setHeader(
    "Cache-Control",
    `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
  );
}
