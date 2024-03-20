import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function DELETE(req: Request, res: Response) {
    const { snippetId } = (await req.json());

    try {

        const response = await db.codeSnippet.delete({
            where: { id: snippetId }
        })

        // Delete from Redis cache
        await redis.del(`snippet:${snippetId}`);

        return NextResponse.json({
            message: 'Snippet deleted successfully',
            response
        });
    } catch (error: any) {
        console.error('Error submitting snippet:', error);
        return new NextResponse(
            JSON.stringify({
                status: "error",
                message: error.message,
            }),
            { status: 500 }
        );
    } finally {
        await db.$disconnect();
    }
}
