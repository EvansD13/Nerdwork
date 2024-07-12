import React, { useState, useEffect } from "react";
import SearchForm from "../../components/SearchForm";
import { useNavigate } from "react-router-dom";
import { CommunityCard } from "../../components";
import HomePageCard from "../../components/HomepageCompoenet";
import "./communityPage.css"

export default function CommunityPage() {
  const [searchString, setSearchString] = useState("");
  const [communities, setCommunities] = useState(null);
  const [communityId, setCommunityId] = useState(1)
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await fetch('https://nerdwork-qlxa.onrender.com/community/', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      const communityData = data.Communities; // Access the Communities array in the response
      setCommunities(communityData)
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  const handleCommunityClick = async (id) => {
    await setCommunityId(id)
    navigate(`threads/${id}`)
  }

  function displayCommunities() {
    return communities
      .filter(community => searchString.length === 0 || community.community_name.toLowerCase().includes(searchString.toLowerCase()))
      .map(community => (
          <CommunityCard  key={community.community_id} community={community} handleCommunityClick={handleCommunityClick}/>
      ));
  }
  

  return (
    <>
      <SearchForm searchString={searchString} setSearchString={setSearchString} />
      <div className="community-container">
        <div>
        {communities === null ? (
          <p>Loading communities...</p>
        ) : (
          <div className="community-post">{displayCommunities()}</div>
        )}
        </div>
        <div className="create-post">
          <HomePageCard/>
        </div>
      </div>
    </>
  );
}
