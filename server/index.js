const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'videos');
const filesDir = path.join(__dirname, 'uploads', 'files');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '250mb' }));
app.use(express.urlencoded({ limit: '250mb', extended: true }));

// Serve uploaded static media files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('🎬 Starting Econo Academy Backend...');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => { console.log('✅ Connected to MongoDB Atlas!'); if (typeof seedInitialDiscussions === 'function') seedInitialDiscussions(); })
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Message Schema (WhatsApp AI)
const Message = mongoose.model('Message', new mongoose.Schema({
    from: String,
    name: String,
    body: String,
    reply: String,
    timestamp: { type: Date, default: Date.now }
}));

// Portal Message Schema (Student LMS Portal)
const PortalMessage = mongoose.model('PortalMessage', new mongoose.Schema({
    studentEmail: String,
    studentName: String,
    text: String,
    sender: String, // 'student' or 'admin'
    attachment: Object,
    isRead: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
}, { strict: false }));

// Student Schema
const Student = mongoose.model('Student', new mongoose.Schema({
    id: String,
    studentId: String,
    name: String,
    email: String,
    phone: String,
    password: { type: String, required: false },
    grade: String,
    subject: String,
    joined: String,
    status: String,
    paymentStatus: String,
    receiptUrl: String,
    receiptImage: String,
    paymentDate: String,
    referredBy: String,
    referralCode: String,
    profilePic: String,
    coverPhoto: String,
    isPresent: Boolean,
    attendanceDate: String,
    attendanceTime: String,
    attendanceHistory: Array,
    quizResult: Object
}, { strict: false }));

// Session Schema
const LmsSession = mongoose.model('LmsSession', new mongoose.Schema({
    grade: String,
    title: String,
    titleSi: String,
    desc: String,
    stats: String,
    videoUrl: String,
    videoFile: Boolean,
    locked: Boolean,
    content: Array
}));

// Question Schema
const QuestionBank = mongoose.model('QuestionBank', new mongoose.Schema({
    grade: String,
    text: String,
    options: Array,
    correctIndex: Number,
    category: String
}));

// Assignment Schema
const LmsAssignment = mongoose.model('LmsAssignment', new mongoose.Schema({
    id: String,
    grade: String,
    title: String,
    titleSi: String,
    desc: String,
    dueDate: String,
    timeLimit: String,
    totalMarks: Number,
    fileUrl: String,
    fileName: String,
    locked: { type: Boolean, default: false },
    tasks: Array
}, { strict: false }));

// Assignment Submission Schema
const LmsSubmission = mongoose.model('LmsSubmission', new mongoose.Schema({
    assignmentId: String,
    assignmentTitle: String,
    studentEmail: String,
    studentName: String,
    grade: String,
    answers: Object,
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Submitted' },
    score: Number,
    feedback: String
}, { strict: false }));

// Settings Schema
const Settings = mongoose.model('Settings', new mongoose.Schema({
    type: String, // 'global' or 'website'
    data: Object
}));


// Discussion Topic Schema (Teacher Q&A & Student Comments)
const DiscussionTopic = mongoose.model('DiscussionTopic', new mongoose.Schema({
    title: { type: String, required: true },
    titleSi: String,
    question: { type: String, required: true },
    grade: { type: String, default: 'All' }, // 'All', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Grade 13'
    category: { type: String, default: 'General' }, // 'Theory', 'Past Paper', 'Model Paper', 'Discussion'
    authorName: { type: String, default: 'Teacher' },
    authorRole: { type: String, default: 'teacher' }, // 'teacher', 'admin', 'student'
    authorPhoto: String,
    tags: [String],
    pinned: { type: Boolean, default: false },
    comments: [{
        id: String,
        studentName: String,
        studentEmail: String,
        studentPhoto: String,
        role: { type: String, default: 'student' }, // 'student' or 'teacher'
        comment: String,
        likes: { type: Number, default: 0 },
        likedBy: [String],
        isVerifiedAnswer: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
}, { strict: false }));

// Group Chat Message Schema (Grade 6 to 13 Channels)
const GroupChatMessage = mongoose.model('GroupChatMessage', new mongoose.Schema({
    grade: { type: String, required: true }, // 'Grade 6' through 'Grade 13', or 'All'
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderRole: { type: String, default: 'student' }, // 'student', 'teacher', 'admin'
    senderPhoto: String,
    text: { type: String, default: '' },
    attachment: Object,
    likes: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
}, { strict: false }));

// Helper to seed initial discussion topics if database is fresh
const seedInitialDiscussions = async () => {
    try {
        const count = await DiscussionTopic.countDocuments();
        if (count === 0) {
            await DiscussionTopic.create([
                {
                    title: "Opportunity Cost in Economic Decision Making",
                    titleSi: "ආර්ථික තීරණ ගැනීමේදී ආවස්ථික පිරිවැය (Opportunity Cost) යෙදෙන්නේ කෙසේද?",
                    question: "Explain the concept of opportunity cost with a real-world example from Sri Lanka's economy. How does scarcity force society to make choices between consumer goods and capital goods?",
                    grade: "Grade 12",
                    category: "Theory",
                    authorName: "Kavinda Sir (Lead Lecturer)",
                    authorRole: "teacher",
                    authorPhoto: "",
                    pinned: true,
                    tags: ["Microeconomics", "Unit 1", "Opportunity Cost"],
                    comments: [
                        {
                            id: "comm_seed_1",
                            studentName: "Kasun Perera",
                            studentEmail: "kasun@sample.lk",
                            studentPhoto: "",
                            role: "student",
                            comment: "ආවස්ථික පිරිවැය යනු කිසියම් තේරීමක් කිරීමේදී කැප කිරීමට සිදුවන හොඳම විකල්පයේ අගයයි. උදාහරණයක් ලෙස රජය අධ්‍යාපනයට මුදල් වෙන් කිරීමේදී යටිතල පහසුකම් සංවර්ධනය වෙනුවෙන් වැය කිරීමට තිබූ අවස්ථාව අහිමි වේ.",
                            likes: 4,
                            likedBy: [],
                            isVerifiedAnswer: true,
                            createdAt: new Date(Date.now() - 3600000 * 5)
                        }
                    ],
                    createdAt: new Date(Date.now() - 3600000 * 24)
                },
                {
                    title: "Fiscal Policy vs Monetary Policy during Inflation",
                    titleSi: "උද්ධමනය පාලනය කිරීම සඳහා මූල්‍ය ප්‍රතිපත්තිය හා රාජ්‍ය මූල්‍ය ප්‍රතිපත්තිය භාවිතය",
                    question: "Which policy tool is more immediately effective in curtailing demand-pull inflation in a developing economy? Discuss interest rate adjustments vs government expenditure cuts.",
                    grade: "Grade 13",
                    category: "Past Paper",
                    authorName: "Kavinda Sir (Lead Lecturer)",
                    authorRole: "teacher",
                    authorPhoto: "",
                    pinned: true,
                    tags: ["Macroeconomics", "Inflation", "Fiscal Policy"],
                    comments: [],
                    createdAt: new Date(Date.now() - 3600000 * 12)
                },
                {
                    title: "Welcome to Study Forum! විෂය කරුණු සම්බන්ධ ප්‍රශ්න මෙහිදී සාකච්ඡා කරමු.",
                    titleSi: "සියලුම සිසුන් සඳහා සාකච්ඡා මණ්ඩපය (All Grades Q&A)",
                    question: "ඔබට ආර්ථික විද්‍යා පාඩම් මාලාවේ ගැටලු සහ විභාග ප්‍රශ්න පිළිබඳව මෙහිදී ගුරුවරයාගෙන් සහ සහෝදර සිසුන්ගෙන් විමසා දැනගත හැක. සියලුම ප්‍රශ්න පිළිතුරු සාදරයෙන් පිළිගනිමු!",
                    grade: "All",
                    category: "General",
                    authorName: "Admin / Teacher Support",
                    authorRole: "teacher",
                    pinned: true,
                    tags: ["General", "Announcement", "Q&A"],
                    comments: [],
                    createdAt: new Date(Date.now() - 3600000 * 48)
                }
            ]);
            console.log("🌱 Initial discussion topics seeded.");
        }
    } catch (e) {
        console.error("Discussion seed error:", e.message);
    }
};

// Website Inquiry Schema (Contact Form)
const Inquiry = mongoose.model('Inquiry', new mongoose.Schema({
    name: String,
    phone: String,
    message: String,
    status: { type: String, default: 'unread' },
    date: { type: String, default: () => new Date().toLocaleString() },
    createdAt: { type: Date, default: Date.now }
}));

// API Routes
app.get('/api/inquiries', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/inquiries', async (req, res) => {
    try {
        const { name, phone, message } = req.body;
        const newInquiry = new Inquiry({
            name,
            phone,
            message,
            status: 'unread',
            date: new Date().toLocaleString(),
            createdAt: new Date()
        });
        await newInquiry.save();
        res.status(201).json(newInquiry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/inquiries/:id', async (req, res) => {
    try {
        const updated = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/inquiries/:id', async (req, res) => {
    try {
        await Inquiry.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/api/whatsapp/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/whatsapp/messages/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Helper to build flexible student finder query
function getStudentFilter(identifier) {
    if (!identifier) return null;
    const cleanId = String(identifier).trim();
    const isObjectId = mongoose.Types.ObjectId.isValid(cleanId) && cleanId.length === 24;
    const escaped = cleanId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const clauses = [
        { id: cleanId },
        { studentId: cleanId },
        { email: { $regex: new RegExp(`^${escaped}$`, 'i') } }
    ];
    if (isObjectId) {
        clauses.push({ _id: new mongoose.Types.ObjectId(cleanId) });
    }
    return { $or: clauses };
}

// Portal Message Routes
app.get('/api/portal/messages', async (req, res) => {
    try {
        const { email } = req.query;
        let query = {};
        if (email) {
            const escaped = String(email).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query = { studentEmail: { $regex: new RegExp(`^${escaped}$`, 'i') } };
        }
        const messages = await PortalMessage.find(query).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/portal/messages', async (req, res) => {
    try {
        const { studentEmail, studentName, text, sender, attachment } = req.body;
        const cleanEmail = (studentEmail || '').trim().toLowerCase();
        const newMessage = new PortalMessage({
            studentEmail: cleanEmail,
            studentName: studentName || 'Student',
            text: text || '',
            sender: sender || 'student',
            attachment: attachment || null,
            isRead: sender === 'admin',
            timestamp: new Date()
        });
        await newMessage.save();
        res.json(newMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/portal/messages/read/:email', async (req, res) => {
    try {
        const escaped = String(req.params.email).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        await PortalMessage.updateMany(
            { studentEmail: { $regex: new RegExp(`^${escaped}$`, 'i') }, sender: 'student', isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/portal/messages/read-admin/:email', async (req, res) => {
    try {
        const escaped = String(req.params.email).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        await PortalMessage.updateMany(
            { studentEmail: { $regex: new RegExp(`^${escaped}$`, 'i') }, sender: 'admin', isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- STUDENTS API ROUTES ---

app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find().sort({ _id: -1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/students/:id', async (req, res) => {
    try {
        const filter = getStudentFilter(req.params.id);
        if (!filter) return res.status(404).json({ error: 'Student not found' });
        const student = await Student.findOne(filter);
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/students/bulk', async (req, res) => {
    try {
        await Student.deleteMany({});
        if (req.body && req.body.length > 0) {
            await Student.insertMany(req.body);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/students', async (req, res) => {
    try {
        const studentData = req.body;
        if (studentData && studentData.email) {
            const escaped = String(studentData.email).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const existing = await Student.findOne({ email: { $regex: new RegExp(`^${escaped}$`, 'i') } });
            if (existing) {
                const updated = await Student.findByIdAndUpdate(
                    existing._id,
                    { $set: studentData },
                    { new: true }
                );
                return res.json(updated);
            }
        }
        const newStudent = new Student(studentData);
        await newStudent.save();
        res.json(newStudent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/students/:id', async (req, res) => {
    try {
        const filter = getStudentFilter(req.params.id);
        let updated = null;
        if (filter) {
            updated = await Student.findOneAndUpdate(filter, { $set: req.body }, { new: true });
        }
        if (!updated && req.body.email) {
            const escaped = String(req.body.email).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            updated = await Student.findOneAndUpdate(
                { email: { $regex: new RegExp(`^${escaped}$`, 'i') } },
                { $set: req.body },
                { new: true }
            );
        }
        if (!updated && req.body.studentId) {
            updated = await Student.findOneAndUpdate(
                { studentId: String(req.body.studentId).trim() },
                { $set: req.body },
                { new: true }
            );
        }
        res.json(updated || { success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/students/:id', async (req, res) => {
    try {
        const filter = getStudentFilter(req.params.id);
        if (filter) {
            await Student.findOneAndDelete(filter);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Video Upload API (Save MP4/video to server disk & return permanent URL)
app.post('/api/upload-video', async (req, res) => {
    try {
        const { videoData, fileName } = req.body;
        if (!videoData) {
            return res.status(400).json({ error: 'No video data provided' });
        }

        let base64Content = videoData;
        let ext = 'mp4';

        if (videoData.includes(';base64,')) {
            const matches = videoData.match(/^data:video\/([a-zA-Z0-9]+);base64,(.+)$/);
            if (matches) {
                ext = matches[1] === 'quicktime' ? 'mov' : matches[1];
                base64Content = matches[2];
            } else {
                base64Content = videoData.split(';base64,')[1];
            }
        }

        const safeExt = ['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(ext.toLowerCase()) ? ext.toLowerCase() : 'mp4';
        const cleanName = `video-${Date.now()}-${Math.floor(Math.random() * 1000)}.${safeExt}`;
        const targetPath = path.join(uploadsDir, cleanName);

        const buffer = Buffer.from(base64Content, 'base64');
        fs.writeFileSync(targetPath, buffer);

        const videoUrl = `http://localhost:5000/uploads/videos/${cleanName}`;
        console.log(`🎬 Video saved: ${cleanName} (${(buffer.length / (1024 * 1024)).toFixed(2)} MB)`);
        res.json({ success: true, url: videoUrl, fileName: cleanName, size: buffer.length });
    } catch (err) {
        console.error('Video upload error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Resource File Upload API (Save PDF, Docs, etc. to server disk & return permanent URL)
app.post('/api/upload-file', async (req, res) => {
    try {
        const { fileData, fileName, fileType } = req.body;
        if (!fileData) {
            return res.status(400).json({ error: 'No file data provided' });
        }

        let base64Content = fileData;
        let ext = 'pdf';

        if (fileData.includes(';base64,')) {
            base64Content = fileData.split(';base64,')[1];
        }

        if (fileName && fileName.includes('.')) {
            ext = fileName.split('.').pop();
        }

        const safeExt = ext.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'pdf';
        const cleanName = `file-${Date.now()}-${Math.floor(Math.random() * 1000)}.${safeExt}`;
        const targetPath = path.join(filesDir, cleanName);

        const buffer = Buffer.from(base64Content, 'base64');
        fs.writeFileSync(targetPath, buffer);

        const fileUrl = `http://localhost:5000/uploads/files/${cleanName}`;
        console.log(`📄 Resource File saved: ${cleanName} (${(buffer.length / (1024 * 1024)).toFixed(2)} MB)`);
        res.json({ success: true, url: fileUrl, fileName: fileName || cleanName, size: buffer.length });
    } catch (err) {
        console.error('Resource upload error:', err);
        res.status(500).json({ error: err.message });
    }
});

// 2. LMS Sessions API
app.get('/api/sessions', async (req, res) => {
    try {
        const { grade } = req.query;
        let query = {};
        if (grade) {
            query = { grade: { $regex: new RegExp(`^${grade.trim()}$`, 'i') } };
        }
        const sessions = await LmsSession.find(query);
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/sessions/bulk', async (req, res) => {
    try {
        await LmsSession.deleteMany({});
        const data = req.body;
        let allSessions = [];
        if (Array.isArray(data)) {
            allSessions = data;
        } else if (data && typeof data === 'object') {
            for (const grade in data) {
                if (Array.isArray(data[grade])) {
                    data[grade].forEach(s => {
                        allSessions.push({
                            ...s,
                            grade: s.grade || grade
                        });
                    });
                }
            }
        }
        if (allSessions.length > 0) {
            await LmsSession.insertMany(allSessions);
        }
        console.log(`📚 Updated sessions bulk: ${allSessions.length} total sessions saved.`);
        res.json({ success: true, count: allSessions.length });
    } catch (err) {
        console.error('Error saving bulk sessions:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/sessions', async (req, res) => {
    try {
        const newSession = new LmsSession(req.body);
        await newSession.save();
        res.json(newSession);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Question Bank API
app.get('/api/questions', async (req, res) => {
    try {
        const { grade } = req.query;
        let query = {};
        if (grade) {
            query = { grade: { $regex: new RegExp(`^${grade.trim()}$`, 'i') } };
        }
        const questions = await QuestionBank.find(query);
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/questions/bulk', async (req, res) => {
    try {
        await QuestionBank.deleteMany({});
        const data = req.body;
        let allQs = [];
        if (Array.isArray(data)) {
            allQs = data;
        } else if (data && typeof data === 'object') {
            for (const grade in data) {
                if (Array.isArray(data[grade])) {
                    data[grade].forEach(q => {
                        allQs.push({
                            ...q,
                            grade: q.grade || grade
                        });
                    });
                }
            }
        }
        if (allQs.length > 0) {
            await QuestionBank.insertMany(allQs);
        }
        console.log(`📝 Updated questions bulk: ${allQs.length} total questions saved.`);
        res.json({ success: true, count: allQs.length });
    } catch (err) {
        console.error('Error saving bulk questions:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/questions', async (req, res) => {
    try {
        const newQuestion = new QuestionBank(req.body);
        await newQuestion.save();
        res.json(newQuestion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Assignments API
app.get('/api/assignments', async (req, res) => {
    try {
        const { grade } = req.query;
        let query = {};
        if (grade) {
            query = { grade: { $regex: new RegExp(`^${grade.trim()}$`, 'i') } };
        }
        const assignments = await LmsAssignment.find(query);
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/assignments/bulk', async (req, res) => {
    try {
        await LmsAssignment.deleteMany({});
        const data = req.body;
        let allAssignments = [];
        if (Array.isArray(data)) {
            allAssignments = data;
        } else if (data && typeof data === 'object') {
            for (const grade in data) {
                if (Array.isArray(data[grade])) {
                    data[grade].forEach(a => {
                        allAssignments.push({
                            ...a,
                            grade: a.grade || grade
                        });
                    });
                }
            }
        }
        if (allAssignments.length > 0) {
            await LmsAssignment.insertMany(allAssignments);
        }
        console.log(`📝 Updated assignments bulk: ${allAssignments.length} saved.`);
        res.json({ success: true, count: allAssignments.length });
    } catch (err) {
        console.error('Error saving bulk assignments:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/assignments', async (req, res) => {
    try {
        const newAssignment = new LmsAssignment(req.body);
        await newAssignment.save();
        res.json(newAssignment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/assignments/:id', async (req, res) => {
    try {
        const updated = await LmsAssignment.findOneAndUpdate(
            { $or: [{ _id: req.params.id }, { id: req.params.id }] },
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/assignments/:id', async (req, res) => {
    try {
        await LmsAssignment.findOneAndDelete({ $or: [{ _id: req.params.id }, { id: req.params.id }] });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Submissions API
app.get('/api/submissions', async (req, res) => {
    try {
        const { assignmentId, studentEmail, grade } = req.query;
        let query = {};
        if (assignmentId) query.assignmentId = assignmentId;
        if (studentEmail) query.studentEmail = studentEmail;
        if (grade) query.grade = { $regex: new RegExp(`^${grade.trim()}$`, 'i') };
        const submissions = await LmsSubmission.find(query).sort({ submittedAt: -1 });
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/submissions', async (req, res) => {
    try {
        const { assignmentId, studentEmail } = req.body;
        const submission = await LmsSubmission.findOneAndUpdate(
            { assignmentId, studentEmail },
            { ...req.body, submittedAt: new Date() },
            { new: true, upsert: true }
        );
        res.json(submission);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/submissions/:id', async (req, res) => {
    try {
        const updated = await LmsSubmission.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/submissions/:id', async (req, res) => {
    try {
        await LmsSubmission.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Settings API (Global & Website)
app.get('/api/settings', async (req, res) => {
    try {
        const settings = await Settings.find();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        const { type, data } = req.body;
        const updated = await Settings.findOneAndUpdate(
            { type },
            { type, data },
            { new: true, upsert: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// ==========================================
// DISCUSSIONS (TEACHER Q&A & STUDENT REPLIES)
// ==========================================
app.get('/api/discussions', async (req, res) => {
    try {
        const { grade, search, category } = req.query;
        let query = {};
        if (grade && grade !== 'All' && grade !== 'all') {
            query.$or = [{ grade: grade }, { grade: 'All' }, { grade: { $exists: false } }];
        }
        if (category && category !== 'All') {
            query.category = category;
        }
        if (search) {
            const escaped = String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const searchConditions = [
                { title: { $regex: escaped, $options: 'i' } },
                { titleSi: { $regex: escaped, $options: 'i' } },
                { question: { $regex: escaped, $options: 'i' } }
            ];
            if (query.$or) {
                query.$and = [{ $or: query.$or }, { $or: searchConditions }];
                delete query.$or;
            } else {
                query.$or = searchConditions;
            }
        }
        const topics = await DiscussionTopic.find(query).sort({ pinned: -1, createdAt: -1 });
        res.json(topics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/discussions', async (req, res) => {
    try {
        const { title, titleSi, question, grade, category, authorName, authorRole, authorPhoto, tags, pinned } = req.body;
        if (!title || !question) {
            return res.status(400).json({ error: "Title and question are required" });
        }
        const topic = new DiscussionTopic({
            title,
            titleSi: titleSi || '',
            question,
            grade: grade || 'All',
            category: category || 'General',
            authorName: authorName || 'Teacher',
            authorRole: authorRole || 'teacher',
            authorPhoto: authorPhoto || '',
            tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
            pinned: Boolean(pinned),
            comments: [],
            createdAt: new Date()
        });
        await topic.save();
        res.json(topic);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/discussions/:id', async (req, res) => {
    try {
        await DiscussionTopic.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/discussions/:id/comments', async (req, res) => {
    try {
        const { studentName, studentEmail, studentPhoto, role, comment } = req.body;
        if (!comment || !comment.trim()) {
            return res.status(400).json({ error: "Comment text cannot be empty" });
        }
        const newComment = {
            id: 'cmt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            studentName: studentName || 'Student',
            studentEmail: (studentEmail || '').trim().toLowerCase(),
            studentPhoto: studentPhoto || '',
            role: role || 'student',
            comment: comment.trim(),
            likes: 0,
            likedBy: [],
            isVerifiedAnswer: role === 'teacher' || role === 'admin',
            createdAt: new Date()
        };
        const topic = await DiscussionTopic.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: newComment } },
            { new: true }
        );
        if (!topic) return res.status(404).json({ error: "Topic not found" });
        res.json({ success: true, comment: newComment, topic });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/discussions/:id/comments/:commentId', async (req, res) => {
    try {
        const topic = await DiscussionTopic.findByIdAndUpdate(
            req.params.id,
            { $pull: { comments: { id: req.params.commentId } } },
            { new: true }
        );
        res.json({ success: true, topic });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/discussions/:id/like-comment/:commentId', async (req, res) => {
    try {
        const { userEmail } = req.body;
        const topic = await DiscussionTopic.findById(req.params.id);
        if (!topic) return res.status(404).json({ error: "Topic not found" });
        const cIdx = topic.comments.findIndex(c => c.id === req.params.commentId);
        if (cIdx === -1) return res.status(404).json({ error: "Comment not found" });

        const comment = topic.comments[cIdx];
        if (!Array.isArray(comment.likedBy)) comment.likedBy = [];

        const normalizedEmail = (userEmail || '').trim().toLowerCase();
        if (normalizedEmail && comment.likedBy.includes(normalizedEmail)) {
            comment.likedBy = comment.likedBy.filter(e => e !== normalizedEmail);
            comment.likes = Math.max(0, (comment.likes || 1) - 1);
        } else {
            if (normalizedEmail) comment.likedBy.push(normalizedEmail);
            comment.likes = (comment.likes || 0) + 1;
        }
        topic.markModified('comments');
        await topic.save();
        res.json({ success: true, comment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/discussions/:id/verify-comment/:commentId', async (req, res) => {
    try {
        const topic = await DiscussionTopic.findById(req.params.id);
        if (!topic) return res.status(404).json({ error: "Topic not found" });
        const cIdx = topic.comments.findIndex(c => c.id === req.params.commentId);
        if (cIdx === -1) return res.status(404).json({ error: "Comment not found" });

        topic.comments[cIdx].isVerifiedAnswer = !topic.comments[cIdx].isVerifiedAnswer;
        topic.markModified('comments');
        await topic.save();
        res.json({ success: true, comment: topic.comments[cIdx] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// GROUP CHAT (GRADE 6 TO 13 COMMUNITY CHAT)
// ==========================================
app.get('/api/group-chat', async (req, res) => {
    try {
        const { grade, limit } = req.query;
        let query = {};
        if (grade && grade !== 'All') {
            query.$or = [{ grade: grade }, { grade: 'All' }];
        }
        const maxLimit = parseInt(limit, 10) || 200;
        const messages = await GroupChatMessage.find(query)
            .sort({ timestamp: -1 })
            .limit(maxLimit);
        res.json(messages.reverse());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/group-chat', async (req, res) => {
    try {
        const { grade, senderName, senderEmail, senderRole, senderPhoto, text, attachment } = req.body;
        if (!text && !attachment) {
            return res.status(400).json({ error: "Message text or attachment required" });
        }
        const message = new GroupChatMessage({
            grade: grade || 'All',
            senderName: senderName || 'Student',
            senderEmail: (senderEmail || '').trim().toLowerCase(),
            senderRole: senderRole || 'student',
            senderPhoto: senderPhoto || '',
            text: (text || '').trim(),
            attachment: attachment || null,
            likes: 0,
            timestamp: new Date()
        });
        await message.save();
        res.json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/group-chat/:id', async (req, res) => {
    try {
        await GroupChatMessage.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Express Server
app.listen(port, () => {
    console.log(`🌐 API Server is running on http://localhost:${port}`);
});

// --- WHATSAPP BOT LOGIC ---

// Gemini AI Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

// WhatsApp Client Configuration
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-extensions',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ],
    }
});

client.on('qr', (qr) => {
    console.log('--- SCAN THE QR CODE BELOW TO LOGIN ---');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('🚀 WhatsApp Bot is ready and connected!');
});

client.on('message', async (msg) => {
    if (msg.type === 'chat') {
        if (msg.from.includes('@g.us')) return;

        console.log(`📩 New Message from ${msg.from}: ${msg.body}`);
        
        let responseText = "AI Assistant is currently busy. Please try again in a moment.";
        let aiSuccess = false;

        try {
            const academyInfo = `
            Academy Name: Econo Academy
            Founder/Teacher: Ishara Madhushani
            Qualifications: B.A. (Hons) in Economics (University of Colombo), Reading for M.A. in Economics. 10+ years experience.
            
            Available Courses:
            1. Grade 6-9 Sinhala: Saturdays 8.00 AM - 10.00 AM (Rs. 1500/month)
            2. Grade 10 Sinhala: Sundays 10.30 AM - 1.30 PM (Rs. 2000/month)
            3. Economics A/L (Grade 12-13): Tuesdays & Thursdays 4.00 PM - 7.00 PM (Rs. 3500/month)
            
            Location: Online & physical classes (contact for details).
            Website: http://localhost:5173
            `;

            const prompt = `You are the AI assistant for Econo Academy. 
            Use the following information to answer student inquiries:
            ${academyInfo}
            
            Always be polite and helpful. 
            Answer in Sinhala (Unicode or Singlish) if the user asks in Sinhala. 
            Keep answers concise and clear. 
            If you don't know the answer, ask them to wait for the Admin's response.
            
            The student says: ${msg.body}`;

            const result = await model.generateContent(prompt);
            responseText = result.response.text();
            aiSuccess = true;
        } catch (error) {
            console.error('❌ AI Error:', error.message);
            if (error.message.includes('429')) {
                responseText = "AI daily limit reached. Admin will check your message soon.";
            }
        }

        try {
            // Save to MongoDB (Always save the inquiry!)
            const newMessage = new Message({
                from: msg.from,
                name: msg._data.notifyName || 'Student',
                body: msg.body,
                reply: responseText,
                timestamp: new Date()
            });
            await newMessage.save();
            console.log('💾 Message saved to MongoDB.');

            // Reply to WhatsApp
            await msg.reply(responseText);
            if (aiSuccess) console.log('✅ AI Response sent.');
            else console.log('⚠️ Fallback response sent.');
            
        } catch (dbError) {
            console.error('❌ Database Error:', dbError.message);
        }
    }
});

client.initialize();
