import { stdin } from 'process';
import { ButtonHTMLAttributes, FC, MouseEventHandler, useState } from 'react'

const SnippetList: FC<{ snippets: CodeSnippet[] }> = ({ snippets }) => {
    const [data, setData] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log("snippets list: ", snippets)

    const handleRun = async (snippet: CodeSnippet) => {
        console.log("hello from handlerun")

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
            setData(data)
        } catch (error) {
            console.error('Error submitting snippet:', error);
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <div>
            {data && <p>{data}</p>}
            <ul className='snippet-list'>
                {snippets.length !== 0 && snippets.map((snippet) => (
                    <li key={snippet.username + snippet.sourceCode}>
                        <div className='snippet-header'>
                            <h3>Username: {snippet.username}</h3>
                            <p>Language: {snippet.codeLanguage}</p>
                        </div>
                        <pre className='code bg-slate-200 p-4 rounded-lg'>{snippet.sourceCode}</pre>
                        <button
                            onClick={() => handleRun(snippet)}
                            className='run-button bg-blue-500 text-white px-4 py-2 rounded-md mt-2'
                        >
                            Run
                        </button>                    {
                            snippet.stdin && (
                                <div className='stdin'>
                                    <h4>Standard Input (stdin):</h4>
                                    <p>{snippet.stdin}</p>
                                </div>
                            )
                        }
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SnippetList