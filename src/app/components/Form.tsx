"use client"

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
        } catch (error) {
            console.error('Error submitting snippet:', error);
        }
    };

    const codeLanguageOptions = ['C++', 'Java', 'JavaScript', 'Python'];

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="codeLanguage">Preferred Code Language:</label>
                <select id="codeLanguage" name="codeLanguage" value={formData.codeLanguage} onChange={handleChange} required>
                    <option value="">-- Select Language --</option>
                    {codeLanguageOptions.map((language) => (
                        <option key={language} value={language}>
                            {language}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="stdin">Standard Input (stdin):</label>
                <textarea
                    id="stdin"
                    name="stdin"
                    value={formData.stdin}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Enter standard input (optional)"
                />
            </div>
            <div className="form-group">
                <label htmlFor="sourceCode">Source Code:</label>
                <textarea
                    id="sourceCode"
                    name="sourceCode"
                    value={formData.sourceCode}
                    onChange={handleChange}
                    rows={10}
                    required
                    placeholder="Enter your code here"
                />
            </div>
            <button type="submit" className="submit-button">
                Submit
            </button>
        </form>
    );
};

export default Form;
