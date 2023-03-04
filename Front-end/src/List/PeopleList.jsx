import "./PeopleList.css";
import axios from "axios";

const PeopleList = ({ peopleList, setPeopleList, URL}) => {
  const handleDelete = async (id, index) => {
    try {
      await axios.delete(`${URL}/api/people/${id}`);
      setPeopleList(peopleList.filter((_, i) => i !== index));
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };
  const handleRankChange = async (index, direction) => {
    const firstPerson = peopleList[index];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= peopleList.length) {
      return;
    }
    const otherPerson = peopleList[newIndex];
    console.log(otherPerson);
    try {
      await axios.put(`${URL}/api/people/${firstPerson._id}`, {
        ...firstPerson,
        rank: otherPerson.rank,
      });
      await axios.put(`${URL}/api/people/${otherPerson._id}`, {
        ...otherPerson,
        rank: firstPerson.rank,
      });
      const newPeopleList = [...peopleList];
      newPeopleList[index] = { ...otherPerson, rank: firstPerson.rank };
      newPeopleList[newIndex] = { ...firstPerson, rank: otherPerson.rank };
      setPeopleList(newPeopleList.sort((a, b) => a.rank - b.rank));
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleEdit = async (index) => {
    const newPeopleList = [...peopleList];
    const editingPerson = newPeopleList[index];
    newPeopleList[index] = { ...editingPerson, isEditing: true };
    setPeopleList(newPeopleList);
  };

  const handleEditNameChange = (index, event) => {
    const newPeopleList = [...peopleList];
    const editingPerson = newPeopleList[index];
    editingPerson.name = event.target.value;
    setPeopleList(newPeopleList);
  };

  const handleEditRankChange = (index, event) => {
    const newPeopleList = [...peopleList];
    const editingPerson = newPeopleList[index];
    editingPerson.rank = parseInt(event.target.value);
    setPeopleList(newPeopleList);
  };

  const handleSaveEdit = async (id, index) => {
    const editingPerson = peopleList[index];
    const rank = editingPerson.rank;
    if (isNaN(rank)) {
      alert("Please enter a valid number for rank.");
      return;
    }
    const updatedPerson = {
      name: editingPerson.name,
      rank: rank,
    };
    try {
      await axios.put(`${URL}/api/people/${id}`, updatedPerson);
      const newPeopleList = [...peopleList];
      newPeopleList[index] = { ...editingPerson, isEditing: false };
      setPeopleList(newPeopleList.sort((a, b) => a.rank - b.rank));
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleCancelEdit = (index) => {
    const newPeopleList = [...peopleList];
    const editingPerson = newPeopleList[index];
    newPeopleList[index] = { ...editingPerson, isEditing: false };
    setPeopleList(newPeopleList);
  };
  const sortedList = [...peopleList].sort((a, b) => a.rank - b.rank);
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rank</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {sortedList.map((person, index) => (
            <tr key={index}>
              <td>
                {person.isEditing ? (
                  <input
                    type="text"
                    value={person.name}
                    onChange={(event) => handleEditNameChange(index, event)}
                  />
                ) : (
                  person.name
                )}
              </td>
              <td>
                {person.isEditing ? (
                  <input
                    type="number"
                    value={person.rank}
                    onChange={(event) => handleEditRankChange(index, event)}
                  />
                ) : (
                  person.rank
                )}
              </td>
              <td className="button_container">
                {person.isEditing ? (
                  <>
                    <button onClick={() => handleSaveEdit(person._id, index)}>
                      Save
                    </button>
                    <button onClick={() => handleCancelEdit(index)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleRankChange(index, -1)}>
                      Move Up
                    </button>
                    <button onClick={() => handleRankChange(index, 1)}>
                      Move Down
                    </button>
                    <button onClick={() => handleDelete(person._id, index)}>
                      Delete
                    </button>
                    <button onClick={() => handleEdit(index)}>
                      Edit
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PeopleList;
