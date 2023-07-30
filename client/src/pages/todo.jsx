import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Todo() {
  const [todo, settodo] = useState([]);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [name, setname] = useState("");
  const [list, setlist] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllTodo = async () => {
      try {
        const res = await axios.get("http://localhost:7000/todo");
        settodo(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllTodo();
  }, []);

  const handleDelete = (name) => {
    axios.delete(`http://localhost:7000/delete/?name=${name}`)
      .then((res) => {
        console.log(res);
        alert("Data Deleted");
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };


  const handleUpdate = (name) => {
    setShowUpdatePopup(true);
  };

  const handlePopupSave = () => {
    const params = {
        list: list
    }
    axios({
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        url: `http://localhost:7000/update/?name=${name}`,
        data: JSON.stringify(params),
      }).then((result)=>{
        console.log(result);
        alert('data Updated')
        navigate('/');
      }).catch((err)=>{
        console.log(err)
      })




        
  };

  const submit = (event) => {
    const params = {
      name: name,
      list: list
    }

    console.log(params)

    axios({
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      url: `http://localhost:7000/addtodo`,
      data: JSON.stringify(params),
    }).then((result) => {
      console.log(result);
      alert('data Saved');
      navigate('/');
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <div className='display'>
      <h1>TODO APPLICATION</h1>
      <div className='add'>
      <h1>Add New list</h1>
        <form>
          <label>Enter the Name</label>
          <input type="text" placeholder="Enter the  Name" onChange={(e) => setname(e.target.value)} />
          <label>Enter the List</label>
          <input type="text" placeholder="Enter the task " onChange={(e) => setlist(e.target.value)} />
          <button onClick={submit}>ADD</button>
        </form>
      </div>
      <div className="data">
        {todo.map(todoItem => (
          <div className="todo" key={todoItem.name} >
            <table>
              <tr>
                <th>Name</th>
                <th>List</th>
              </tr>
              <tr>
                <td>{todoItem.name}</td>
                <td>{todoItem.list}</td>
                <button className="delete" onClick={() => handleDelete(todoItem.name)}>Delete</button>
                <button className="update" onClick={() => handleUpdate(todoItem.name)}>Update</button>
              </tr>
            </table>
          </div>
        ))}
      </div>

      {showUpdatePopup && (
        <div className='form'>
        <h1>Update task</h1>
        <form>
        <label>Enter the Task</label>
        <input type="text"  placeholder="Enter the Task" onChange={(e) => setlist(e.target.value)} />
        <button onClick={handlePopupSave}>Update</button>
        </form>
     </div>
      )}
    </div>
  )
}

export default Todo;
