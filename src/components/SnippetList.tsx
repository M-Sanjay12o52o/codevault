"use client"

import { ButtonHTMLAttributes, FC, MouseEventHandler, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production'

const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3001';

const SnippetList: FC<{ snippets: CodeSnippet[] }> = ({ snippets }) => {
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState<string>("bla bli blu")
    const router = useRouter();
    const [message, setMessage] = useState<string>("")
    const [results, setResults] = useState<{ [key: string]: string }>({});

    console.log("token: ", token)

    const handleRun = async (snippet: CodeSnippet) => {
        try {
            setIsLoading(true)

            // const response = await fetch("/api/postcode", {
            // const response = await fetch("http://localhost:3001/result", {
            const response = await fetch(`${serverUrl}/result`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: snippet.codeLanguage,
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
                fetchResult(snippet.id, data.token)
            } else {
                throw new Error('Invalid response format: missing token');
            }

        } catch (error: any) {
            console.error('Error submitting snippet:', error);
            setError(error)
        } finally {
            setIsLoading(false);
        }

    }

    const fetchResult = async (snippetId: string | undefined, token: string) => {
        try {
            // const response = await fetch(`api/getresult?token=${token}`);

            // const response = await fetch(`http://localhost:3001/result?token=${token}`)

            const response = await fetch(`${serverUrl}/result?token=${token}`)

            console.log("fetchResult response: ", response)

            if (!response.ok) {
                throw new Error(`Failed to fetch snippets: ${response.statusText}`);
            }
            const data = await response.json();

            console.log("typeof data: ", data)
            console.log("data: ", data)

            var base64Data = data.stdout;

            var textData = atob(base64Data);

            setResult(textData);
            setResults({ ...results, [snippetId!]: textData })
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
        <div className='container mx-auto max-w-screen-md px-4'>
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
                    <li key={snippet.id} className='mb-8'>
                        <Card className='mx-auto max-w-md p-4 rounded-lg shadow-md'>
                            <p>{snippet.id}</p>
                            <div className='flex items-start justify-end'>
                                <p className='cursor-pointer'>  {
                                    snippet.id && <X onClick={() => handleDelete(snippet.id as string)} />
                                }
                                </p>
                            </div>
                            <CardHeader>
                                {snippet.title ? (
                                    <div>
                                        <CardTitle>{snippet.title}</CardTitle>
                                        <CardDescription>Description: {snippet.description}</CardDescription>
                                        <p className='font-thin'>Lang: {snippet.codeLanguage}</p>
                                    </div>
                                ) : (
                                    <div>
                                        <CardTitle>{snippet.username}</CardTitle>
                                        <CardDescription>Language: {snippet.codeLanguage}</CardDescription>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className='overflow-hidden'>
                                <pre className='code text-black bg-slate-200 p-4 rounded-lg whitespace-pre-wrap'>
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
                                {results && (
                                    <div>
                                        <p className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mt-2">
                                            Result: {results.snippetId}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className='flex items-center justify-between'>
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