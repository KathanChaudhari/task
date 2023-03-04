import React, { useState,useEffect } from 'react';
import axios from 'axios';

import PeopleList from './List/PeopleList';
import  AddName  from './AddName/AddName';

import "./App.css"

function App() {
  const [peopleList, setPeopleList] = useState([]);
  //   { name: 'kathan', rank: 1 },
  //   { name: 'jay', rank: 2 },
  //   { name: 'vraj', rank: 3 },
  
  const URL = "http://localhost:5000"

  useEffect(() => {
    async function fetchPeople() {
      const response = await axios.get(`${URL}/api/people`);
      setPeopleList(response.data);
    }
    fetchPeople();
  }, []);

  return (
    <div className='App'>
      <h1>People List</h1>
        <AddName peopleList={peopleList} setPeopleList={setPeopleList} URL={URL} />
        <PeopleList peopleList={peopleList} setPeopleList={setPeopleList} URL={URL}/>
      </div>
  )
          }
export default App