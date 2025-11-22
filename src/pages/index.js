import React, { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("todo");
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todos");
      if (saved) setTodos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const handleAddOrUpdate = () => {
    if (!form.title.trim()) return alert("Title cannot be empty");

    if (editingId !== null) {
      setTodos((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...form, updatedAt: new Date() } : t))
      );
      setEditingId(null);
    } else {
      const newTodo = {
        id: Date.now(),
        ...form,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTodos((prev) => [...prev, newTodo]);
    }
    setForm({ title: "", description: "", priority: "Medium" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this task?")) setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCompleteToggle = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date() } : t))
    );
  };

  const handleEdit = (todo) => {
    setForm({ title: todo.title, description: todo.description, priority: todo.priority });
    setEditingId(todo.id);
    setActiveTab("todo");
  };

  const filteredTodos = todos
    .filter((t) => (activeTab === "todo" ? !t.completed : t.completed))
    .filter(
      (t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
    );

  const todoCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="app-container">
      <h1>🌟 Ultimate To-Do App</h1>

      <div className="form-container">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Task Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="input"
        />
        <textarea
          placeholder="Task Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="textarea"
        />
        <select
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
          className="select"
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <div className="form-buttons">
          <button onClick={handleAddOrUpdate} className="btn primary">
            {editingId ? "Update Task" : "Add Task"}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setForm({ title: "", description: "", priority: "Medium" });
                setEditingId(null);
              }}
              className="btn secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === "todo" ? "tab todo active" : "tab todo"}
          onClick={() => setActiveTab("todo")}
        >
          To Do ({todoCount})
        </button>
        <button
          className={activeTab === "completed" ? "tab completed active" : "tab completed"}
          onClick={() => setActiveTab("completed")}
        >
          Completed ({completedCount})
        </button>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 && <p className="empty-text">No tasks found.</p>}
        {filteredTodos.map((t) => (
          <div key={t.id} className={`todo-card ${t.completed ? "completed" : ""}`}>
            <div className={`badge ${t.completed ? "completed-badge" : "todo-badge"}`}>
              {t.completed ? "Completed" : "To Do"}
            </div>
            <div className="todo-header">
              <h3>{t.title}</h3>
              <span>{new Date(t.updatedAt || t.createdAt).toLocaleString()}</span>
            </div>
            <p>{t.description}</p>
            <div className={`priority ${t.priority.toLowerCase()}`}>{t.priority}</div>
            <div className="todo-actions">
              {!t.completed && (
                <button onClick={() => handleEdit(t)} className="btn small edit">
                  ✏️
                </button>
              )}
              <button onClick={() => handleDelete(t.id)} className="btn small delete">
                🗑️
              </button>
              <button onClick={() => handleCompleteToggle(t.id)} className="btn small complete">
                {t.completed ? "✔️" : "✅"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .app-container {
          max-width: 900px;
          margin: auto;
          font-family: 'Poppins', sans-serif;
          padding: 20px;
          background: linear-gradient(135deg, #fdfbfb, #ebedee);
          min-height: 100vh;
        }
        h1 {
          text-align: center;
          font-weight: 700;
          background: linear-gradient(90deg, #f97316, #3b82f6, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 2.5rem;
          margin-bottom: 30px;
        }

        .form-container { display: flex; flex-direction: column; gap: 12px; margin-bottom: 25px; }
        .input, .textarea, .search-input, .select {
          padding: 12px; border-radius: 15px; border: none; font-size: 15px; width: 100%;
          transition: 0.2s all; background-color: #fef3c7;
        }
        .input:focus, .textarea:focus, .search-input:focus, .select:focus {
          outline: none; box-shadow: 0 0 10px rgba(79, 70, 229, 0.3);
        }
        .textarea { resize: none; min-height: 60px; }
        .form-buttons { display: flex; gap: 12px; margin-top: 5px; }
        .btn { padding: 10px 18px; border-radius: 12px; cursor: pointer; border: none; transition: 0.3s; font-weight: 500; }
        .btn:hover { transform: translateY(-2px); }
        .primary { background: linear-gradient(90deg, #f97316, #facc15); color: white; }
        .secondary { background: linear-gradient(90deg, #9ca3af, #6b7280); color: white; }

        .tabs { display: flex; gap: 15px; margin-bottom: 25px; justify-content: center; }
        .tab { padding: 10px 25px; border-radius: 15px; cursor: pointer; font-weight: 500; color: white; transition: 0.3s; border: none; }
        .tab.todo { background: #3b82f6; }
        .tab.completed { background: #10b981; }
        .tab.active { box-shadow: 0 4px 15px rgba(0,0,0,0.2); transform: translateY(-2px); }

        .todo-list { display: flex; flex-direction: column; gap: 15px; }
        .todo-card {
          position: relative; background: linear-gradient(135deg, #fef3c7, #fcd34d);
          padding: 20px; border-radius: 20px; box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          display: flex; flex-direction: column; transition: transform 0.3s, box-shadow 0.3s;
        }
        .todo-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .todo-card.completed { background: linear-gradient(135deg, #bbf7d0, #4ade80); text-decoration: line-through; opacity: 0.85; }

        .badge { position: absolute; top: 12px; left: 12px; padding: 4px 10px; border-radius: 8px; color: white; font-weight: 600; font-size: 12px; }
        .todo-badge { background: #f59e0b; }
        .completed-badge { background: #10b981; }

        .priority { align-self: flex-start; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; color: white; margin-top: 5px; }
        .priority.high { background: #ef4444; }
        .priority.medium { background: #f97316; }
        .priority.low { background: #3b82f6; }

        .todo-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .todo-actions { margin-top: 12px; display: flex; gap: 12px; }
        .btn.small { padding: 6px 10px; font-size: 13px; border-radius: 10px; }
        .btn.edit { background: #3b82f6; color: white; }
        .btn.delete { background: #ef4444; color: white; }
        .btn.complete { background: #10b981; color: white; }
        .empty-text { text-align: center; color: #6b7280; font-style: italic; }
      `}</style>
    </div>
  );
}

export default App;
