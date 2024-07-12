import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./postPage.css"
export default function PostPage() {
    const [thread, setThread] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState('');

    let { thread_id } = useParams()
    thread_id = parseInt(thread_id)
    console.log("ok")
    useEffect(() => {
        fetchPosts(thread_id);
    },[thread_id]);

    const fetchPosts = async (thread_id) => {
    try {
        const response = await fetch(`https://nerdwork-qlxa.onrender.com
/thread/${thread_id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setThread(data)
        
        try {
            const response = await fetch(`https://nerdwork-qlxa.onrender.com
/post/`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            let postsData = await response.json();
            postsData = postsData.Posts
            const postData = postsData.filter(post => post.thread_id === thread_id)
            console.log(postData)
            setPosts(postData)
        } catch (error) {
            console.error('Error fetching threads:', error);
        }
    } catch (error) {
        console.error('Error fetching threads:', error);
    }
    };
    const handleCommentChange = (event) => {
        setComment(event.target.value);
      };
    
    function displayPost() {
        return posts.map(post => (
            <article className="post-card" key={post.post_id}>
                <header className="post-head">
                    <img className="user-avatar" src={post.avatar} alt={`${post.username}'s avatar`} />
                    <h3 className="user-email">{post.email}</h3>
                </header>
                <section className="post-body">
                    <p>{post.body}</p>
                </section>
                <footer className="post-footer">
                    <span className="vote-icon"></span> {/* Replace with an actual icon */}
                    <span className="vote-count">{post.votes}</span>
                </footer>
            </article>
        ));
    }
    const postComment = () => {
        const url = `https://nerdwork-qlxa.onrender.com
/post/`; // Replace with your actual endpoint
        const email = localStorage.getItem('email'); // Assuming email is stored in localStorage
        console.log("ok2")
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any other headers your API requires
          },
          body: JSON.stringify({
            thread_id : 1,
            post_title : "nothing",
            email: email, // Include email if needed
            comment: comment, // The comment text from the input
            vote: 0
          }),
        })

        .then(response => {
          if (response.ok) {
            console.log("ok2")
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .catch((error) => {
          console.error('Error:', error);
          // Handle errors here
        });
      };

    return (
        
        <section className="thread">
            <header className="thread-head">
                <h1 className="thread-title">{thread.title}</h1>
                <p className="thread-description">{thread.description}</p>
            </header>
            <div className="comment-section">
                <div className="comment-header">
                <span> Comment as {localStorage.getItem("email")} </span>
                </div>
                <div className="comment-body">
                <textarea className="comment-input" type="text" value={comment} onChange={handleCommentChange}>
                </textarea> 
                </div>
                <div className="comment-footer"> {/* Wrap the button in a footer div for styling */}
                <button className="comment-button" onClick={postComment}>Post</button> {/* Corrected className */}
                </div>
            </div>
            <div className="sorter">
                <label htmlFor="sort-select">Sort by:</label>
                <select id="sort-select">
                <option value="most-voted">Most voted</option>
                <option value="least-voted">Least voted</option>
                </select>
            </div>
            <div className="posts-container">
                {displayPost()}
            </div>
        </section>

        
    );
}
