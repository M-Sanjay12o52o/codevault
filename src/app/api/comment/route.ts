import { redis } from "@/lib/redis"
import { nanoid } from "nanoid"
import { NextRequest } from "next/server"

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json()

        const { text, tags } = body

        console.log("text: ", text, "tags: ", tags)

        const commentId = nanoid();

        // retrieve and store comment details
        const comment = {
            text,
            tags: {
                TypeScript: true,
            },
            upvotes: 0,
            timestamp: new Date(),
            author: req.cookies.get('userId')?.value
        }

        // await Promise.all([redis.rpush('comments', commentId), redis.json.set(`comment:${commentId}`, '$', comment)])

        await redis.json.numincrby('comment:AKzGY-6KeqUsoWyR7G91M', "$.upvotes", 1)

        return new Response('OK')
    } catch (error: any) {
        console.log(error)
    }
}