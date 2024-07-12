import React,  {useState, useEffect } from "react";
import SearchForm from "../SearchForm";
import "./bookSearchWidget.css"
import BookSearchCard from "../BookSearchCard";
import { useNavigate } from "react-router-dom";

export default function BookSearchWidget () {
    const [searchString, setSearchString] = useState("");
    const [books, setBooks] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        fetchBooks();
    }, []);
   

    const fetchBooks = async () => {
        try {
            const response = await fetch('https://nerdwork-server.onrender.com/item/book'); 
            const data = await response.json();
            console.log(data)
            const book = data.items
            setBooks(book);
            // Initially display all books
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };
    function removeDuplicateTitles(data) {
        const uniqueTitles = new Set();
        const filteredData = [];
      
        data.forEach(item => {
          if (!uniqueTitles.has(item.title)) {
            uniqueTitles.add(item.title);
            filteredData.push(item);
          }
        });
        console.log(filteredData)
        return filteredData;
    }
      
      
    const uniqueData = removeDuplicateTitles(books);
    function getBooksByTitle(title) {
        return books.filter(book => book.title === title);
    }

    function displayBooks() {
        return uniqueData
                .filter(book => searchString.length == 0 || book.title.toLowerCase().includes(searchString.toLowerCase()))
                .map(book => ( 
                <div key={book.item_id} onClick={() => displayUser(book.item_id,book)} >
                    <BookSearchCard item={book} />
                </div>
            ))
    }
    function displayUser(id,book){
        const booksWithTitle = getBooksByTitle(book.title);
        console.log("naviate", booksWithTitle )
        navigate(`/BookDetail/${id}`, { state: booksWithTitle  })
    }
    return(
        <div>
            <div className="bookHeading">
                <h1>Search Books</h1>
            </div>
            <div className="searchbar">
                <SearchForm searchString={searchString} setSearchString={setSearchString}/>
            </div>
            <div className="cards-container" >
               {displayBooks() }
            </div> 
        </div>
    )
}