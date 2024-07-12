import React,  { useState, useEffect} from "react";
import SearchForm from "../SearchForm";
import BookSearchCard from "../BookSearchCard";
import { useNavigate } from "react-router-dom";
import "../BookSearchWidget/bookSearchWidget.css"
 

export default function ComicSearchWidget () {
    const [searchString, setSearchString] = useState("");
    const [comics, setComics] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        fetchComics();
    }, []);

    const fetchComics = async () => {
        try {
            const response = await fetch("https://nerdwork-qlxa.onrender.com/item/comic%20book"); 
            const data = await response.json();
            console.log(data)
            const comics = data.items
            setComics(comics);
        } catch (error) {
            console.log("ok")
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
    const uniqueData = removeDuplicateTitles(comics);
        function getComicsBy(title) {
        return comics.filter(comic => comic.title === title);
    }  
    console.log(uniqueData)
    function displayComics() {
        console.log("ok")
        return uniqueData
            .filter(comic => searchString.length == 0 || comic.title.toLowerCase().includes(searchString.toLowerCase()))
            .map(comic => ( 
            <div key={comic.item_id} onClick={() => displayUser(comic.item_id,comic)} >
            <BookSearchCard item={comic} />
            </div>
        ))
    }
    function displayUser(id,comic){
        const comicsWithTitle = getComicsBy(comic.title);
        console.log("naviate", comicsWithTitle )
        navigate(`/BookDetail/${id}`, { state: comicsWithTitle })
    }
      
    
    return(
        <div>
            <div className="bookHeading">
                <h1>Search Comics</h1>
            </div>
            <div className="searchbar">
                <SearchForm searchString={searchString} setSearchString={setSearchString}/>
            </div>
            <div className="cards-container" >
                {displayComics() }
            </div> 
        </div>
    )
}