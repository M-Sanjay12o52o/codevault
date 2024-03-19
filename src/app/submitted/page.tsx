"use client"

import SnippetList from '@/components/SnippetList';
import { FC, useEffect, useState } from 'react'

const page: FC<CodeSnippet> = ({ }) => {
    const [submittedSnippets, setSubmittedSnippets] = useState<CodeSnippet[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSnippets = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('api/getsnippets');
                if (!response.ok) {
                    throw new Error(`Failed to fetch snippets: ${response.statusText}`);
                }
                const data = await response.json();
                setSubmittedSnippets(data.snippets);
            } catch (error: any) {
                console.error('Error fetching snippets:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSnippets();
    }, []);

    return <div>
        {isLoading && <p>Loading snippets...</p>}
        {error && <p className="error-message">{error}</p>}
        <SnippetList snippets={submittedSnippets} />
    </div>
}

export default page