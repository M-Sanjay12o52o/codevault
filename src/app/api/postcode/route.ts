import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
const axios = require('axios');
const { Buffer } = require('buffer');

export async function POST(req: Request, res: Response) {
    const { sourceCode, stdin } = (await req.json());

    console.log("sourceCode postcode: ", sourceCode)

    try {
        const sanitizedReq = {
            sourceCode,
            stdin,
        };

        const encodedSourceCode = Buffer.from(sanitizedReq.sourceCode).toString('base64');
        const encodedStdin = Buffer.from(sanitizedReq.stdin).toString('base64');

        console.log("encodedSourceCode :", encodedSourceCode, "encodedStdin: ", encodedStdin)

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
                'X-RapidAPI-Key': '19d70677acmsh33c55bf1103890dp107b17jsndfe8f69f61f5',
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            data: {
                language_id: 52,
                source_code: encodedSourceCode,
                stdin: encodedStdin
            }
        };

        try {
            const response = await axios.request(options);
            console.log(response.data);

            return new NextResponse(
                JSON.stringify({
                    response
                })
            )
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



