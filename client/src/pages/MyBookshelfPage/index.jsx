import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import Modal from "react-modal";
import "animate.css"
import { Container, Row, Col, Button, Form, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { NavigationBar, FormInput, FormMultiSelect, FormRating, FormSelect, Bookshelf } from '../../components';``




const apiURL = "https://nerdwork-server.onrender.com"
const siteURL = "https://nerdwork.onrender.com/"
const localURL = "http://localhost:5173/"


export default function MyBookshelfPage( { sidebarExtended, setSidebarExtended, onAddBook }){
    
    const [isModalOpen, setModalOpen] = useState(false)
    const [selectedBook, setSelectedBook] = useState(null)
    const [starRating, setStarRating] = useState("")
    const [modalArrowX, setModalArrowX] = useState(0);
    const [formOpen, setFormOpen] = useState(false)
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [error, setError] = useState('');
    const [initialBooks, setInitialBooks] = useState([])
    const [hoveredText, setHoveredText] = useState(["", "", "", ""])
    const [lowerText, setLowerText] = useState(["", ""])
    const [formData, setFormData] = useState({
        title: "",
        img: "",
        author: "",
        genre: [],
        issue_num: "",
        email: "",
        rating: 0,
        category: localStorage.shelf,
        description: null,
        tradeable: true
      });
      const [page, setPage] = useState(localStorage.shelf)
      const [username, setUsername] = useState("")

      let top_icons; let top_var; let top_strings

      const top_links = [`${siteURL}profile`, `${siteURL}profile/bookshelf`, `${siteURL}profile/bookshelf`, "/"]

      if (localStorage.shelf ==="book"){
        top_strings=["Profile", "Your Games", "Your Comics", "Your Friends"]
        top_icons = ["home", "sports_esports", "import_contacts", "diversity_3"]
        top_var = ["", "game", "comic book", ""]  
      }else if (localStorage.shelf ==="game"){
        top_strings=["Profile", "Your Books", "Your Comics", "Your Friends"]
        top_icons = ["home", "book", "import_contacts", "diversity_3"]
        top_var = ["", "book", "comic book", ""] 
 
      }else if (localStorage.shelf==="comic book"){
        top_strings=["Profile", "Your Books", "Your Games", "Your Friends"]
        top_icons = ["home", "book", "sports_esports", "diversity_3"]
        top_var = ["", "book", "game", ""] 
 

      }
      const bottom_strings = ["Settings", "Contact Us"]
      const bottom_icons = ["settings", "call"]
      const bottom_links = ["/", "/"]
  
      async function getUsername(){
          const options = {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization : localStorage.token,
            },
          }
          const response = await fetch(`${apiURL}/user/${localStorage.email}`, options)
          const data = await response.json()
          setUsername(data.username)
        }
        
        useEffect(() => {
            getUsername()
        }, [])

    function openModal(book){
        const stars = Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < Math.floor(book.rating) ? 'text-warning' : 'text-secondary'}>
              ★
            </span>
          ))
          
        const bookCardElement = document.getElementById(`Book_${book.item_id}`);
        const bookCardRect = bookCardElement.getBoundingClientRect();
        const modalArrowX = bookCardRect.left - bookCardRect.width/2;       
        setStarRating(stars)
        setModalArrowX(modalArrowX)
        setSelectedBook(book)
        
        setModalOpen(true)
    }
    function closeModal(){
        setSelectedBook(null)
        setModalOpen(false)
    }

    function openAdd(){
        setModalOpen(false)
        setFormOpen(true)   
    }
    function closeAdd(){
        setFormData({
            title: '',
            img: '',
            author: '',
            genres: [],
            email: '',
            rating: 0,
            category: localStorage.shelf,
            issue_num: null,
            description: null,
            tradeable: true
          })
        setFormOpen(false)
    }
    

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
      };
    
      const handleGenreChange = (selectedOption) => {
        let newSelected;
        if (selectedGenres.includes(selectedOption)) {
          newSelected = selectedGenres.filter(option => option !== selectedOption);
        } else {
          newSelected = [...selectedGenres, selectedOption];
        }
        setSelectedGenres(newSelected);
        setFormData(prev => ({ ...prev, genre: newSelected }));
      };
    
      useEffect(() => {
        const userEmail = localStorage.getItem('email');
        if (userEmail) {
          setFormData(prevFormData => ({ ...prevFormData, email: userEmail }));
        }
      }, []);
    
      const updateImage = async (title, email) => {
        try {
          const response = await fetch(`https://nerdwork-server.onrender.com/google/`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, email }),
          });
    
          if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, Message: ${errorBody.message}`);
          }
    
          // Handle the response here
          const result = await response.json();
          console.log('Image updated:', result);
          setFormOpen(false)
          getBooksAndFilter()
        } catch (error) {
          console.error('Error updating image:', error);
          setError(`There was a problem updating the image: ${error.message}`);
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const dataToSend = {
          ...formData,
          genre: selectedGenres, 
          issue_num: parseInt(formData.issue_num, 10),
          email: formData.email,
          rating: parseFloat(formData.rating) 
        };
    
        try {
          const response = await fetch('https://nerdwork-server.onrender.com/item/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.token
            },
            body: JSON.stringify(dataToSend),
          });
    
          if (!response.ok) {
            const errorBody = await response.json(); 
            throw new Error(`HTTP error! status: ${response.status}, Message: ${errorBody.message}`);
          }
    
          const result = await response.json();
          
          // Call the updateImage function after successful POST
          await updateImage(formData.title, formData.email);
          setFormData({
            title: "",
            img: "",
            author: "",
            genre: [],
            issue_num: "",
            email: "",
            rating: 0,
            category: localStorage.shelf,
            description: null,
            tradeable: true
        });
        setSelectedGenres([])
        setModalOpen(false)
          // navigate("/profile");
        } catch (error) {
          setError(`There was a problem adding your item: ${error.message}`);
          console.error('Error:', error);
        }
      };
    
    
    function generateBadges(genres){
        const genreBadges = genres && Array.isArray(genres) ? genres.map((genre, index) => (
            <Badge key={index} pill bg="secondary" className="mr-1" color='tertiary'>
              {genre}
            </Badge>
          )) : null;
        return (genreBadges

        )
    }

    function setShelf(shelf){
        console.log(`Before: ${localStorage.shelf}`)
        
        if (shelf != ""){
            localStorage.shelf=shelf
            console.log(`After: ${localStorage.shelf}`)
            setPage(shelf)
        }
        
    }


    async function getBooksAndFilter(){
        const options = {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: localStorage.token
            }
        }
        const response = await fetch(`${apiURL}/item/${localStorage.shelf}`, options)
        const data = await response.json()
    
        // Filter books based on the condition
        const filteredBooks = data.items.filter(book => book.email === localStorage.email);

        setInitialBooks(filteredBooks)

    }
    function hover(i){
      let initArray = ["", "", "", ""]
      initArray[i] = top_strings[i]
      setHoveredText(initArray)
    }
    function hover2(i){
      let initArray = ["", ""]
      initArray[i] = bottom_strings[i]
      setLowerText(initArray)

    }

    let title
    useEffect(() => {
        getBooksAndFilter()
        title = capitalisation()
    }, [page])

    function capitalisation() {
      const shelf = localStorage.getItem('shelf') || '';
      return shelf.charAt(0).toUpperCase() + shelf.slice(1);
    }
    
    
    return (
        
        <div className="flexbox-container profile-container">

            <div className="flexbox-item profile-sidebar">
                <div className="flexbox-container profile-bar" style = {{width: "100%"}}>
                    <div className="flexbox-container profile-header" style={{justifyContent: "center"}}>
                        <div className="flexbox-item">
                            <span className="dot">  
                                <i className="material-icons ikon">person</i>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flexbox-container option-box ">
                    {top_icons.map((icon, i) => (
                    <Link to={top_links[i]} className="link" key={i} onClick={() => [setShelf(top_var[i]), closeModal()]}>    
                        <div className={`flexbox-item profile-box ${i % 2 === 0 ? 'even' : 'odd'}`} onMouseOver={() => hover(i)} onMouseOut={() => setHoveredText(["", "", "", ""])}>
                                <i className="material-icons " style={{color: "whitesmoke"}}>{icon}</i>{hoveredText[i]}
                        </div>
                    </Link>
                    ))}
                </div>
                <div className="flexbox-item placeholder-box" style={{border: "transparent"}}>

                </div>
                <div className="flexbox-item option-row">
                    {bottom_icons.map((icon, i) => (
                        <Link to={bottom_links[i]} className="link" key={i} >
                            <div className={`flexbox-item profile-box ${i % 2 === 0 ? 'even' : 'odd'}`} onMouseOver={() => hover2(i)} onMouseOut={() => setLowerText(["", ""])} >
                                    <i className="material-icons" style={{color: "whitesmoke"}}>{icon}</i> {lowerText[i]}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="flexbox-container profile-bookshelf">
                <div className="flexbox-container box-header" style={{width:"100%"}}>
                    <div className="flexbox-item"style={{width:"50%", justifyContent: "flex-start"}}><h3 style ={{marginLeft: "20px"}}>Your {capitalisation()}s</h3></div>
                    <div className="flexbox-item add-book" style={{width:"50%", justifyContent: "flex-end"}}>
                            <h3>Add another {localStorage.shelf}</h3>
                                <i className="material-icons"
                                    onClick={openAdd} 
                                    style={{marginRight: "50px", marginLeft: "20px", marginBottom:"10px"}}>
                                        add_circle
                                </i>
                        </div>
                </div>
                <Modal
                    isOpen={formOpen}
                    onRequestClose={closeAdd}
                    contentLabel="Book Details"
                    className="modal-form"
                    
                >
                    <h2 style={{textAlign: "center"}}>Add a new book to your collection!</h2>
                        <Form onSubmit={handleSubmit} style={{width: "100%", textAlign: "center"}}>
                            <Row className="justify-content-md-center w-100">
                                <Col md={6}>
                                    <FormInput label="Title" type="text" placeholder="Enter title" name="title" value={formData.title} onChange={handleChange} />
                                    <FormInput label="Author" type="text" placeholder="Enter author's name" name="author" value={formData.author} onChange={handleChange} />
                                    <FormMultiSelect label="Genres" name="genre" selected={selectedGenres} options={['Cyberpunk', 'Superhero', 'Romance', 'Adventure', 'Thriller', 'Survival', 'Sport', 'Mecha', 'Musical', "Comedy", "Science Fiction", "Fantasy", "Historical", 'Other']} onChange={handleGenreChange} />
                                    <h3>Owner:</h3><p>{username}</p>
                                    {localStorage.shelf === "comic book" && (
                                        <FormInput label="Issue Number" type="text" placeholder="Enter Issue Number" name="issue_num" value={formData.issue_num} onChange={handleChange} />
                                    )}
                                    <FormRating label="Rating" name="rating" value={formData.rating} onChange={handleChange} min={0} max={5} step={0.1} />
                                    <Button variant="primary" type="submit" className="login-button">Submit</Button>
                                </Col>
                            </Row>    
                        </Form>

                </Modal>
                
                <div className="flexbox-item bookshelf-container" data-testid="bookshelf-container" style={{justifyContent:"flex-start"}}>
                    {
                    initialBooks.map((book, i) => (
                        <div className="test" key={i} onClick = {() => openModal(book)} id={`Book_${book.item_id}`}>
                            <img src={book.img} className= {selectedBook?.item_id=== book.item_id ? "selected-book insert-image" : "insert-image"}
                            />
                        </div>
                    ))}
                    
                </div>
            
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Book Details"
                    className="custom-modal"
                    overlayClassName="custom-overlay"
                >
                    {selectedBook && (
                    <>
                        <div className="flexbox-container">
                            <div className="flexbox-item" style={{width: "30%", justifyContent: "flex-start"}}>
                            <h3>{selectedBook.title}</h3>
                            </div>
                            <div className="flexbox-item" style={{width: "60%"}}>
                                {generateBadges(selectedBook.genre)}
                            </div>
                            <div className="flexbox-item" style={{width: "10%", justifyContent: "flex-end"}}>
                            <i className="material-icons close-ikon"
                                    onClick={closeModal} 
                                    style={{marginRight: "50px", marginLeft: "20px", marginBottom:"20px", color: "red"}}>
                                        cancel
                                </i>

                            </div>

                        </div>
                        <p>Author: {selectedBook.author}</p>
                        <div>{starRating}</div>
                        <p>{selectedBook.description}</p>
                        
                    </>
                    )}
                </Modal>
                {isModalOpen && selectedBook && (
                    <div className="modal-arrow" style={{ left: modalArrowX, marginTop: "-50px" }}></div>
                )}
            </div>
        </div>
    )
}