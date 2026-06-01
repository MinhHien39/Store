const BUILD_STAMP = new Date().toISOString();

export function GET() {
  return Response.json(
    {
      version: BUILD_STAMP,
      buildTime: BUILD_STAMP,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
