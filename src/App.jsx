import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import { LuMoon } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { switchTheme } from "./features/theme/themeSlice";
import { toggleModal } from "./features/modal/modalSlice";

function App() {
  // All States Are Here
  // const [openModal, setOpenModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filterValue, setFilterValue] = useState("all");
  const [searchText, setSearchTex] = useState("");

  // Theme is coming from Redux
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();

  // Modal is coming from Redux
  const openModal = useSelector((state) => state.modal.value);

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem("todos"));
    if (tasks) {
      setTasks(tasks);
    } else {
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    filterTodos();
  }, [filterValue]);

  // Filter Tasks
  const filterTodos = () => {
    const allTodos = JSON.parse(localStorage.getItem("todos"));
    if (filterValue === "completed") {
      filterCompleted(allTodos);
    } else if (filterValue === "active") {
      filterActiveTodos(allTodos);
    } else {
      const allTodos = JSON.parse(localStorage.getItem("todos"));
      setTasks(allTodos);
    }
  };

  // Filter Active Todos
  const filterActiveTodos = (allData) => {
    const filteredItems = allData.filter((todo) => todo.completed === false);
    setTasks(filteredItems);
  };

  // Filter Completed Todos
  const filterCompleted = (allData) => {
    const filteredItems = allData.filter((todo) => todo.completed === true);
    setTasks(filteredItems);
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Set Data To Local Storage
  const setToLocalStorage = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  // Make a New Task & Set It To Local Storage
  const makeNewTask = (event) => {
    event.preventDefault();

    // Generate an id
    const id = Math.floor(Math.random() * 100000000000);

    if (inputValue) {
      const newItem = {
        id: id,
        task: inputValue,
        completed: false,
      };
      if (!tasks) {
        const newData = [newItem];
        setTasks(newData);
        setToLocalStorage(newData);
      } else {
        const newData = [...tasks, newItem];
        setToLocalStorage(newData);
        setTasks(newData);
      }
    } else {
      alert("Write a task to add.");
    }
    setInputValue("");
  };

  // Handle Submit Button on Enter Press
  const handleSubmitOnEnter = (event, buttonType) => {
    if (event.key === "Enter" && buttonType === "add") {
      makeNewTask();
    } else if (event.key === "Enter" && buttonType === "search") {
      handleSearch();
    }
  };

  // Handle Completed Task
  const handleCompleted = (id) => {
    const allTodos = JSON.parse(localStorage.getItem("todos"));
    allTodos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
        setToLocalStorage(allTodos);
        setTasks(allTodos);
      }
    });
  };

  // Handle Filter
  const handleFilter = (e) => {
    setFilterValue(e.target.value);
  };

  // Handle Delete Item
  const handleDelete = (id) => {
    console.log(id);
    const storedItems = localStorage.getItem("todos");
    if (storedItems) {
      let todosArray = JSON.parse(storedItems);
      const updatedTodos = todosArray.filter((todo) => todo.id !== id);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      setTasks(updatedTodos);
    }
  };

  // Handle Search Text
  const handleSearchText = (e) => {
    const text = e.target.value;
    setSearchTex(text);
  };

  // Handle Search
  const handleSearch = () => {
    if (searchText === "") {
      const allData = JSON.parse(localStorage.getItem("todos"));
      setTasks(allData);
    } else {
      const searchedItems = [];
      console.log(searchText);
      tasks.map((task) => {
        const searchResult = task.task
          .toLowerCase()
          .includes(searchText.toLowerCase());
        if (searchResult) {
          searchedItems.push(task);
        }
      });
      setTasks(searchedItems);
    }
  };

  return (
    <div className={`py-8 ${theme === "light" ? "bg-white" : "bg-slate-900"}`}>
      <div className="w-[85%] mx-auto relative min-h-screen">
        <h1
          className={`uppercase text-center text-black text-3xl font-semibold ${
            theme === "light" ? "text-black" : "text-white"
          }`}
        >
          todo app
        </h1>

        {/* Upper portion */}
        <div className="flex justify-center items-center mt-8 mb-5 max-md:block">
          {/* Search Functionality */}
          <div className="flex w-[40%] max-md:w-full justify-center">
            <input
              type="text"
              onKeyPress={(e) => handleSubmitOnEnter(e, "search")}
              onChange={handleSearchText}
              placeholder="Type here"
              className={`input  text-black w-full ${
                theme === "light"
                  ? "bg-white text-black input-primary input-bordered"
                  : "text-white bg-slate-900 border-white input-bordered"
              }`}
            />
            <button
              onClick={handleSearch}
              className={`btn btn-outline mx-3 ${
                theme === "light"
                  ? "btn-primary"
                  : "border-primary text-white hover:bg-primary"
              }`}
            >
              Search
            </button>
          </div>

          <div className="flex items-center justify-center max-md:mt-5">
            {/* Filter Button */}
            <select
              value={filterValue}
              onChange={handleFilter}
              className={`select select-primary mx-10 max-md:me-10 max-md:ml-0 ${
                theme === "light" ? "bg-white text-black" : "text-white"
              }`}
            >
              <option value={"all"}>All</option>
              <option value={"active"}>Active</option>
              <option value={"completed"}>Completed</option>
            </select>

            {/* Theme Controller */}
            <label
              className={`flex cursor-pointer gap-2 items-center text-xl ${
                theme === "light" ? "text-slate-700" : "text-gray-200"
              }`}
            >
              <IoSunny />
              <input
                type="checkbox"
                value="synthwave"
                className="toggle theme-controller"
                onClick={() => dispatch(switchTheme())}
              />
              <LuMoon />
            </label>
          </div>
        </div>

        {/* Task Portion */}
        <div className="w-[520px] mx-auto max-md:w-full">
          {/* {console.log(tasks)} */}
          <ul
            className={` ${
              tasks === null || tasks.length === 0
                ? "flex justify-center items-center"
                : ""
            }`}
          >
            {tasks === null || tasks.length === 0 ? (
              <img
                className="bg-transparent"
                src="https://i.ibb.co.com/xCg3d7W/Detective-check-footprint-1-2x-removebg-preview.png"
                alt=""
              />
            ) : (
              tasks.map((task) => (
                <li
                  key={task.id}
                  className={`border-b hover:border-indigo-400 my-5 transition duration-500 flex justify-between items-center cursor-pointer ${
                    theme === "light" ? "border-gray-300" : "border-gray-800"
                  }`}
                >
                  <div className="flex justify-center form-control">
                    <label className="label cursor-pointer block items-center flex">
                      <input
                        onChange={() => handleCompleted(task.id)}
                        type="checkbox"
                        checked={task.completed}
                        className="checkbox checkbox-primary"
                      />
                      <span
                        className={`text-black mx-2 text-left ${
                          theme === "light" ? "text-black" : "text-white"
                        } ${task.completed ? "line-through" : ""}`}
                      >
                        {task.task}
                      </span>
                    </label>
                  </div>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className={`btn bg-transparent border-0 hover:bg-transparent transition ${
                      theme === "light"
                        ? "hover:text-black"
                        : "hover:text-white"
                    }`}
                  >
                    <FaRegTrashAlt />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Add Button & Modal*/}
        <div className="fixed bottom-20 right-80 max-md:bottom-10 max-md:right-5">
          <button
            onClick={() => dispatch(toggleModal())}
            className="btn btn-primary text-white rounded-full"
          >
            <FaPlus />
          </button>

          {/* Modal */}
          <div
            className={`fixed inset-0 flex items-center justify-center bg-opacity-50 ${
              openModal ? "block" : "hidden"
            }`}
          >
            <div
              className={`rounded-lg shadow-lg p-6 w-full max-w-md m-5 ${
                theme === "light" ? "bg-gray-200" : "bg-slate-700"
              }`}
            >
              <div className="flex justify-between items-center border-b pb-3">
                <h3
                  className={`text-xl font-semibold text-black ${
                    theme === "light" ? "text-black" : "text-white"
                  }`}
                >
                  Enter Task
                </h3>
                <button
                  onClick={() => dispatch(toggleModal())}
                  className={`text-gray-500 ${
                    theme === "light"
                      ? "text-black hover:text-gray-700"
                      : "text-white hover:text-slate-300"
                  }`}
                  id="closeModal"
                >
                  &#10005;
                </button>
              </div>

              <form action="" onSubmit={makeNewTask}>
                <div className="my-4">
                  <input
                    type="text"
                    placeholder="Eg: Get up at 7:00 am"
                    onChange={handleInputChange}
                    onKeyPress={(e) => handleSubmitOnEnter(e, "add")}
                    value={inputValue}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === "light"
                        ? "bg-white text-black border-primary placeholder:text-slate-500"
                        : "border-white bg-slate-900 text-white placeholder:text-slate-400"
                    }`}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="reset"
                    onClick={() => dispatch(toggleModal())}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                    id="closeModal"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    onClick={() => dispatch(toggleModal())}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <p className="text-center text-xs mt-10">
          @ copyright Hasanul Alam 2024
        </p>
      </div>
    </div>
  );
}

export default App;
