import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Upload, User, Mail, Phone, MapPin, Calendar, Tag, MessageSquare, Linkedin, Twitter, Github } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', message: '',
    birthday: '', avatarUrl: '', tags: [],
    socialLinks: { linkedin: '', twitter: '', github: '' }
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const fetchContact = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${API_URL}/api/contacts`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const contact = res.data.find(c => c._id === id);
          if (contact) {
            setFormData({
              ...contact,
              birthday: contact.birthday ? new Date(contact.birthday).toISOString().split('T')[0] : '',
              socialLinks: contact.socialLinks || { linkedin: '', twitter: '', github: '' },
              tags: contact.tags || []
            });
          }
        } catch (error) {
          toast.error("Failed to fetch contact details");
        } finally {
          setLoading(false);
        }
      };
      fetchContact();
    }
  }, [id, API_URL, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const social = name.split('_')[1];
      setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [social]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (isEditing) {
        await axios.put(`${API_URL}/api/contacts/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Contact updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/contacts`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Contact added successfully!");
      }
      navigate('/contacts');
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred");
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link to="/contacts" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEditing ? 'Edit Contact' : 'Create New Contact'}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details to save to your network.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 group-hover:border-indigo-500 transition-colors">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="text-gray-400" size={32} />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="text-white" size={20} />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="John Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title / Notes</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input name="message" value={formData.message} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Software Engineer at Acme Corp" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Details */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Contact Info</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="john@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input required name="phone" value={formData.phone} onChange={(e) => { if (/^\d*$/.test(e.target.value)) handleChange(e) }} className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="9876543210" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input name="address" value={formData.address} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="123 Main St, City" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Birthday</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
          </div>

          {/* Social & Tags */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Social & Tags</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn Profile</label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input name="social_linkedin" value={formData.socialLinks.linkedin} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="linkedin.com/in/username" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter Username</label>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input name="social_twitter" value={formData.socialLinks.twitter} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="@username" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  value={tagInput} 
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="Type a tag and press Enter" 
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-lg">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-800 dark:hover:text-indigo-200">&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
          <Link to="/contacts" className="px-6 py-2.5 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            Cancel
          </Link>
          <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm">
            {isEditing ? 'Update Contact' : 'Save Contact'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactFormPage;
