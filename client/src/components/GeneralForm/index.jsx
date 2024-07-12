import React, { useState, useEffect } from "react"
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { FormInput, FormMultiSelect, FormRating, FormSelect, NavigationBar } from '../../components';


export default function GeneralForm( { onAddBook, modalOpen, setModalOpen } ){
    const [formData, setFormData] = useState({
        title: "",
        img: "",
        author: "",
        genre: [],
        issue_num: "",
        email: "",
        rating: 0,
        category: "",
        description: null,
        tradeable: true
      });
      const [selectedgenre, setSelectedgenre] = useState([]);
      const [error, setError] = useState('');
      const navigate = useNavigate();
    
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
        } catch (error) {
          console.error('Error updating image:', error);
          setError(`There was a problem updating the image: ${error.message}`);
        }
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const dataToSend = {
          ...formData,
          genre: selectedgenre, 
          issue_num: parseInt(formData.issue_num, 10),
          email: formData.email,
          rating: parseFloat(formData.rating) 
        };
    
        try {
          const response = await fetch('https://nerdwork-server.onrender.com/item/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
          });
    
          if (!response.ok) {
            const errorBody = await response.json(); 
            throw new Error(`HTTP error! status: ${response.status}, Message: ${errorBody.message}`);
          }
    
          const result = await response.json();
          console.log(result);
          await updateImage(formData.title, formData.email);
          setModalOpen(false)
    
          // Call the updateImage function after successful POST
    
          // navigate("/profile");
        } catch (error) {
          setError(`There was a problem adding your item: ${error.message}`);
          console.error('Error:', error);
        }
      };
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };
    
      const handleGenreChange = (selectedOption) => {
        let newSelected;
        if (selectedgenre.includes(selectedOption)) {
          newSelected = selectedgenre.filter(option => option !== selectedOption);
        } else {
          newSelected = [...selectedgenre, selectedOption];
        }
        setSelectedgenre(newSelected);
        setFormData(prev => ({ ...prev, genre: newSelected }));
      };
    

    return(
    <div style={{width: "100%"}}>
        <Row className="justify-content-md-center w-100">
            <Col md={6}>
            <h2 style={{textAlign: "center"}}>Add New Item</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} style={{textAlign: "center"}}>
                <FormInput label="Title" type="text" placeholder="Enter title" name="title" value={formData.title} onChange={handleChange} />
                {/* <FormInput label="Image URL" type="text" placeholder="Enter image URL" name="img" value={formData.img} onChange={handleChange} /> */}
                <FormInput label="Author" type="text" placeholder="Enter author's name" name="author" value={formData.author} onChange={handleChange} />
                <FormMultiSelect label="Genres" name="genre" selected={selectedgenre} options={['Cyberpunk', 'Superhero', 'Romance', 'Adventure', 'Thriller', 'Survival', 'Sport', 'Mecha', 'Musical', "Comedy", "Science Fiction", "Fantasy", "Historical", 'Other']} onChange={handleGenreChange} />
                <FormInput label="Issue Number" type="text" placeholder="Enter issue number" name="issue_num" value={formData.issue_num} onChange={handleChange} />
                {/* <FormInput label="Email" type="text" placeholder="Enter your email" name="email" value={formData.email} onChange={handleChange} /> */}
                <FormRating label="Rating" name="rating" value={formData.rating} onChange={handleChange} min={0} max={5} step={0.1} />
                <FormSelect label="Category" name="category" value={formData.category} options={[{ value: 'book', label: 'Book' }, { value: 'comic book', label: 'Comic Book' }, { value: 'game', label: 'Game' }]} onChange={handleChange} />
                <Button variant="primary" type="submit" className="login-button">Submit</Button>
            </Form>
            </Col>
        </Row>
    </div>
    )
}