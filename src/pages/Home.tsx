import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApiFetcher from "../services";

const Home = () => {
  type Todo = {
    _id: string;
    title: string;
    description: string;
  };
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [message, setMessage] = useState<string>("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const [error, setError] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  //for edit
  const [editTitle, setEditTitle] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  //token
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  //post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (title.trim() === "" || description.trim() === "") {
      setError("All fields are required");
      setTimeout(() => setError(""), 3000);
      return;
    }
    try {
      setLoading(true);

      const newTodo = await ApiFetcher({
        method: "POST",
        url: `${apiUrl}/api/todos`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: { title, description },
      });

      setTodos((prev) => [...prev, newTodo]);
      setMessage("Item added successfully");
      setTimeout(() => setMessage(""), 3000);
      setTitle("");
      setDescription("");
    } catch (error) {
      setError("Failed to add item");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };
  //get
  useEffect(() => {
    const getitems = () => {
      setLoading(true);

      ApiFetcher({
        url: `${apiUrl}/api/todos`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          console.log("GET RES", res);
          if (Array.isArray(res)) {
            setTodos(res);
          } else {
            setTodos([]);
          }
        })
        .catch(() => {
          setError("Failed to fetch items");
          setTimeout(() => setError(""), 3000);
        })
        .finally(() => setLoading(false));
    };
    getitems();
  }, [token]);
  //update
  const handleUpdate = async (id: string) => {
    setError("");
    setMessage("");
    if (editTitle.trim() === "" || editDescription.trim() === "") {
      setError("All fields are required");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      });

      if (!res.ok) throw Error("failed to update item");

      setTodos((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, title: editTitle, description: editDescription }
            : item,
        ),
      );
      setMessage("Item updated successfully");
      
      setTimeout(() => setMessage(""), 3000);
      setEditId(null);
    } catch (error) {
      setError("Failed to update item");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };
  // for edit
  const handleEdit = (item: Todo) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };
  //delete
  const handleDelete = async (id: string) => {
    setError("");
    setMessage("");
    if (!window.confirm("are you sure you want to delete this item?")) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw Error("failed to delete item");
      setTodos((prev) => prev.filter((item) => item._id !== id));
      setMessage("item deleted successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setError("failed to delete item");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-amber-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className=" bg-amber-200 h-screen">
      <div className="p-2 max-w-lg mx-auto">
        <div className="flex items-center justify-center gap-8 pt-10">
          <h1 className=" text-2xl ">Application</h1>
          {user ? (
            <Link
              to="/profile"
              className="border hover:border-gray-400 rounded-xl text-gray-200 bg-amber-500 
        flex items-center justify-center  h-12 px-2"
            >
              Welcome, {user.name}
            </Link>
          ) : (
            <Link
              to="/login"
              className="border hover:border-gray-400 rounded-xl text-gray-200 bg-amber-500 
       flex items-center justify-center  h-12 px-2"
            >
              Login
            </Link>
          )}
        </div>
        <div className="space-y-2 ">
          {/* message and error */}
          <div className="h-20 mt-2 flex flex-col items-center justify-center">
            {message && (
              <p className="text-center text-green-500 text-xl ">{message}</p>
            )}
            {error && (
              <p className="text-center text-red-500 text-xl">{error}</p>
            )}
          </div>
          {/* add items */}
          <div>
            <h3 className="text-[18px] pl-4">Add list your here:</h3>{" "}
          </div>
          {/* form */}
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center items-center gap-8">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-100 rounded-xl placeholder:p-2 outline-0 h-10 w-40 md:w-50 pl-2"
                placeholder="title"
              />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-100 rounded-xl placeholder:p-2 outline-0 h-10  w-40 md:w-50 pl-2"
                placeholder="description"
              />
              <button
                type="submit"
                className="border hover:border-gray-400 rounded-xl px-4 h-8 text-gray-200 bg-amber-500"
              >
                submit
              </button>
            </div>
          </form>

          {/* list of items */}
          <ul className="mt-7">
            {todos.map((todo) => {
              return (
                <li
                  className="flex justify-between items-center  border-b border-gray-300 px-5 md:px-1 p-1 my-3"
                  key={todo._id}
                >
                  {editId === null || editId !== todo._id ? (
                    <div>
                      <p className="text-[14px]">{todo.title}</p>
                      <p className="text-[12px]">{todo.description}</p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="bg-gray-100 rounded-full placeholder:p-2 outline-0 h-9 w-30 pl-2"
                        placeholder="title"
                      />
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="bg-gray-100 rounded-full placeholder:p-2 outline-0 h-9 w-30 pl-2"
                        placeholder="description"
                      />
                    </div>
                  )}
                  {/* btn */}
                  <div className=" space-x-2">
                    <button
                      className="bg-green-600 rounded-2xl p-1 text-[14px] w-16 text-center"
                      onClick={() =>
                        editId == null || editId !== todo._id
                          ? handleEdit(todo)
                          : handleUpdate(todo._id)
                      }
                    >
                      {editId === null || editId !== todo._id
                        ? "edit"
                        : "update"}
                    </button>
                    <button
                      className="bg-red-500 rounded-2xl p-1 text-[14px] w-16 text-center"
                      onClick={() =>
                        editId === null || editId !== todo._id
                          ? handleDelete(todo._id)
                          : setEditId(null)
                      }
                    >
                      {editId === null || editId !== todo._id
                        ? "Delete"
                        : "Cancel"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
