// App.js
import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import axios from 'axios';
import './App.css';

const initialData = {
  todo: { id: 'todo', items: [] },
  inProgress: { id: 'inProgress', items: [] },
  done: { id: 'done', items: [] },
};

const App = () => {
  const [data, setData] = useState(initialData);
  const [newTaskText, setNewTaskText] = useState('');

  const fetchData = async (columnId) => {
    try {
      const response = await axios.get(`/api/tasks/${columnId}`);
      setData((prevData) => ({
        ...prevData,
        [columnId]: { ...prevData[columnId], items: response.data },
      }));
    } catch (error) {
      console.error(`Error fetching data for ${columnId}:`, error);
    }
  };

  useEffect(() => {
    fetchData('todo');
    fetchData('inProgress');
    fetchData('done');
  }, []);

 const findItemByText = (text) => {
  for (const columnId in data) {
    const column = data[columnId];
    const foundItem = column.items.find((item) => item.text === text);
    if (foundItem) {
      return foundItem;
    }
  }
  return null;
};

  const addTaskToDatabase = async (columnId2, text2) => {
    try {
      const response = await axios.post(`/api/tasks`, {
        text: text2,
        columnId: columnId2
        // Add other fields as needed
      });
      return response.data; // Assuming the response contains the new task data
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

const updateTaskInDatabase = async (taskId, newText, newColumnId) => {
  try {
    await axios.put(`/api/tasks/${taskId}`, {
      text: newText,
      columnId: newColumnId,
      // Add other fields as needed
    });
    // Handle success, e.g., update state or trigger a re-fetch
  } catch (error) {
    // Handle errors
    console.error('Error updating item:', error);
  }
};

const deleteTaskInDatabase = async (taskId) => {
  try {
    await axios.delete(`/api/tasks/${taskId}`);
    // Handle success, e.g., update state or trigger a re-fetch
  } catch (error) {
    // Handle errors
    console.error('Error updating item:', error);
  }
};

  const handleAddTask = async (columnId) => {
    try {
      const newTask = await addTaskToDatabase(columnId, newTaskText);

      if (newTask.text.trim()==="") {
        setNewTaskText('');
      } else {

      // Update the state
      const newData = {
        ...data,
        [columnId]: { ...data[columnId], items: [...data[columnId].items, newTask] },
      };

      setData(newData);
      setNewTaskText(''); // Clear the input field
      }
    } catch (error) {
      // Handle errors
    }
    
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    const draggableId2 = findItemByText(draggableId);

    if (source.droppableId === destination.droppableId) {
      // Move within the same column
      const column = data[source.droppableId];
      const newItems = Array.from(column.items);
      newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, draggableId2);

      const newData = {
        ...data,
        [source.droppableId]: { ...column, items: newItems },
      };

      setData(newData);
    } else {
      // Move between columns
      const sourceColumn = data[source.droppableId];
      const destinationColumn = data[destination.droppableId];

      const newSourceItems = Array.from(sourceColumn.items);
      newSourceItems.splice(source.index, 1);

      const newDestinationItems = Array.from(destinationColumn.items);
      newDestinationItems.splice(destination.index, 0, draggableId2);

      const newData = {
        ...data,
        [source.droppableId]: { ...sourceColumn, items: newSourceItems },
        [destination.droppableId]: {
          ...destinationColumn,
          items: newDestinationItems,
        },
      };

      updateTaskInDatabase(draggableId2.id, draggableId2.text, destination.droppableId);

      setData(newData);
    }
  };


  const handleDelete = (columnId, index, id) => {
    const column = data[columnId];
    const newItems = Array.from(column.items);
    newItems.splice(index, 1);

    const newData = {
      ...data,
      [columnId]: { ...column, items: newItems },
    };

    deleteTaskInDatabase(id);

    setData(newData);
  };

  const handleInputChange = (e) => {
    setNewTaskText(e.target.value);
  };

  return (
  <div className="w3-content w3-margin-top" style={{ maxWidth: '1400px' }}>
    <div className="w3-row-padding">
      <div className="w3-third">
        <div className="w3-white w3-text-grey w3-card-4">
          <div className="w3-display-container">
          <div className="w3-container">
                <div>
    <h2 className="w3-text-grey w3-padding-16"><i className="fa fa-plus-circle fa-fw w3-margin-right w3-xxlarge w3-text-teal"></i>Add Task</h2>
        <p>
        <input
          type="text"
          value={newTaskText}
          onChange={handleInputChange}
        />
            <button onClick={() => handleAddTask("todo")}>Add Task</button>
        </p>
  </div>
          </div>
        </div>
      </div>
    </div>
      <div className="w3-twothird">
        <div className="w3-container w3-card w3-white w3-margin-bottom">
    <h2 className="w3-text-grey w3-padding-16"><i className="fa fa-pencil-square-o fa-fw w3-margin-right w3-xxlarge w3-text-teal"></i>Edit Tasks</h2>
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {Object.keys(data).map((columnId) => (
          <div key={columnId} className="kanban-column">
            <h2>{columnId}</h2>
            <Droppable droppableId={columnId}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {data[columnId].items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.text}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="kanban-item"
                        >
                          <span>{item.text}</span>
                          <button
                            onClick={() => handleDelete(columnId, index, item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {/* Add Task Button */}
          </div>
        ))}
      </div>
    </DragDropContext>
        </div>
      </div>
      </div>
    </div>
 );
};

export default App;
