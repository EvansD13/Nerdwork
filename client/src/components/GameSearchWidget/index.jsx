import React,  { useState, useEffect} from "react";
import SearchForm from "../SearchForm";
import BookSearchCard from "../BookSearchCard";
import { useNavigate } from "react-router-dom";


export default function GameSearchWidget () {
    const [searchString, setSearchString] = useState("");
    const [games, setGames] = useState([]);
    const navigate = useNavigate()


    useEffect(() => {
        fetchComics();
    }, []);

    const fetchComics = async () => {
        try {
            const response = await fetch("https://nerdwork-qlxa.onrender.com
/item/game"); 
            const data = await response.json();
            console.log(data)
            const games = data.items
            setGames(games);
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
    const uniqueData = removeDuplicateTitles(games);
        function getGamesBy(title) {
        return games.filter(game => game.title === title);
    }  
    console.log(uniqueData)
    function displayComics() {
        return uniqueData
            .filter(game => searchString.length == 0 || game.title.toLowerCase().includes(searchString.toLowerCase()))
            .map(game => ( 
            <div key={game.item_id} onClick={() => displayUser(game.item_id,game)} >
            <BookSearchCard item={game}/>
            </div>
        ))
    }
    function displayUser(id,game){
        const gamesWithTitle = getGamesBy(game.title);
        console.log("naviate", gamesWithTitle )
        navigate(`/BookDetail/${id}`, { state: gamesWithTitle })
    }
      
    
    return(
        <div>
            <div className="bookHeading">
                <h1>Search Games</h1>
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