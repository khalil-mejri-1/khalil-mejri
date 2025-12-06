const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Project = require('./models/Project');
const User = require('./models/User'); // تأكد من المسار الصحيح لموديل المستخدم
const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Enable JSON body parsing
app.use(express.json());

// MongoDB URI
const MONGODB_URI = 'mongodb+srv://kmejri57:ZKknzSQREfNgLF49@main.2yeijf6.mongodb.net/';

// Connect to MongoDB then start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('🎉 Successfully connected to MongoDB!');

    // Start the server ONLY after MongoDB connects
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });










// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World with CORS & Nodemon!' });
});




app.post('/api/projects', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET → Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



app.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please provide email and password' 
        });
    }

    try {
        // البحث عن المستخدم وإحضار حقل كلمة المرور المشفرة
        const user = await User.findOne({ email }).select('+password'); 

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid Credentials' });
        }

        // مقارنة كلمة المرور
        const isMatch = await user.comparePassword(password); 

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid Credentials' });
        }

        // التحقق من دور المسؤول
        if (user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. You are not an administrator.' 
            });
        }

        // تسجيل الدخول ناجح
        res.status(200).json({ 
            success: true, 
            message: 'Admin login successful',
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


app.post('/register', async (req, res) => {
    const { email, password, role } = req.body; 

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and password are required.' 
        });
    }

    try {
        // إنشاء المستخدم مباشرة
        const user = await User.create({ 
            email, 
            password,
            // تعيين الدور: يضمن أن أي قيمة غير 'admin' ترجع إلى القيمة الافتراضية 'user' في المخطط
            role: role === 'admin' ? 'admin' : undefined 
        });

        res.status(201).json({ 
            success: true, 
            message: 'User created successfully.',
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        // التعامل مع خطأ البريد المكرر
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'This email is already registered.'
            });
        }
        
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error: Could not save the user.' });
    }
});



app.get('/check-role/:email', async (req, res) => { 
    // الآن نستقبل البريد من req.params
    const email = req.params.email; 

    if (!email) {
        return res.status(400).json({ success: false, isAdmin: false, message: 'Email is required.' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, isAdmin: false, message: 'User not found.' });
        }

        const isAdmin = user.role === 'admin';

        res.status(200).json({ 
            success: true, 
            isAdmin: isAdmin,
            message: isAdmin ? 'User is an admin.' : 'User is not an admin.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, isAdmin: false, message: 'Server error.' });
    }
});




app.put('/api/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id;
        const updateData = req.body;

        // يمكنك هنا إضافة تحقق من صلاحية المسؤول مرة أخرى قبل التعديل

        const project = await Project.findByIdAndUpdate(
            projectId, 
            updateData, 
            { new: true, runValidators: true } // {new: true} لإرجاع المستند المحدث، {runValidators: true} لتطبيق قواعد الـ Schema
        );

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found.' });
        }

        res.json({ success: true, message: 'Project updated successfully.', project });

    } catch (err) {
        // التعامل مع أخطاء التحقق والأخطاء الأخرى
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server error during project update.' });
    }
});

// 2. 💡 دالة الحذف (DELETE)
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id;
        
        // يمكنك هنا إضافة تحقق من صلاحية المسؤول مرة أخرى قبل الحذف

        const result = await Project.findByIdAndDelete(projectId);

        if (!result) {
            return res.status(404).json({ success: false, message: 'Project not found.' });
        }

        res.json({ success: true, message: 'Project deleted successfully.' });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error during project deletion.' });
    }
});