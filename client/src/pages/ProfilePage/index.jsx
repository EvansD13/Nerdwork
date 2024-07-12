import { useState, useEffect } from "react"
import React from "react"
import "./style.css"
import { Link } from "react-router-dom"
import { GeneralForm, BookCard } from "../../components"
import Modal from "react-modal"
import { useNavigate } from "react-router-dom";
import Penguin from "../../assest/icons/penguin.png"



const apiURL = "https://nerdwork-qlxa.onrender.com
"
const siteURL = "https://nerdwork.onrender.com/"
const localURL = "http://localhost:5173/"
export default function ProfilePage(){
    const [username, setUsername] = useState("");
    const [requests, setRequests] = useState([]);
    const [swap, setSwap] = useState([]);
    const [item, setItem] = useState([])
    const [books, setBooks] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [carouselItems, setCarouselItems] = useState([])
    const [userItems, setUserItems] = useState([])
    const [notifications, setNotifications] = useState(0)
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const [requestNum, setRequestNum] = useState(0)
    const [swapNum, setSwapNum] = useState(0)
    const navigate = useNavigate()

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

      const fetchRequest = async () => {
        try {
          const response = await fetch('https://nerdwork-qlxa.onrender.com
/trade/', {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          const requestData = data.requests; 
          const filteredRequests = requestData.filter(request => request.user_email_requestie === localStorage.email && request.rejected_by_requestie===false);
          console.log(filteredRequests.length)

          setRequestNum(filteredRequests.length)
          setRequests(filteredRequests)
        } catch (error) {
          console.error('Error fetching requests:', error);
        }
      };

      const fetchItems = async () => {
        try {
          const response = await fetch('https://nerdwork-qlxa.onrender.com
/item/', {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          const itemData = data.Items; 
          const uniqueData = removeDuplicateTitles(itemData);

          setItem(uniqueData)
        } catch (error) {
          console.error('Error fetching item:', error);
        }
      };

    const fetchSwap = async () => {
        try {
          const response = await fetch('https://nerdwork-qlxa.onrender.com
/trade/swap', {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          const swapData = data.swaps;
          const filteredSwaps = swapData.filter(swap => swap.user_email_requester === localStorage.email && swap.accepted == false && swap.rejected_by_requester == false)
          setSwapNum(filteredSwaps.length)
          setSwap(swapData)
        } catch (error) {
          console.error('Error fetching requests:', error);
        }
    };

    useEffect(() => {
        fetchRequest();
        fetchSwap()
    }, [notifications]);

    useEffect(() => {
      notificationLength()
    }, [swapNum, requestNum])
    
    useEffect(() => {
      fetchSwap()
    }, []);


    function notificationLength(){
      const n = swapNum + requestNum
      console.log(`Notifications: ${n}`)
      setNotifications(n)
    }

    useEffect(() => {
      getUsername()
      fetchItems()
    }, []); 
  

    const top_rows = ["My Bookshelf", "My Games", "My Comics", "My Friends"]
    const top_icons = ["book", "sports_esports", "import_contacts", "diversity_3"]
    const top_var = ["book", "game", "comic book", ""]
    const top_links = [`${siteURL}profile/bookshelf`, `${siteURL}profile/bookshelf`, `${siteURL}profile/bookshelf`, "/"]

    const bottom_rows = ["Settings", "Contact Us"]
    const bottom_icons = ["settings", "call"]
    const bottom_links = ["/", "/"] 

    function displayRequests() {
        const filteredRequests = requests.filter(
            (request) =>
                request.user_email_requestie === localStorage.getItem('email') &&
                request.rejected_by_requestie === false
        );
        if (filteredRequests.length === 0) {
            return <div className="flexbox-container">
            <p>No Notifications!</p>
            <div className="flexbox-item" style={{justifyContent:"flex-end"}}>
                <i
                    className="material-icons close-ikon"
                    onClick={() => closeNotifications()}
                    style={{ position: 'relative', left: '470px', color: 'red' }}
                >
                    cancel
                </i>
            </div>
        </div>;
        }
    
        return (
            <div style={{width: "100%"}}>
                <div className="flexbox-container" style={{justifyContent: "flex-end", marginRight: "20px"}}>
                    <i
                        className="material-icons close-ikon"
                        onClick={() => closeNotifications()}
                        style={{ color: 'red' }}
                    >
                        cancel
                    </i>
                </div>
                {filteredRequests.map((request) => (
                    <div className="flexbox-container flexbox-requests" key={request.request_id} style={{marginBottom: "40px"}}>
                        <div className="flexbox-container">
                            <h2>{request.user_email_request} has requested a swap!</h2>
                            
                        </div>
    
                        <p>
                            The user has requested to trade for{' '}
                            {item.filter((items) => items.item_id === request.wanted_item_id).map((item) => item.title)}
                        </p>
                        <div className="flexbox-container">
                            <button className="login-button" onClick={() => handleViewTrades(request)}>
                                View Trades
                            </button>
                            <div style={{ width: '20px' }}></div>
                            <button className="login-button" onClick={() => handleReject(request)}>
                                Reject
                            </button>

                        </div>
                    </div>
                    
                ))}
            </div>
        );
    }
    function displayApproval() {
        return swap.filter(swaps => swaps.user_email_requester === localStorage.getItem('email') && swaps.accepted == false && swaps.rejected_by_requester == false)
        .map(swap => (
            <div key={swap.swap_id} >
                <h2>{swap.user_email_swap} requested to trade</h2>
                <p>You asked to trade for {item.filter(items => items.item_id == swap.wanted_item_id).map(item => item.title)}</p>
                <p>They wanted to trade for {item.filter(items => items.item_id == swap.requestie_item_id).map(item => item.title)}</p>
                <div className="flexbox-container">
                  <button className="login-button" onClick={() => handleApproval(swap)}>Confirm</button>
                  <div style={{ width: '20px' }}></div>
                  <button className="login-button" onClick={() => handleRejectSwap(swap)}>Reject</button>
                </div>
                
            </div>
          ));
      } 


    const handleReject = async (request) => {
        try {
            const response = await fetch('https://nerdwork-qlxa.onrender.com
/trade/', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_email_request : request.user_email_request,
                user_email_requestie : request.user_email_requestie,
                wanted_item_id : request.wanted_item_id
                })
            });
            const res = await response.json();
            
            setNotifications(notifications - 1)
            closeNotifications()
          } catch (error) {
            console.error('Error fetching requests:', error);
          }
        }

        const handleRejectSwap = async (swap) => {
          try {
              const response = await fetch('https://nerdwork-qlxa.onrender.com
/trade/swap', {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  user_email_requester: swap.user_email_requester,
                  user_email_requestie: swap.user_email_requestie,
                  wanted_item_id: swap.wanted_item_id,
                  requestie_item_id: swap.requestie_item_id,                
                  accepted: false,
                  rejected_by_requester: true                  
                  })
              });
              const res = await response.json();
            } catch (error) {
              console.error('Error fetching requests:', error);
            }
          }

          const handleApproval = async (swap) => {
            try {
                const response = await fetch('https://nerdwork-qlxa.onrender.com
/trade/swap', {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    user_email_requester: swap.user_email_requester,
                    user_email_requestie: swap.user_email_requestie,
                    wanted_item_id: swap.wanted_item_id,
                    requestie_item_id: swap.requestie_item_id,                
                    accepted: true,
                    rejected_by_requester: false                  
                    })
                });
                const res = await response.json();
                const itemList = [swap.wanted_item_id, swap.requestie_item_id]
                for (let item in itemList) { 
                try {
                    const response = await fetch(`https://nerdwork-qlxa.onrender.com
/trade/${item}`, {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                    }
                  });
                  const res = await response.json();
                  return res
                } catch (error) {
                  console.error('Error fetching requests:', error);
                }
              }

              } catch (error) {
                console.error('Error fetching requests:', error);
              }
            }

    function openModal(){
        setModalOpen(true)
    }
    function closeModal(){
        setModalOpen(false)
    }

    const handleViewTrades = async (request) => {
        navigate(`/request/${request.request_id}`)
    }
    function removeDuplicateTitles(data) {
        const uniqueTitles = new Set();
        const filteredData = [];
      
        data.forEach(item => {
          if (!uniqueTitles.has(item.title)) {
            uniqueTitles.add(item.title);
            filteredData.push(item);
          }
        });
        
        return filteredData;
    }
    function getBooksByTitle(title) {
        return books.filter(book => book.title === title);
    }
    async function getCarouselItems(){
        const options = {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: localStorage.token
            }
        }
        const response = await fetch(`${apiURL}/item/book`, options)
        const data = await response.json()
        const dataItems = data.items
        setBooks(dataItems)
        
        const uniqueData = removeDuplicateTitles(dataItems);
       
        const len = uniqueData.length
        const randomArray = [];
        const tracking = []

        while (randomArray.length <= data.length) {
          const randomIndex = Math.floor(Math.random() * len);
        
          // Check if the random index is not already in the array
          if (!tracking.includes(randomIndex)) {
            tracking.push(randomIndex)
            randomArray.push(uniqueData[randomIndex]);
          }
        }
        const filteredBooks = data.items.filter(item => item.email === localStorage.email);
        
        setUserItems(filteredBooks)
        

        setCarouselItems(randomArray)        

    }
    function setShelf(shelf){
        localStorage.shelf=shelf
    }

    function makeCarousel(items){
        return (
            items.map((item) => (
                <div className="profile-item" key={item.item_id} >
                  <img src={item.img} onClick={() => displayUser(item.item_id,item)} className="insert-image"></img>
                  </div>
            ))
        )
    }

    useEffect(() => {
        getCarouselItems()
    }, [])

    function openNotifications(){
        setNotificationsOpen(true)
    }
    function closeNotifications(){
        setNotificationsOpen(false)
    }
    function displayUser(id,book){
        console.log("clicked", id, book)
        const booksWithTitle = getBooksByTitle(book.title);
        console.log("naviate", booksWithTitle )
        navigate(`/BookDetail/${id}`, { state: booksWithTitle  })
    }
    return(
        <div className="flexbox-container profile-container">

            <div className="flexbox-item profile-sidebar-extended">
                <div className="flexbox-container profile-bar" style = {{width: "100%"}}>
                    <div className="flexbox-container profile-header">
                        <div className="flexbox-item">
                            <span className="dot">
                                <i className="material-icons ikon" style={{marginLeft: "4px"}}>person</i>
                            </span>
                        </div>
                        <div className="flexbox-item" style = {{position: "relative", left: "10px", width: "350px"}}>
                            <h3> Welcome, {username}!</h3>
                        </div>
                        <div className="flexbox-item bell"  >
                            <i className="material-icons bell-ikon" onClick={() => openNotifications()} >
                                notifications
                            </i>
                            <p className="notification">{notifications != 0 ? notifications : ""}</p>
                        </div>
                        <Modal
                          isOpen = {notificationsOpen}
                          onRequestClose = {closeNotifications}
                          contentLabel="Book Details"
                          className="modal-notifications" 
                        >
                          <div className="flexbox-container" style={{flexDirection: "column"}}>
                              {displayRequests()}
                              {displayApproval()}
                          </div>        
                        </Modal>
                    </div>
                </div>
                <div className="flexbox-container option-row ">
                    {top_rows.map((title, i) => (
                    <Link to={top_links[i]} className="link" key={i} onClick={() => setShelf(top_var[i])}>    
                        <div className={`flexbox-item profile-option ${i % 2 === 0 ? 'even' : 'odd'}`}>
                                <i className="material-icons left" style={{color: "whitesmoke"}}>{top_icons[i]}</i>
                                {title}
                        </div>
                        </Link>
                    ))}
                </div>
                <div className="flexbox-item placeholder-box">
                  <img src={Penguin} style={{scale:"0.4"}}></img>
                </div>
                <div className="flexbox-item option-row">
                    {bottom_rows.map((title, i) => (
                        <Link to={bottom_links[i]} className="link" key={i}>
                            <div className={`flexbox-item profile-option ${i % 2 === 0 ? 'even' : 'odd'}`}>
                                    <i className="material-icons left" style={{color: "whitesmoke"}}>{bottom_icons[i]}</i>
                                    {title}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="flexbox-container flexbox-carousel">
                <div className="flexbox-container box-header" style={{width:"100%", height: "50px"}}>
                        <div className="flexbox-item"style={{width:"50%", justifyContent: "flex-start"}}><h3 style={{marginLeft:"20px"}}>Suggested for you...</h3></div>
                        <div className="flexbox-item add-book" style={{width:"50%", justifyContent: "flex-end"}}>
                                <h3>Add an item to your account</h3>
                                    <i className="material-icons"
                                        onClick={openModal} 
                                        style={{marginRight: "50px", marginLeft: "20px", marginBottom:"10px"}}>
                                            add_circle
                                    </i>
                                    <Modal
                                        isOpen={modalOpen}
                                        onRequestClose={closeModal}
                                        contentLabel="Book Details"
                                        className="modal-form-profile" 
                                    >
                                        <GeneralForm style ={{textAlign: "center"}}
                                        setModalOpen={setModalOpen}
                                        modalOpen={modalOpen}/>
                                    </Modal>
                        </div>
                </div>

        
                <div className="wrapper">
                    <div id="permas" style={{flexDirection: "row"}}>
                        {makeCarousel(item)}
                    </div>
                </div>
                <div className="flexbox-item box-header bottom-margin" style={{marginTop:"50px", width: "100%", flexDirection: "column", alignItems: "flex-start"}}>
                    <h3 style={{marginLeft: "20px"}}>Your Items</h3>
                    <div className="wrapper">
                        <div id="permas">
                            {makeCarousel(userItems)}
                        </div>
                    </div>
                </div>
            </div>
            
    </div>
  );
};

