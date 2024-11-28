import express from "express";
import Grade from "../models/Grade.mjs";  

const router = express.Router();

// Create a single grade entry
router.post("/", async (req, res) => {
  let newDocument = req.body;

  // rename fields for backwards compatibility
  if (newDocument.student_id) {
    newDocument.learner_id = newDocument.student_id;
    delete newDocument.student_id;
  }

  try {
    const newGrade = new Grade(newDocument);
    await newGrade.save();
    res.status(201).send(newGrade);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get a single grade entry by ID
router.get("/:id", async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).send("Grade not found");
    res.status(200).send(grade);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Add a score to a grade entry
router.patch("/:id/add", async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).send("Grade not found");

    grade.scores.push(req.body.score);  
    await grade.save();
    res.status(200).send(grade);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Remove a score from a grade entry
router.patch("/:id/remove", async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).send("Grade not found");

    const index = grade.scores.indexOf(req.body.score);
    if (index > -1) {
      grade.scores.splice(index, 1);  
      await grade.save();
      res.status(200).send(grade);
    } else {
      res.status(404).send("Score not found");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a single grade entry
router.delete("/:id", async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    if (!grade) return res.status(404).send("Grade not found");
    res.status(200).send(grade);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get a learner's grade data
router.get("/learner/:id", async (req, res) => {
  const query = { learner_id: Number(req.params.id) };
  
  if (req.query.class) query.class_id = Number(req.query.class);

  try {
    const grades = await Grade.find(query);
    if (!grades.length) return res.status(404).send("Grades not found");
    res.status(200).send(grades);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a learner's grade data
router.delete("/learner/:id", async (req, res) => {
  try {
    const result = await Grade.deleteMany({ learner_id: Number(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).send("No grades found for learner");
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get a class's grade data
router.get("/class/:id", async (req, res) => {
  const query = { class_id: Number(req.params.id) };
  
  if (req.query.learner) query.learner_id = Number(req.query.learner);

  try {
    const grades = await Grade.find(query);
    if (!grades.length) return res.status(404).send("Grades not found");
    res.status(200).send(grades);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Update a class ID
router.patch("/class/:id", async (req, res) => {
  try {
    const result = await Grade.updateMany(
      { class_id: Number(req.params.id) },
      { $set: { class_id: req.body.class_id } }
    );
    if (result.nModified === 0) return res.status(404).send("No grades updated");
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a class's grade data
router.delete("/class/:id", async (req, res) => {
  try {
    const result = await Grade.deleteMany({ class_id: Number(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).send("No grades found for class");
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

export default router;
