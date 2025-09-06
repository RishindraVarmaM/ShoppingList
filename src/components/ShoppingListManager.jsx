import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './style.css';
import config from './Config.js';

const ShoppingListManager = () => {
  const [shoppinglists, setShoppingLists] = useState([]);
  const [shoppinglist, setShoppingList] = useState({
    id: '',
    name: '',
  });

  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedShoppingList, setFetchedShoppingList] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  const baseUrl = `${config.url}/shoppinglistapi`;

  useEffect(() => {
    fetchAllShoppingLists();
  }, []);

  const fetchAllShoppingLists = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setShoppingLists(res.data);
    } catch (error) {
      setMessage('Failed to fetch items.');
    }
  };

  const handleChange = (e) => {
    setShoppingList({ ...shoppinglist, [e.target.name]: e.target.value });
  };


  const validateForm = () => {
    for (let key in shoppinglist) {
      if (!shoppinglist[key] || shoppinglist[key].toString().trim() === '') {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  const addShoppingList = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${baseUrl}/add`, shoppinglist);
      setMessage('Item added successfully.');
      fetchAllShoppingLists();
      resetForm();
    } catch (error) {
      setMessage('Error adding items.');
    }
  };

  const updateShoppingList = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`${baseUrl}/update`, shoppinglist);
      setMessage('Item updated successfully.');
      fetchAllShoppingLists();
      resetForm();
    } catch (error) {
      setMessage('Error updating Item.');
    }
  };

  const deleteShoppingList = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(res.data);
      fetchAllShoppingLists();
    } catch (error) {
      setMessage('Error deleting Item.');
    }
  };

  const getShoppingListById = async () => {
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedShoppingList(res.data);
      setMessage('');
    } catch (error) {
      setFetchedShoppingList(null);
      setMessage('Item not found.');
    }
  };

  const handleEdit = (item) => {
    setShoppingList(item);
    setEditMode(true);
    setMessage(`Editing Item with ID ${item.id}`);
  };

  const resetForm = () => {
    setShoppingList({
      id: '',
      name: '',
    });
    setEditMode(false);
  };

  return (
    <div className="shoppinglist-container">

{message && (
  <div className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
    {message}
  </div>
)}


     <center> <h1>MY SHOPPING LIST</h1>

      {/* <div> */}
        <h3>{editMode ? 'Edit ShoppingList' : 'Add Your Items to the Shopping List'}</h3>
       
          <input type="number" name="id" placeholder="ID" value={shoppinglist.id} onChange={handleChange} />
          <input type="text" name="name" placeholder="Name" value={shoppinglist.name} onChange={handleChange} />
        

        {/* <div className="btn-group"> */}
          {!editMode ? (
            <button className="btn-blue" onClick={addShoppingList}>Add Item</button>
          ) : (
            <>
              <button className="btn-green" onClick={updateShoppingList}>Update Item</button>
              <button className="btn-gray" onClick={resetForm}>Cancel</button>
            </>
          )}
       
      

      <div>
        <h3>Search For Your item</h3>
        <input
          type="number"
          value={idToFetch}
          onChange={(e) => setIdToFetch(e.target.value)}
          placeholder="Enter ID"
        />
        <button className="btn-blue" onClick={getShoppingListById}>Fetch</button>

        {fetchedShoppingList && (
          <div>
            <h4>Item Found:</h4>
            <pre>{JSON.stringify(fetchedShoppingList, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        <h3>All Items</h3>
        {shoppinglists.length === 0 ? (
          <p>No Items found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(shoppinglist).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shoppinglists.map((item) => (
                  <tr key={item.id}>
                    {Object.keys(shoppinglist).map((key) => (
                      <td key={key}>{item[key]}</td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(item)}>Edit</button>
                        <button className="btn-red" onClick={() => deleteShoppingList(item.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
</center>
    </div>
  );
};

export default ShoppingListManager;
