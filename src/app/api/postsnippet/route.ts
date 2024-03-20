import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function POST(req: Request, res: Response) {
    try {
        const { username, title, description, codeLanguage, stdin, sourceCode } = (await req.json() as CodeSnippet);

        const snippet = await db.codeSnippet.create({
            data: {
                username,
                title,
                description,
                codeLanguage,
                stdin,
                sourceCode,
            },
        });

        const successMessage = 'Code snippet submitted successfully!';
        return NextResponse.json({
            snippet,
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
