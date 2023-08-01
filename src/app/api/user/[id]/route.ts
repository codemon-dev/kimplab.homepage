import { verifyJwt } from '@/app/lib/jwt'
import prisma from '@/app/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  // 추가된 부분
  const accessToken = request.headers.get('authorization')
  if (!accessToken || !verifyJwt(accessToken)) {
    return new Response(JSON.stringify({ error: 'No Authorization' }), {
      status: 401,
    })
  }

  console.log(params)

  const id = Number(params.id)

  const userPosts = await prisma.post.findMany({
    where: {
      authorId: id,
    },
    include: {
      author: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  })
  return new Response(JSON.stringify(userPosts))
}