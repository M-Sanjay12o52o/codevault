import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
const axios = require('axios');
const { Buffer } = require('buffer');

export async function POST(req: Request, res: Response) {
    const { language, sourceCode, stdin } = (await req.json());

    let languageId: number = 0;

    if (language === "JavaScript") {
        languageId = 93
    } else if (language === "C++") {
        languageId = 76
    } else if (language === "Java") {
        languageId = 91
    } else if (language === "Python") {
        languageId = 92
    }

    console.log("languageId: ", languageId)

    if (!languageId) {
        return new NextResponse(
            JSON.stringify({
                status: "error",
                message: "Unsupported language"
            }),
            { status: 400 }
        );
    }

    try {
        const sanitizedReq = {
            sourceCode,
            stdin,
        };

        const encodedSourceCode = Buffer.from(sanitizedReq.sourceCode).toString('base64');
        const encodedStdin = Buffer.from(sanitizedReq.stdin).toString('base64');

        const options = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions',
            params: {
                base64_encoded: 'true',
                fields: '*'
            },
            headers: {
                'content-type': 'application/json',
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': process.env.JUDGE_O_API,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            data: {
                language_id: languageId,
                source_code: encodedSourceCode,
                stdin: encodedStdin
            }
        };

        try {
            const response = await axios.request(options);
            const responseData = response.data;
            const responseDataString = JSON.stringify(responseData)

            return new NextResponse(responseDataString)
        } catch (error: any) {
            console.error('Error submitting snippet:', error);
            return new NextResponse(
                JSON.stringify({
                    status: "error",
                    message: "An error occurred. Please check the server logs for details."
                }),
                { status: 500 }
            );
        }
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



