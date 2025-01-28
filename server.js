const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.mongo_uri;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => console.error("MongoDB connection error:", error));

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
  },
  class: {
    type: String,
    required: [true, "Class is required"],
  },
  section: {
    type: String,
  },
});

const Student = mongoose.model("Student", studentSchema);

const server = express();
server.use(express.json());

const port = 5000;


server.post("/students", async (req, res) => {
  try {
    const { name, age, class: studentClass, section } = req.body;
    if (!name || !age || !studentClass) {
      return res.status(400).json({ error: "Name, age, and class are required." });
    }

    const newStudent = new Student({ name, age, class: studentClass, section });
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({ error: "Error adding student", details: error.message });
  }
});


server.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students", details: error.message });
  }
});


server.get("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Error fetching student", details: error.message });
  }
});


server.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, class: studentClass, section } = req.body;
    if (!name || !age || !studentClass) {
      return res.status(400).json({ error: "Name, age, and class are required." });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, age, class: studentClass, section },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: "Error updating student", details: error.message });
  }
});


server.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully", deletedStudent });
  } catch (error) {
    res.status(500).json({ error: "Error deleting student", details: error.message });
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
