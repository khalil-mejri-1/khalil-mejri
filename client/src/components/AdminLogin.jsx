import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ darkMode }) => {
  // 1. حالات النموذج (Form State)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  // 2. معالج إرسال النموذج (Form Submission Handler)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // **ملاحظة:** تأكد من أن هذا المنفذ (3000) هو المنفذ الفعلي الذي يعمل عليه خادم Node.js الخاص بك.
    const API_URL = 'http://localhost:3000/admin/login'; 

    try {
      const response = await axios.post(API_URL, {
        email,
        password
      });

      // التحقق من نجاح الرد
      if (response.data.success) {
        setMessage(`Success: ${response.data.message}`);
        
        // ***********************************************
        // 👈🏻 [التعديل المطلوب]: تخزين البريد الإلكتروني في Local Storage
        localStorage.setItem('adminEmail', email); 
        // ***********************************************
        
        // التوجيه إلى الصفحة الرئيسية
        navigate('/'); 
      }
      
    } catch (error) {
      // التعامل مع أخطاء API (401 Invalid Credentials أو 403 Access Denied)
      const errorMsg = error.response?.data?.message || 'Login failed due to network error.';
      setMessage(`Error: ${errorMsg}`);
      
      // إزالة جميع بيانات الجلسة عند فشل تسجيل الدخول
      localStorage.removeItem('isAdminLoggedIn');
      localStorage.removeItem('adminEmail');
    } finally {
      setLoading(false);
    }
  };

  // 3. عرض المكون
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <div className={`w-full max-w-md p-8 rounded-xl shadow-2xl ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <h2 className="text-3xl font-bold text-center mb-6">
            Admin <span className="text-purple-500">Login</span>
        </h2>
        
        {/* عرض رسالة الخطأ أو النجاح */}
        {message && (
          <div className={`p-3 rounded-lg mb-4 text-center text-sm font-medium ${
            message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message.replace(/(Success|Error): /, '')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-semibold transition duration-300 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;