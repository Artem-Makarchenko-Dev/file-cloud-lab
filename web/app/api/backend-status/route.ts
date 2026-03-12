const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://api:3000';

export async function GET() {
  try {
    const response = await fetch(`${apiUrl}/connection`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return Response.json(
        { message: "Failed to reach backend" },
        { status: response.status },
      );
    }

    const data = (await response.json()) as { message: string };

    return Response.json(data);
  } catch {
    return Response.json(
      { message: "Failed to reach backend" },
      { status: 500 },
    );
  }
}
