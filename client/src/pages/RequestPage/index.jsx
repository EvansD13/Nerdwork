import { useState, useEffect } from "react"
import { NavigationBar, TradeRequest, BookCard } from '../../components';
// Initial hardcoded data
import { useParams, useNavigate } from "react-router-dom";
import "./index.css"
import {Genre,Rating} from '../../components';

const RequestPage = () => {
  // State to keep track of books
  const [requests, setRequests] = useState([])
  const [item, setItem] = useState([])
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("")
  const [tradeRequest, setTradeRequest] = useState({})
  const navigate = useNavigate()
  let { id } = useParams()
  id = parseInt(id)
  const fetchRequest = async () => {
    try {
      const response = await fetch('https://nerdwork-server.onrender.com/trade/', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      const requestData = data.requests; // Access the Communities array in the response
      setRequests(requestData)
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const requestProfile = async (id, requests) => {
    const desiredRequestId = id;
    const singleRequest = findItemByRequestId(desiredRequestId, requests);
    setTradeRequest(singleRequest)
    const requestEmail = singleRequest.user_email_request
    const item_id = singleRequest.wanted_item_id
    let ourCategory = undefined
    try {
      const response = await fetch('https://nerdwork-server.onrender.com/item/', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      const itemData = data.Items; 
      const ourItem = itemData.filter(item => item_id == item.item_id)
      ourCategory = ourItem[0].category

      try {
        const response = await fetch(`https://nerdwork-server.onrender.com/user/${requestEmail}/${ourCategory}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const userData = await response.json();
        const itemDetail = userData.items; 
        setItem(itemDetail)
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    } catch (error) {
      console.error('Error fetching item:', error);
    }
  }



  useEffect(() => {
      requestProfile(id, requests);
  }, [id, requests]);

  function findItemByRequestId(requestId, data) {
    for (const item of data) {
        // console.log(item)
        if (item.request_id === requestId) {
            return item;
        }
    }
    return null;
  }

  function itemShelf() {
    const booksPerRow = 5;
  
    const rows = [];
  
    for (let i = 0; i < item.length; i += booksPerRow) {
      const row = item.slice(i, i + booksPerRow);
  
      // Adjusted the empty column width
      const emptyColumnLeft = <div className="col-1"></div>;
      const emptyColumnRight = <div className="col-1"></div>;
  
      const booksInRow = row.map((book) => (
        <div className="col-2 mb-3 mt-3" key={book.item_id}>
          <div className="book-card" onClick={() => handleBookClick(book)}>
            <h5>{book.title}</h5>
            <img src={book.img} alt="" />
          </div>
        </div>
      ));
  
      rows.push(
        <div className="row" key={i}>
          {emptyColumnLeft}
          {booksInRow}
          {emptyColumnRight}
        </div>
      );
    }
  
    return rows;
  }
  
  
  

  const handleBookClick = (i) => {
      setSelectedBook(i)
  }

  const printBook = () => {
    if (selectedBook === "") {
      return <p style={{marginTop: "30px"}}> Item selected:</p>
    } else {
      return (
      <div className="container" style={{width: "100%"}} >
        <div className='flexbox-container'>
          <div className='flexbox-container' style={{width: "600px"}}>
          </div>

        </div>
        <div className="title">
        </div>
        <h1 className="page-title-new">{selectedBook.title}</h1>
        <h4 className='page-author'> {selectedBook.author}</h4>
        <div className="image-container">
          <img src={selectedBook.img} alt={selectedBook.title} className="book-image"/>
        </div>
        <div className="text-content">
          <div className='description'>
            <h3> Description : </h3>
            <p className="selected-book-description">{selectedBook.description}</p>
          </div>
          <div className="rating">
            <Rating value={selectedBook.rating} />
          </div>
          <button onClick={handleSwapRequest} className="login-button">Confirm Trade</button>
        <button onClick={handleReject} className="login-button">Decline Trade</button>
        </div>

      </div>
    )}
  }


    async function handleSwapRequest(selectedBook) {
      const book_id = selectedBook.item_id
      try {
        const response = await fetch('https://nerdwork-server.onrender.com/trade/swap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_email_requester: tradeRequest.user_email_request,
            user_email_requestie: tradeRequest.user_email_requestie,
            wanted_item_id : tradeRequest.wanted_item_id,
            requestie_item_id: book_id,
            accepted: false,
            rejected_by_requester: false,
            date: null
          }),
        });
  
        navigate('/profile')
        if (!response.ok) {
          const errorBody = await response.json(); 
          throw new Error(`HTTP error! status: ${response.status}, Message: ${errorBody.message}`);
        }
      } catch(e){
    console.log(e)
  }
}

const handleReject = async () => {
  try {
      const response = await fetch('https://nerdwork-server.onrender.com/trade/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email_request : tradeRequest.user_email_request,
          user_email_requestie : tradeRequest.user_email_requestie,
          wanted_item_id : tradeRequest.wanted_item_id
          })
      });
      navigate('/profile')
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  }

  return (
    <>
      <NavigationBar />
      <h1>Your Requests</h1>
        <div>{itemShelf(item)}</div>

      { selectedBook !== "" ? (

          <div className="selected-book-new mt-5">
            {printBook()}
          </div>) :  <></>

      }
    </>
  );
};

export default RequestPage;