import { useState } from "react";
import React from "react";
import axios from "axios";

import "./AddName.css";

export const AddName = ({ peopleList, setPeopleList, URL }) => {
  const [nameInput, setNameInput] = useState("");
  const [rankInput, setRankInput] = useState("");
  const [isRankInvalid, setIsRankInvalid] = useState(false);

  const handleNameChange = (e) => {
    setNameInput(e.target.value);
  };

  const handleRankChange = (e) => {
    const value = e.target.value;
    setRankInput(value);
    if (value && isNaN(value)) {
      setIsRankInvalid(true);
    } else {
      setIsRankInvalid(false);
    }
  };

  const handleAddPerson = async (e) => {
    e.preventDefault();
    const newPerson = {
      name: nameInput,
      rank: parseInt(rankInput),
    };

    try {
      const response = await axios.post(`${URL}/api/people`, newPerson);
      setPeopleList([...peopleList, response.data].sort((a, b) => a.rank - b.rank));
      setRankInput("");
      setNameInput("")
      
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <>
      <h2>Add Person</h2>

      <div className="addName">
        <div className="form-element">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={nameInput} onChange={handleNameChange} />
        </div>
        <div className="form-element">
          <label htmlFor="rank">Rank:</label>
          <input type="text" id="rank" name="rank" value={rankInput} onChange={handleRankChange} />
        </div>
        <input type="submit" value="Add Person" disabled={!nameInput || isRankInvalid} onClick={handleAddPerson} />
        {isRankInvalid && <div className="warning">(Please enter only a number in the Rank field)</div>}
      </div>
    </>
  );
};

export default AddName;

