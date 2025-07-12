import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth|public).*)',
  ],
}