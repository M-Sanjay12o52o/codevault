"use client"

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface FormData {
    id: number;
    username: string;
    codeLanguage: string;
    stdin: string;
    sourceCode: string;
}

const Form: React.FC = () => {
    const [submittedSnippets, setSubmittedSnippets] = useState<CodeSnippet[]>([]);
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        id: 0,
        username: '',
        codeLanguage: '',
        stdin: '',
        sourceCode: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch("/api/postsnippet", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error('Failed to submit snippet');
            }

            console.log('Form submitted:', formData);
            const newSnippet = { ...formData };
            setSubmittedSnippets([...submittedSnippets, newSnippet])

            setFormData({ id: 0, username: '', codeLanguage: '', stdin: '', sourceCode: '' });

            router.push("/submitted")
        } catch (error) {
            console.error('Error submitting snippet:', error);
        }
    };

    const codeLanguageOptions = ['C++', 'Java', 'JavaScript', 'Python'];

    return (
        <div>
            <form className="user-code-form space-y-4" onSubmit={handleSubmit}>
                <fieldset className="border rounded-lg p-4">
                    <legend className="font-semibold text-lg">User Information</legend>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center">
                            <label htmlFor="username" className="w-1/3 text-sm font-medium mr-2">
                                Username:
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="Enter your username"
                                className="text-black font-medium w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center">
                            <label htmlFor="codeLanguage" className="w-1/3 text-sm font-medium mr-2">
                                Preferred Code Language:
                            </label>
                            <select
                                id="codeLanguage"
                                name="codeLanguage"
                                value={formData.codeLanguage}
                                onChange={handleChange}
                                required
                                className="text-black font-medium w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">-- Select Language --</option>
                                {codeLanguageOptions.map((language) => (
                                    <option key={language} value={language}>
                                        {language}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset className="border rounded-lg p-4 mt-4">
                    <legend className="font-semibold text-lg">Code Input</legend>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center">
                            <label htmlFor="stdin" className="w-1/3 text-sm font-medium mr-2">
                                Standard Input (stdin):
                            </label>
                            <textarea
                                id="stdin"
                                name="stdin"
                                value={formData.stdin}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Enter standard input (optional)"
                                className="text-black font-medium w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center">
                            <label htmlFor="sourceCode" className="w-1/3 text-sm font-medium mr-2">
                                Source Code:
                            </label>
                            <textarea
                                id="sourceCode"
                                name="sourceCode"
                                value={formData.sourceCode}
                                onChange={handleChange}
                                rows={10}
                                required
                                placeholder="Enter your code here"
                                className="text-black font-medium w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </fieldset>
                <div className="flex justify-end mt-4">
                    <button type="submit" className="px-4 py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Form;
