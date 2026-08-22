import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { AlertCircle, User, Phone, MapPin, Briefcase, Mail, CheckCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfileState } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', profilePicture: '' });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/profiles/me');
      if (res.data.success) {
        setProfile(res.data.profile);
        setFormData({
          name: res.data.profile.name || '',
          phone: res.data.profile.phone || '',
          address: res.data.profile.address || '',
          profilePicture: res.data.profile.profile_picture || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.put('/profiles/me', formData);
      if (res.data.success) {
        setProfile(res.data.profile);
        // Sync context state
        updateProfileState(res.data.profile);
        setSuccess('Profile updated successfully!');
        setEditMode(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-8 w-8 text-brand-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-[13px] font-semibold text-rose-600 rounded-[10px] flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-[13px] font-semibold text-emerald-600 rounded-[10px] flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Profile Details */}
      <Card 
        title="Personal Profile" 
        subtitle="Manage your personal details and contact info"
        actions={
          !editMode ? (
            <Button variant="primary" size="sm" onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm" onClick={() => { setEditMode(false); setError(''); }}>
                Cancel
              </Button>
            </div>
          )
        }
      >
        {!editMode ? (
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="flex items-center space-x-4">
              <div className="h-[60px] w-[60px] rounded-base bg-paper-surface border-2 border-border shadow-shadow flex items-center justify-center text-paper-text font-extrabold text-[22px] transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]">
                {profile?.name ? profile.name.split(' ').map(n=>n[0]).join('').toUpperCase() : 'U'}
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-paper-text">{profile?.name}</h2>
                <div className="flex items-center space-x-2 text-[13px] text-paper-muted mt-1 font-semibold">
                  <Briefcase className="h-[14px] w-[14px]" />
                  <span>{profile?.job_title || 'Unassigned'} — {profile?.department || 'No Department'}</span>
                </div>
              </div>
            </div>

            <hr className="border-white/40" />

            {/* Read-Only Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px]">
              <div className="flex items-start space-x-3 text-paper-text">
                <Mail className="h-[18px] w-[18px] text-paper-muted shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-paper-muted block uppercase tracking-widest">Email Address</span>
                  <span className="font-bold">{profile?.email}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-paper-text">
                <Phone className="h-[18px] w-[18px] text-paper-muted shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-paper-muted block uppercase tracking-widest">Contact Number</span>
                  <span className="font-bold">{profile?.phone || 'Not provided'}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-paper-text">
                <MapPin className="h-[18px] w-[18px] text-paper-muted shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-paper-muted block uppercase tracking-widest">Home Address</span>
                  <span className="font-bold">{profile?.address || 'Not provided'}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-paper-text">
                <User className="h-[18px] w-[18px] text-paper-muted shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-paper-muted block uppercase tracking-widest">Employee Code</span>
                  <span className="font-bold">#{profile?.employee_id}</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Contact Number"
              name="phone"
              placeholder="+1 555-0101"
              value={formData.phone}
              onChange={handleChange}
            />
            <Input
              label="Home Address"
              name="address"
              placeholder="123 Street Name, City, Country"
              value={formData.address}
              onChange={handleChange}
            />
            <Button
              type="submit"
              variant="primary"
              loading={saveLoading}
              className="px-6 py-2.5 mt-2"
            >
              Save Changes
            </Button>
          </form>
        )}
      </Card>

    </div>
  );
};

export default ProfilePage;
