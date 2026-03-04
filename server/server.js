require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection (Replace string with your local or Atlas URI)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Schema Definition
const contactSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// API Routes

// Auth routes
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const auth = require('./middleware/auth');

// 1. GET: Fetch all contacts
app.get('/api/contacts', auth, async (req, res) => {
    try {
        const contacts = await Contact.find({ userId: req.user }).sort({ createdAt: -1 }); // Sorting (Bonus)
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST: Add new contact
app.post('/api/contacts', auth, async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        // Basic backend validation
        if (!name || !email || !phone) {
            return res.status(400).json({ error: "Please fill required fields" });
        }
        const newContact = new Contact({ userId: req.user, name, email, phone, message });
        await newContact.save();
        res.status(201).json(newContact);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. DELETE: Remove contact (Bonus)
app.delete('/api/contacts/:id', auth, async (req, res) => {
    try {
        const contact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user });
        if (!contact) {
            return res.status(404).json({ error: "Contact not found or unauthorized" });
        }
        res.json({ message: "Contact deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add this before app.listen
app.put('/api/contacts/:id', auth, async (req, res) => {
    try {
        const updatedContact = await Contact.findOneAndUpdate(
            { _id: req.params.id, userId: req.user },
            req.body,
            { new: true }
        );
        if (!updatedContact) {
            return res.status(404).json({ error: "Contact not found or unauthorized" });
        }
        res.json(updatedContact);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
if (!process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;