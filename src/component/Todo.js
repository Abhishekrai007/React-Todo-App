import React, { useEffect, useState } from 'react'
import "./Todo.css"
import { ToastContainer, toast } from 'react-toastify'
import todoImage from "../images/todo.png"
const Todo = () => {
    const [tasks, setTasks] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [filter, setFilter] = useState("all")
    const [isLoading, setIsLoading] = useState(true)
    const [editTaskId, setEditTaskId] = useState(null)

    useEffect(() => {
        fetchTodos();
    }, [])

    const fetchTodos = async () => {
        try {
            const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=4');
            const todos = await res.json()
            setTasks(todos)
            setIsLoading(false)
        } catch (error) {
            console.log("Error fetching todos:", error)
            setIsLoading(false)
        }
    }

    //handling input change
    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }

    //Adding new task
    const handleAddTask = async () => {
        if (inputValue.trim() === "") {
            return
        }

        const newTask = {
            title: inputValue,
            completed: false
        }
        try {
            const res = await fetch('https://jsonplaceholder.typicode.com/todos', {
                method: "POST",
                body: JSON.stringify(newTask),
                headers: {
                    "Content-type": "application/json; chatset=UTF-8"
                },
            });
            const addedTask = await res.json()
            setTasks((prevTask) => [...prevTask, addedTask])
            setInputValue("")
            // toast.success("Task added successfully")
            console.log("Task Added")
        } catch (error) {
            console.log("Error adding task:", error)
            toast.error("Error adding task")
        }
    }
    const handleEditTask = (taskId) => {
        setEditTaskId(taskId);
        const taskToEdit = tasks.find((task) => task.id === taskId)
        setInputValue(taskToEdit.title)
    }

    //Update a task
    const handleUpdateTask = async () => {
        if (inputValue.trim() === "") {
            return
        }
        const updateTask = {
            title: inputValue,
            completed: false
        }
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${editTaskId}`, {
                method: "PUT",
                body: JSON.stringify(updateTask),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            const updateTaskData = await response.json()
            setTasks((prevTask) => prevTask.map((task) =>
                task.id === editTaskId ? { ...task, title: updateTaskData.title } : task
            ))
            setInputValue("")
            setEditTaskId(null)

        } catch (error) {
            console.log("Error updating task:", error)
        }
    }

    //filtering task based on filters
    const filteredTask = tasks.filter((task) => {
        if (filter === "all") {
            return true
        } else if (filter === "completed") {
            return task.completed;
        } else if (filter === "uncompleted") {
            return !task.completed
        }
        return true
    })
    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleFilterChange = (filterType) => {
        setFilter(filterType)
    }

    const handleClearCompleted = () => {
        setTasks((prevTask) => prevTask.filter((task) => !task.completed))
    }



    //Marking all task as completed
    const handleCompleteAll = () => {
        setTasks((prevTask) => prevTask.map((task) => ({ ...task, completed: true })))
    }

    const handleTaskCheckboxChange = (taskId) => {
        setTasks((prevTask) =>
            prevTask.map((task) => (
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
            ))
    }

    const handleDeleteTask = taskId => {
        setTasks((prevTask) => prevTask.filter((task) => task.id !== taskId))
        // toast.success("Task deleted Sucessfully")
    }

    return (
        <div className='container' >
            <ToastContainer />
            <div className="todo-app">
                <h2>
                    <img src={todoImage} alt="" />Todo List
                </h2>
                <div className="row">
                    <i className="fas fa-list-check"></i>
                    <input
                        type="text"
                        className="add-task"
                        id="add"
                        placeholder="Add your todo"
                        autoFocus
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <button id="btn" onClick={editTaskId ? handleUpdateTask : handleAddTask} >{editTaskId ? 'Update' : 'Add'}</button>
                </div>
                <div className="mid">
                    <i className="fas fa-check-double"></i>
                    <p id="complete-all" onClick={handleCompleteAll} >
                        Complete all tasks
                    </p>
                    <p id="clear-all" onClick={handleClearCompleted} >
                        Delete comp tasks
                    </p>
                </div>
                <ul id="list">
                    {filteredTask.map((task) =>
                        <li key={task.id}>
                            <input type="checkbox" id={`task-${task.id}`} data-id={task.id} className='custom-checkbox' checked={task.completed} onChange={() => handleTaskCheckboxChange(task.id)} />
                            <label htmlFor={`task-${task.id}`}>{task.title}</label>
                            <div>
                                <img
                                    alt='img'
                                    src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png"
                                    className="edit"
                                    data-id={task.id}
                                    onClick={() => handleEditTask(task.id)}
                                />
                                <img
                                    alt='img'
                                    src="https://cdn-icons-png.flaticon.com/128/3096/3096673.png"
                                    className="delete"
                                    data-id={task.id}
                                    onClick={() => handleDeleteTask(task.id)}
                                />
                            </div>
                        </li>
                    )}
                </ul>
                <div className="filters">
                    <div className="dropdown">
                        <button className="dropbtn">Filter</button>
                        <div className="dropdown-content">
                            <a id="all" href="#" onClick={() => handleFilterChange('all')}>
                                All
                            </a>
                            <a id="rem" href="#" onClick={() => handleFilterChange('uncompleted')}>
                                Uncompleted
                            </a>
                            <a id="com" href="#" onClick={() => handleFilterChange('completed')}>
                                Completed
                            </a>
                        </div>
                    </div>
                    <div className="completed-task">
                        <p>
                            Completed: <span id="c-count">{tasks.filter((task) => task.completed).length}</span>
                        </p>
                    </div>
                    <div className="remaining-task">
                        <p>
                            <span id="total-tasks">
                                Total Tasks: <span id="tasks-counter">{tasks.length}</span>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Todo