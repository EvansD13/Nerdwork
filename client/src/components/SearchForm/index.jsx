import React, { useState } from 'react';
import './SearchForm.css';

export default function SearchForm({ searchString, setSearchString }) {

    
    function updateTextFilter (e) {
        setSearchString(e.target.value);
    }

    return (
        <>
            <form id='buttonsearch' className='search-form '>
                <label><input type="text" placeholder= "Search "value={searchString} onChange={updateTextFilter} /></label>
            </form>
        </>

    )   
};