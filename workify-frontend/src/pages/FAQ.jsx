import React from 'react';
import Navbar from '../components/Navbar';
import '../css/FAQ.css';

const FAQ = () => {
    return (
        <div>
            <Navbar />
            <div className="faq-page">
                <header className="faq-hero">
                    <div className="faq-hero-inner">
                        <p className="faq-eyebrow">Workify Help</p>
                        <h1 className="faq-title">FAQ</h1>
                        <p className="faq-subtitle">
                            Fast answers for seekers and recruiters. If you need more,
                            check the profile settings or contact support.
                        </p>
                    </div>
                </header>

                <section className="faq-section">
                    <h2 className="faq-section-title">For Job Seekers</h2>
                    <div className="faq-grid">
                        <details className="faq-card">
                            <summary>How do I apply for a job?</summary>
                            <p>Upload your resume in Profile first. Then use Apply in Browse Jobs or Dashboard.</p>
                        </details>
                        <details className="faq-card">
                            <summary>Why does Apply say I need a resume?</summary>
                            <p>Applications use your profile resume. Add it once and it is used for all jobs.</p>
                        </details>
                        <details className="faq-card">
                            <summary>Can I withdraw an application?</summary>
                            <p>Yes. If the status is pending, you can withdraw from the job card or the modal.</p>
                        </details>
                        <details className="faq-card">
                            <summary>How do I save jobs?</summary>
                            <p>Click the bookmark icon on a job card to save it. Access them in Saved Jobs.</p>
                        </details>
                    </div>
                </section>

                <section className="faq-section">
                    <h2 className="faq-section-title">For Recruiters</h2>
                    <div className="faq-grid">
                        <details className="faq-card">
                            <summary>How do I post a job?</summary>
                            <p>Use the + Post Job button. You can edit or delete later from the dashboard.</p>
                        </details>
                        <details className="faq-card">
                            <summary>How do I review applicants?</summary>
                            <p>Open Applicants from your job card. You can view profile details and resume.</p>
                        </details>
                        <details className="faq-card">
                            <summary>What does shortlist or reject do?</summary>
                            <p>It updates the candidate status. Seekers see the status on their side.</p>
                        </details>
                        <details className="faq-card">
                            <summary>Can I change a job logo?</summary>
                            <p>Yes. Edit the job and upload a new logo image.</p>
                        </details>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default FAQ;
