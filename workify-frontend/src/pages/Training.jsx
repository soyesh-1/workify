import React from 'react';
import Navbar from '../components/Navbar';
import '../css/Training.css';

const videos = [
    {
        id: 'dQw4w9WgXcQ',
        title: 'Resume Building: How to Write a Strong Resume in 2025'
    },
    {
        id: 'sBws8MSXN7A',
        title: 'React JS Full Course for Beginners - Learn React in 2025'
    },
    {
        id: '3jZ5vnv-LZc',
        title: 'Interview Prep: Top 30 Questions and Answers'
    }
];

const Training = () => {
    return (
        <div>
            <Navbar />
            <div className="training-page">
                <header className="training-hero">
                    <div className="training-hero-inner">
                        <h1>Training</h1>
                        <p>Curated videos to boost your skills and get hired faster.</p>
                    </div>
                </header>

                <section className="training-grid">
                    {videos.map(video => (
                        <a
                            key={video.id}
                            className="training-card"
                            href={`https://www.youtube.com/watch?v=${video.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="training-thumb">
                                <img
                                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                                    alt={video.title}
                                />
                            </div>
                            <div className="training-title">{video.title}</div>
                        </a>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default Training;
