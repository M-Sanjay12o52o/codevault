import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(req: Request, res: Response) {
    const { snippetId } = (await req.json());

    console.log("snippetId: ", snippetId)

    try {

        const response = await db.codeSnippet.delete({
            where: { id: snippetId }
        })

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
