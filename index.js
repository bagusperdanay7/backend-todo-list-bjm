// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database for to-do items
let todos = [
  { id: 1, text: "Menyiapkan perangkat untuk wawancara", completed: false },
  { id: 2, text: "Menghadiri undangan wawancara", completed: false },
  { id: 3, text: "Membuat aplikasi To-Do List", completed: false },
];

// Mengambil semua tugas
app.get("/todos", (req, res) => {
  res.json(todos);
});

// Membuat tugas baru
app.post("/todos", (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Tugas tidak boleh kosong!" });
  }

  const newId =
    todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;
  const newTodo = {
    id: newId,
    text,
    completed: false,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Mengubah tugas
app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { text, completed } = req.body;
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Tugas tidak ditemukan" });
  }

  todos[todoIndex] = {
    ...todos[todoIndex],
    text: text !== undefined ? text : todos[todoIndex].text,
    completed: completed !== undefined ? completed : todos[todoIndex].completed,
  };

  res.json(todos[todoIndex]);
});

// Menghapus tugas
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Tugas tidak ditemukan" });
  }

  const deletedTodo = todos[todoIndex];
  todos = todos.filter((todo) => todo.id !== id);

  res.json(deletedTodo);
});

// Toggle status complete
app.patch("/todos/:id/toggle", (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Tugas tidak ditemukan" });
  }

  todos[todoIndex].completed = !todos[todoIndex].completed;
  res.json(todos[todoIndex]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});
