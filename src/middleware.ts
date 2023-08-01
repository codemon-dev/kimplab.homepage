export { default } from 'next-auth/middleware'

export const config = {
    matcher: [
        '/bot/:path*',
        '/profile/:path*'
    ],
}