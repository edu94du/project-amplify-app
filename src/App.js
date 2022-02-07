import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { listTodos } from './graphql/queries';
import { createTodo as createTodoMutation, deleteTodo as deleteTodoMutation } from './graphql/mutations';

const initialFormState = { name: '', description: '' }

function Todo() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const apiData = await API.graphql({ query: listTodos });
    setNotes(apiData.data.listTodos.items);
  }

  async function createTodo() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createTodoMutation, variables: { input: formData } });
    setNotes([...notes, formData]);
    setFormData(initialFormState);
  }

  async function deleteTodo({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteTodoMutation, variables: { input: { id } } });
  }

  return (

    <div className="container-center">

      <div className='login'>
        <Authenticator>

          {({ signOut, user }) => (<div className="login-area">
            <h3> Hey {user.username},welcome to my Todo List, with auth! </h3>

            <p>This is My Todo List</p>

            <input
              type="text"
              onChange={e => setFormData({ ...formData, 'name': e.target.value })}
              placeholder="Todo"
              value={formData.name}
            />
            <input
              type="text"
              onChange={e => setFormData({ ...formData, 'description': e.target.value })}
              placeholder="Todo description"
              value={formData.description}
            />

            <button onClick={createTodo}>Create Note</button>

            <div style={{ marginBottom: 30 }}>
              {
                notes.map(note => (
                  <div key={note.id || note.name}>
                    <h2>{note.name}</h2>
                    <p>{note.description}</p>
                    <button onClick={() => deleteTodo(note)}>Delete Todo</button>
                  </div>
                ))
              }
            </div>
            <button onClick={signOut}>Sign out</button> </div>)}

        </Authenticator>
      </div>

    </div >


  );
}

export default Todo;