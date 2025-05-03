import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Resumes() {
    const [resumes, setResumes] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('resumes')) || {};
        setResumes(stored);
    }, []);

    // Helper to extract creation date from ID
    const formatDate = (resumeId) => {
        const timestamp = Number(resumeId.split('-')[1]);
        if (!isNaN(timestamp)) {
            return new Date(timestamp).toLocaleString();
        }
        return 'Unknown Date';
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold mb-6 text-center">Your Saved Resumes</h2>

            {Object.keys(resumes).length === 0 ? (
                <p className="text-center text-gray-500">No resumes found. Start building one!</p>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {Object.entries(resumes)
                        .sort(([aId], [bId]) => Number(bId.split('-')[1]) - Number(aId.split('-')[1])) // Newest first
                        .map(([id], index, arr) => (
                            <button
                                key={id}
                                onClick={() => navigate(`/resume/${id}`)}
                                className="text-left w-full p-4 bg-white shadow rounded hover:shadow-md transition"
                            >
                                <h3 className="text-xl font-semibold text-sky-800">
                                    Resume V{arr.length - index}
                                </h3>
                                <p className="text-gray-600 text-sm">Created on: {formatDate(id)}</p>
                            </button>
                        ))}


                </div>
            )}
        </div>
    );
}
