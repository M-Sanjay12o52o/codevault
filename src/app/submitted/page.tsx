"use client"

import SnippetList from '@/components/SnippetList';
import { redis } from '@/lib/redis';
import { FC, useEffect, useState } from 'react'

const CACHED_SNIPPETS_KEY = 'cachedSnippets';
const SNIPPET_EXPIRY_TIME = 60 * 60;

export default function SubmittedPage() {
    const [submittedSnippets, setSubmittedSnippets] = useState<CodeSnippet[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSnippets = async () => {
            setIsLoading(true);
            setError(null);

            // TODO: need to correct the logic of cache and db fetch
            // const cachedSnippets = await redis.get(CACHED_SNIPPETS_KEY);
            let cachedSnippets: unknown;
            const cachedSnippetsString = cachedSnippets as CodeSnippet[];

            if (cachedSnippets && cachedSnippetsString.length > 0) {

                setSubmittedSnippets(cachedSnippetsString)
                setIsLoading(false);
                return;
            } else {
                try {
                    // const response = await fetch('api/getsnippets');
                    // const response = await fetch("http://localhost:3001/judgeo");
                    const response = await fetch(`${process.env.SERVER_URL}/judgeo`);

                    if (!response.ok) {
                        throw new Error(`Failed to fetch snippets: ${response.statusText}`);
                    }
                    const data = await response.json();
                    setSubmittedSnippets(data.snippets);

                    await redis.set(CACHED_SNIPPETS_KEY, JSON.stringify(data.snippets), { ex: SNIPPET_EXPIRY_TIME }
                    )
                } catch (error: any) {
                    console.error('Error fetching snippets:', error);
                    setError(error.message);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchSnippets();
    }, []);

    return (
        <div>
            {isLoading && <p>Loading snippets...</p>}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && <SnippetList snippets={submittedSnippets} />
            }
        </div>
    )
}

