"use client"

import { ButtonHTMLAttributes, FC, MouseEventHandler, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SnippetList: FC<{ snippets: CodeSnippet[] }> = ({ snippets }) => {
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState<string>("bla bli blu")
    const router = useRouter();
    const [message, setMessage] = useState<string>("")

    const handleRun = async (snippet: CodeSnippet) => {
        try {
            const response = await fetch("/api/postcode", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sourceCode: snippet.sourceCode,
                    stdin: snippet.stdin
                })
            })

            if (!response.ok) {
                throw new Error('Failed to fetch post status');
            }

            const data = await response.json();

            if (data) {
                setToken(data.token)
                fetchResult(data.token)
            } else {
                throw new Error('Invalid response format: missing token');
            }

        } catch (error: any) {
            console.error('Error submitting snippet:', error);
            setError(error)
        }

    }

    const fetchResult = async (token: string) => {
        try {
            const response = await fetch(`api/getresult?token=${token}`);

            console.log("fetchResult response: ", response)

            if (!response.ok) {
                throw new Error(`Failed to fetch snippets: ${response.statusText}`);
            }
            const data = await response.json();
            console.log("result data: ", data)
            var base64Data = data.stdout;
            var textData = atob(base64Data);

            setResult(textData);
        } catch (error: any) {
            console.error('Error fetching snippets:', error);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const comment = async () => {
        const { data } = await axios.post('/api/comment', {
            text: 'hello',
            tags: ['TypeScript']
        })
    }

    const handleDelete = async (id: string) => {
        try {
            setIsLoading(true)
            const response = await fetch("/api/delete", {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ snippetId: id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete code snippet');
            }

            setMessage("Code snippet deleted successfully")
        } catch (error) {
            console.error('Error deleting code snippet:', error);
        } finally {
            setIsLoading(false);
            setMessage('');
        }
    };

    return (
        <div className='mt-4'>
            <ArrowLeft className='m-4 cursor-pointer' onClick={() => router.push("/")} />
            {token && <p>token: {token}</p>}
            <header className="flex justify-center items-center mb-6">
                <h1 className="text-3xl font-bold text-center text-blue-500">Submitted</h1>
            </header>
            <ul className='snippet-list'>
                {!isLoading && snippets.length === 0 && <h1 className="text-center text-gray-500 font-medium">
                    No snippets found
                </h1>}
                {snippets.length !== 0 && snippets.map((snippet) => (
                    <li key={snippet.id}>
                        <Card className='mx-96 my-8'>
                            <p>{snippet.id}</p>
                            <div className='relative'>
                                <p className='absolute top-0 right-0 p-2'>
                                    {
                                        snippet.id && <X onClick={() => handleDelete(snippet.id as string)}
                                            className='cursor-pointer'
                                        />
                                    }
                                </p>
                            </div>
                            <CardHeader>
                                {snippet.title ? (
                                    <div>
                                        <CardTitle>{snippet.title}</CardTitle>
                                        <CardDescription>Description: {snippet.description}</CardDescription>
                                    </div>
                                ) : (
                                    <div>
                                        <CardTitle>{snippet.username}</CardTitle>
                                        <CardDescription>Language: {snippet.codeLanguage}</CardDescription>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent>
                                <pre className='code text-black bg-slate-200 p-4 rounded-lg'>
                                    {snippet.sourceCode}
                                </pre>
                                {snippet.stdin && (
                                    <div className='stdin'>
                                        <h1 className='mt-2 text-sm text-muted-foreground'>Standard Input (stdin):</h1>
                                        <p className='bg-gray-200 text-gray-800 py-2 px-4 rounded-md mt-2'>{snippet.stdin}</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => handleRun(snippet)}
                                    className='run-button bg-blue-500 text-white px-4 py-2 rounded-md mt-2'
                                >
                                    Run
                                </button>
                                {result && (
                                    <div>
                                        <p className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mt-2">
                                            Result: {result}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className='flex flex-col flex-initial'>
                                <p>Card Footer</p>
                                {/* <button onClick={comment}>make comment</button> */}
                                <button onClick={comment}>upvote</button>
                            </CardFooter>
                        </Card>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SnippetList