"use client"

import { stdin } from 'process';
import { ButtonHTMLAttributes, FC, MouseEventHandler, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SnippetList: FC<{ snippets: CodeSnippet[] }> = ({ snippets }) => {
    const [token, setToken] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState<string>("bla bli blu")
    const router = useRouter();
    const [message, setMessage] = useState<string>("")

    console.log("snippets list: ", snippets)


    console.log("token: ", token);
    console.log("result: ", result)

    const handleRun = async (snippet: CodeSnippet) => {
        console.log("hello from handlerun")

        try {
            console.log("hello one")

            const response = await fetch("/api/postcode", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sourceCode: snippet.sourceCode,
                    stdin: snippet.stdin
                })
            })

            console.log("hello two")

            if (!response.ok) {
                console.log("hello !response.ok")

                throw new Error('Failed to fetch post status');
            }

            const data = await response.json();

            console.log("data frontend: ", data)

            if (data && data.token) {
                setToken(data.token);
            } else {
                throw new Error('Invalid response format: missing token');
            }

            setToken(data)
        } catch (error: any) {
            console.error('Error submitting snippet:', error);
            setError(error.message)
        } finally {
            setIsLoading(false);
            // try {
            //     const response = await fetch('api/getresult');
            //     if (!response.ok) {
            //         throw new Error(`Failed to fetch snippets: ${response.statusText}`);
            //     }
            //     const data = await response.json();
            //     setResult(data.stdout);
            // } catch (error: any) {
            //     console.error('Error fetching snippets:', error);
            //     setError(error);
            // } finally {
            //     setIsLoading(false);
            // }
        }

    }

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch("/api/delete", {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ snippetId: id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete code snippet');
            }

            setMessage("Code snippet deleted successfully")

            console.log('Code snippet deleted successfully');
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
            {token && <p>{token}</p>}
            {message && <p>{message}</p>}
            <header className="flex justify-center items-center mb-6">
                <h1 className="text-3xl font-bold text-center text-blue-500">Submitted</h1>
            </header>
            <ul className='snippet-list'>
                {snippets.length !== 0 && snippets.map((snippet) => (
                    <li key={snippet.username + snippet.sourceCode}>
                        <Card className='mx-96 my-8'>
                            <div className='relative'>
                                <p className='absolute top-0 right-0 p-2'>
                                    <X onClick={() => handleDelete(snippet.id)} className='cursor-pointer' />
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
                            {/* <CardFooter>
                                <p>Card Footer</p>
                            </CardFooter> */}
                        </Card>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SnippetList