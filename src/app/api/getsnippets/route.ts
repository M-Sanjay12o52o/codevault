import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, res: Response) {
    try {
        const snippets = await db.codeSnippet.findMany();

        console.log("snippets backend: ", snippets)

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
