export async function GET() {
    return new Response(
      JSON.stringify({
        error: "Authentication error: Please check your credentials and try again.",
      }),
      { status: 400 }
    );
  }