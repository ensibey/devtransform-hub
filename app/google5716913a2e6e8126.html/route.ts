export const dynamic = 'force-static';

export function GET() {
  return new Response('google-site-verification: google5716913a2e6e8126.html\n', {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
