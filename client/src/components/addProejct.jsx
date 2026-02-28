import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save, Edit } from 'lucide-react';
import { API_URLS } from '../apiConfig';

const API_URL = API_URLS.PROJECTS;

// يستقبل initialData (بيانات المشروع المراد تعديله) و refreshProjects (لتحديث القائمة)
export default function AddProject({ isOpen, onClose, darkMode, initialData, refreshProjects }) {

    if (!isOpen) return null;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const [projectData, setProjectData] = useState({
        title: '',
        description: '',
        liveDemo: '',
        github: '',
        technologies: '',
        image: '',
        featured: false,
    });

    // 💡 خطاف useEffect لتحميل البيانات الأولية عند فتح النموذج للتعديل
    useEffect(() => {
        if (initialData) {
            const techString = Array.isArray(initialData.technologies)
                ? initialData.technologies.join(', ')
                : initialData.technologies || '';

            setProjectData({
                ...initialData,
                technologies: techString,
            });
        } else {
            // إعادة تعيين النموذج في وضع الإضافة
            setProjectData({
                title: '', description: '', liveDemo: '', github: '',
                technologies: '', image: '', featured: false,
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProjectData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setSubmitError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        // معالجة حقل التقنيات: تحويل السلسلة إلى مصفوفة
        const technologiesArray = projectData.technologies
            .split(',')
            .map(tech => tech.trim())
            .filter(tech => tech.length > 0);

        const dataToSend = {
            ...projectData,
            technologies: technologiesArray,
        };

        const isEditing = initialData && initialData._id;
        const method = isEditing ? 'put' : 'post';
        // إذا كان تعديلاً، نستخدم رابط التعديل مع ID المشروع
        const url = isEditing ? `${API_URL}/${initialData._id}` : API_URL;

        try {
            const response = await axios[method](url, dataToSend);

            if (response.data.success) {
                alert(`Project ${isEditing ? 'updated' : 'created'} successfully!`);

                // تحديث قائمة المشاريع في المكون الأب
                if (refreshProjects) {
                    refreshProjects();
                }

                onClose();
            } else {
                setSubmitError(response.data.message || `Failed to ${isEditing ? 'update' : 'create'} project.`);
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Server error or network failure.';
            setSubmitError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const modalClasses = darkMode
        ? "bg-gray-900 text-white border border-gray-700"
        : "bg-white text-gray-900 shadow-2xl";

    const inputClasses = darkMode
        ? "w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-purple-500 focus:border-purple-500"
        : "w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500";

    const formTitle = initialData ? 'Edit Project' : 'Add New Project';
    const submitButtonText = initialData ? 'Update Project' : 'Save Project';
    const submitButtonIcon = initialData ? <Edit size={20} /> : <Save size={20} />;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className={`relative w-full max-w-lg p-8 mx-4 rounded-xl transform transition-all duration-300 scale-100 ${modalClasses}`}
                onClick={(e) => e.stopPropagation()}
            >

                <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-700">
                    <h2 className="text-2xl font-bold">{formTitle}</h2>
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}>
                        <X size={20} />
                    </button>
                </div>

                {/* رسالة الخطأ */}
                {submitError && (
                    <div className="mb-4 p-3 bg-red-800 text-white rounded-lg border border-red-600">
                        <p className="font-semibold">Error:</p>
                        <p className="text-sm">{submitError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* ... (حقول Title, Description, Live Demo, GitHub) ... */}

                    {/* حقل العنوان */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1">Project Title</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={projectData.title}
                            onChange={handleChange}
                            required
                            className={inputClasses}
                        />
                    </div>

                    {/* حقل الوصف */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            value={projectData.description}
                            onChange={handleChange}
                            rows="3"
                            required
                            className={inputClasses}
                        ></textarea>
                    </div>

                    {/* حقول الروابط */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="liveDemo" className="block text-sm font-medium mb-1">Live Demo URL</label>
                            <input
                                type="url"
                                name="liveDemo"
                                id="liveDemo"
                                value={projectData.liveDemo}
                                onChange={handleChange}
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label htmlFor="github" className="block text-sm font-medium mb-1">GitHub URL</label>
                            <input
                                type="url"
                                name="github"
                                id="github"
                                value={projectData.github}
                                onChange={handleChange}
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    {/* حقل التقنيات */}
                    <div>
                        <label htmlFor="technologies" className="block text-sm font-medium mb-1">Technologies (comma separated)</label>
                        <input
                            type="text"
                            name="technologies"
                            id="technologies"
                            value={projectData.technologies}
                            onChange={handleChange}
                            required
                            className={inputClasses}
                            placeholder="React, Tailwind CSS, Node.js"
                        />
                    </div>

                    {/* حقل رابط الصورة */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium mb-1">Project Image URL</label>
                        <input
                            type="url"
                            name="image"
                            id="image"
                            value={projectData.image}
                            onChange={handleChange}
                            className={inputClasses}
                            placeholder="https://example.com/project-image.jpg"
                        />
                    </div>

                    {/* خيار Featured */}
                    <div className="flex items-center">
                        <input
                            id="featured"
                            name="featured"
                            type="checkbox"
                            checked={projectData.featured}
                            onChange={handleChange}
                            className={`h-4 w-4 rounded text-purple-600 focus:ring-purple-500 ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300'}`}
                        />
                        <label htmlFor="featured" className="ml-2 block text-sm font-medium">
                            Feature this project (Show prominent highlight)
                        </label>
                    </div>


                    {/* زر الإرسال */}
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors duration-300 shadow-lg ${isSubmitting
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'btn-primary-gradient text-white'
                                }`}
                        >
                            {submitButtonIcon}
                            <span>{isSubmitting ? 'Processing...' : submitButtonText}</span>
                        </button>
                    </div>

                </form>
            </div >
        </div >
    );
}