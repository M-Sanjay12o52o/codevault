import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import axios from 'axios';

export async function GET(req: NextRequest, res: NextResponse,) {
    const token = req.nextUrl.searchParams.get('token');

    console.log("token: ", token)

    if (!token) {
        // Handle missing token error
        return new NextResponse(
            JSON.stringify({
                status: "error",
                message: "Missing token",
            }),
            { status: 401 }
        );
    }

    try {
        const options = {
            method: 'GET',
            url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
            params: {
                base64_encoded: 'true',
                fields: '*'
            },
            headers: {
                'X-RapidAPI-Key': process.env.JUDGE_O_API,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            const responseData = response.data;
            console.log("response.data: ", responseData);

            return new NextResponse(responseData)
        } catch (error) {
            console.error(error);
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
