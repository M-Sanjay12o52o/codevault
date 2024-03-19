"use client"

import SnippetList from '@/components/SnippetList';
import { redis } from '@/lib/redis';
import { FC, useEffect, useState } from 'react'

const CACHED_SNIPPETS_KEY = 'cachedSnippets';
const SNIPPET_EXPIRY_TIME = 60 * 60;

const page: FC<CodeSnippet> = ({ }) => {
    const [submittedSnippets, setSubmittedSnippets] = useState<CodeSnippet[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log("submittedSnippets: ", submittedSnippets)

    useEffect(() => {
        const fetchSnippets = async () => {
            setIsLoading(true);
            setError(null);

            const cachedSnippets = await redis.get(CACHED_SNIPPETS_KEY);
            const cachedSnippetsString = cachedSnippets as CodeSnippet[];

            if (cachedSnippets && cachedSnippetsString.length > 0) {

                console.log("cached snippets")
                setSubmittedSnippets(cachedSnippetsString)
                setIsLoading(false);
                return;
            } else {
                console.log("hello from else")
                try {
                    const response = await fetch('api/getsnippets');
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

    return <div>
        {isLoading && <p>Loading snippets...</p>}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && <SnippetList snippets={submittedSnippets} />
        }
    </div>
}

export default page