// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false, // لا تُرجع كلمة المرور عند الاستعلام عن المستخدم
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // الأدوار الممكنة هي 'user' أو 'admin'
        default: 'user', // القيمة الافتراضية هي 'user'
    },
});

// **[تم الإصلاح]** : إزالة next والاعتماد على async/await لحل خطأ "next is not a function"
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return; // الخروج إذا لم يتم تعديل كلمة المرور
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // سيتم المتابعة للحفظ تلقائياً
});

// طريقة لمقارنة كلمة المرور
UserSchema.methods.comparePassword = async function (canditatePassword) {
    // يجب استدعاء هذا بعد أن يتم تحديد (+password) في استعلام findOne
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model('User', UserSchema);