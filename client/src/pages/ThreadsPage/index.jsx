import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./threadspage.css"
export default function ThreadsPage() {
    const [community, setCommunity] = useState([]);
    const [threads, setThreads] = useState([]);
    const navigate = useNavigate();
    let { id } = useParams()
    id = parseInt(id)


    useEffect(() => {
        fetchThreads(id);
    },[id]);

    const fetchThreads = async (id) => {
    try {
        const response = await fetch(`https://nerdwork-qlxa.onrender.com
/community/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setCommunity(data.Communities) // This was added in with out testing properly 

        try {
            const response = await fetch(`https://nerdwork-qlxa.onrender.com
/thread/community/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const threadData = await response.json();
            setThreads(threadData.Threads)
        } catch (error) {
            console.error('Error fetching threads:', error);
        }
    } catch (error) {
        console.error('Error fetching threads:', error);
    }
    };

    const handleThreadClick = async (id) => {
    // navigate(`/home`)
    navigate(`/post/${id}`)
    }

    function displayThreads() {
        return threads.map(thread => (
            <div className="thread-card" key={thread.thread_id}>
            <h2 className="thread-title">{thread.title}</h2>
            <p className="thread-description">{thread.description}</p>
            <button className="view-button" onClick={() => handleThreadClick(thread.thread_id)}>View</button>
        </div>
        ));
    }


    return (
        <>
            <div className="thread-container">
                <div className="threads">{displayThreads()}</div>
            </div>
        </>
    );
}
