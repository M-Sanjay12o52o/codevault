import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function GET(req: Request, res: Response) {
    try {
        const snippets = await db.codeSnippet.findMany();

        const successMessage = 'Code snippets fetched successfully!';
        return NextResponse.json({
            snippets,
            message: successMessage
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
