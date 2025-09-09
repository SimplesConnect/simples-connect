import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload, X, Plus, User, Camera, Trash2, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Custom CSS for sliders
const sliderStyles = `
  .slider {
    background: linear-gradient(to right, #E5F3FF 0%, #3B82F6 0%, #E5F3FF 0%);
  }
  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(45deg, #3B82F6, #06B6D4);
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
  .slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(45deg, #3B82F6, #06B6D4);
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
`;

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryVideo, setGalleryVideo] = useState('');
  const [galleryUploading, setGalleryUploading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    birthdate: '',
    bio: '',
    profile_picture_url: '',
    interests: [],
    location: '',
    gender: '',
    looking_for: '',
    // Enhanced matching fields
    intentions: [],
    region_preference: [],
    vibe: '',
    life_phase: '',
    communication_style: [],
    emotional_availability: '',
    value_alignment_score: 5,
    timezone_overlap_score: 5
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileData) {
        const interests = Array.isArray(profileData.interests) 
          ? profileData.interests 
          : (typeof profileData.interests === 'string' 
              ? profileData.interests.split(',').map(i => i.trim()).filter(i => i) 
              : []);

        setFormData({
          full_name: profileData.full_name || '',
          birthdate: profileData.birthdate || '',
          bio: profileData.bio || '',
          profile_picture_url: profileData.profile_picture_url || '',
          interests: interests,
          location: profileData.location || '',
          gender: profileData.gender || '',
          looking_for: profileData.looking_for || '',
          // Enhanced matching fields
          intentions: profileData.intentions || [],
          region_preference: profileData.region_preference || [],
          vibe: profileData.vibe || '',
          life_phase: profileData.life_phase || '',
          communication_style: profileData.communication_style || [],
          emotional_availability: profileData.emotional_availability || '',
          value_alignment_score: profileData.value_alignment_score || 5,
          timezone_overlap_score: profileData.timezone_overlap_score || 5
        });

        // Set gallery data
        setGalleryImages(profileData.gallery_images || []);
        setGalleryVideo(profileData.gallery_video || '');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Validate required fields
      if (!formData.full_name.trim()) {
        throw new Error('Full name is required');
      }

      if (!formData.birthdate) {
        throw new Error('Date of birth is required');
      }

      // Validate age (must be 18+)
      const today = new Date();
      const birthDate = new Date(formData.birthdate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        throw new Error('You must be at least 18 years old to use this service');
      }

      if (age > 100) {
        throw new Error('Please enter a valid date of birth');
      }

      const requiredFields = ['full_name', 'birthdate', 'bio', 'gender', 'looking_for'];
      const hasRequiredFields = requiredFields.every(field => formData[field] && formData[field].toString().trim());
      const hasInterests = formData.interests && formData.interests.length > 0;
      
      // Enhanced matching validation (optional but recommended)
      const hasEnhancedFields = formData.intentions.length > 0 || formData.vibe || formData.life_phase || formData.emotional_availability;
      
      const isComplete = hasRequiredFields && hasInterests;
      const isEnhanced = isComplete && hasEnhancedFields;
      
      const updateData = {
        ...formData,
        gallery_images: galleryImages,
        gallery_video: galleryVideo,
        is_profile_complete: isComplete,
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert(
          { id: user.id, ...updateData },
          { onConflict: 'id' }
        );

      if (updateError) throw updateError;

      setSuccess(true);
      
      setTimeout(() => {
        navigate(`/profile/${user.id}`);
      }, 1500);

    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteOldProfilePicture = async (oldUrl) => {
    if (!oldUrl || oldUrl.includes('unsplash.com')) return; // Don't delete placeholder images
    
    try {
      // Extract the file path from the URL
      const urlParts = oldUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `images/${fileName}`;
      
      // Delete the old image from storage
      const { error: deleteError } = await supabase.storage
        .from('profiles')
        .remove([filePath]);
      
      if (deleteError) {
        console.warn('Failed to delete old profile picture:', deleteError);
      } else {
        console.log('Old profile picture deleted successfully');
      }
    } catch (err) {
      console.warn('Error deleting old profile picture:', err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError('Image file size must be less than 5MB');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Store old URL for cleanup
      const oldImageUrl = formData.profile_picture_url;
      
      // Create a unique filename with proper extension
      const fileExt = file.name.split('.').pop().toLowerCase();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `images/${fileName}`;
      
      // Upload to Supabase Storage in the profiles bucket, images folder
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      // Update form data with the new image URL
      setFormData(prev => ({
        ...prev,
        profile_picture_url: publicUrl
      }));

      // Clean up old image (don't await this to avoid blocking the UI)
      if (oldImageUrl) {
        deleteOldProfilePicture(oldImageUrl);
      }

      console.log('Image uploaded successfully:', publicUrl);
      
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Create a synthetic event object
      const syntheticEvent = {
        target: {
          files: files
        }
      };
      handleImageUpload(syntheticEvent);
    }
  };

  // Gallery upload functions
  const handleGalleryImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Check if adding these files would exceed the limit
    if (galleryImages.length + files.length > 3) {
      setError('You can only upload up to 3 images in your gallery');
      return;
    }

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload valid image files (JPEG, PNG, or WebP)');
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('Each image file must be less than 5MB');
        return;
      }
    }

    try {
      setGalleryUploading(true);
      setError(null);
      
      const uploadedUrls = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop().toLowerCase();
        const fileName = `${user.id}-gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `images/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('profiles')
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }
      
      setGalleryImages(prev => [...prev, ...uploadedUrls]);
      
    } catch (err) {
      console.error('Error uploading gallery images:', err);
      setError(err.message);
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleGalleryVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/mov', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid video file (MP4, WebM, OGG, or MOV)');
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Video file size must be less than 50MB');
      return;
    }

    try {
      setGalleryUploading(true);
      setError(null);
      
      // Delete old video if exists
      if (galleryVideo) {
        await deleteGalleryMedia(galleryVideo, 'videos');
      }
      
      const fileExt = file.name.split('.').pop().toLowerCase();
      const fileName = `${user.id}-video-${Date.now()}.${fileExt}`;
      const filePath = `videos/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      setGalleryVideo(urlData.publicUrl);
      
    } catch (err) {
      console.error('Error uploading gallery video:', err);
      setError(err.message);
    } finally {
      setGalleryUploading(false);
    }
  };

  const deleteGalleryMedia = async (url, folder) => {
    if (!url) return;
    
    try {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${folder}/${fileName}`;
      
      const { error: deleteError } = await supabase.storage
        .from('profiles')
        .remove([filePath]);
      
      if (deleteError) {
        console.warn('Failed to delete gallery media:', deleteError);
      }
    } catch (err) {
      console.warn('Error deleting gallery media:', err);
    }
  };

  const removeGalleryImage = async (imageUrl) => {
    await deleteGalleryMedia(imageUrl, 'images');
    setGalleryImages(prev => prev.filter(url => url !== imageUrl));
  };

  const removeGalleryVideo = async () => {
    if (galleryVideo) {
      await deleteGalleryMedia(galleryVideo, 'videos');
      setGalleryVideo('');
    }
  };

  // Helper functions for enhanced matching fields
  const toggleArrayItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item) 
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleSliderChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseInt(value)
    }));
  };

  // Enhanced matching options
  const intentionOptions = [
    { value: 'friendship', label: 'Friendship', description: 'Looking for genuine friendships and platonic connections' },
    { value: 'dating', label: 'Dating', description: 'Interested in romantic relationships and dating' },
    { value: 'networking', label: 'Networking', description: 'Professional connections and career opportunities' },
    { value: 'cultural_exchange', label: 'Cultural Exchange', description: 'Learning about different cultures and sharing yours' },
    { value: 'mentorship', label: 'Mentorship', description: 'Seeking guidance or offering mentorship to others' },
    { value: 'business_partnership', label: 'Business Partnership', description: 'Collaborative business opportunities and partnerships' },
    { value: 'travel_buddy', label: 'Travel Buddy', description: 'Finding companions for travel and adventures' },
    { value: 'activity_partner', label: 'Activity Partner', description: 'Partners for hobbies, sports, and activities' }
  ];

  const regionOptions = [
    { value: 'north_america', label: 'North America', description: 'USA, Canada, Mexico' },
    { value: 'europe', label: 'Europe', description: 'European countries and regions' },
    { value: 'middle_east', label: 'Middle East', description: 'Middle Eastern countries' },
    { value: 'australia', label: 'Australia & Oceania', description: 'Australia, New Zealand, Pacific Islands' },
    { value: 'asia', label: 'Asia', description: 'Asian countries and regions' },
    { value: 'africa', label: 'Africa', description: 'African countries and regions' },
    { value: 'south_america', label: 'South America', description: 'South American countries' }
  ];

  const vibeOptions = [
    { value: 'deep', label: 'Deep', description: 'Meaningful conversations and profound connections' },
    { value: 'light', label: 'Light', description: 'Fun, easygoing, and positive vibes' },
    { value: 'funny', label: 'Funny', description: 'Love to laugh and make others smile' },
    { value: 'intellectual', label: 'Intellectual', description: 'Enjoy stimulating discussions and learning' },
    { value: 'adventurous', label: 'Adventurous', description: 'Always up for new experiences' },
    { value: 'chill', label: 'Chill', description: 'Relaxed and go-with-the-flow attitude' },
    { value: 'quiet', label: 'Quiet', description: 'Thoughtful and introspective nature' },
    { value: 'creative', label: 'Creative', description: 'Artistic and imaginative approach to life' }
  ];

  const lifePhaseOptions = [
    { value: 'student', label: 'Student', description: 'Focusing on education and personal growth' },
    { value: 'new_parent', label: 'New Parent', description: 'Navigating the journey of parenthood' },
    { value: 'relocating', label: 'Relocating', description: 'Moving to a new place or settling in' },
    { value: 'hustle_season', label: 'Hustle Season', description: 'Building career and chasing goals' },
    { value: 'career_transition', label: 'Career Transition', description: 'Changing paths or advancing professionally' },
    { value: 'settling_down', label: 'Settling Down', description: 'Looking for stability and long-term plans' },
    { value: 'exploring', label: 'Exploring', description: 'Discovering new interests and possibilities' },
    { value: 'established', label: 'Established', description: 'Comfortable and looking to share experiences' }
  ];

  const communicationStyleOptions = [
    { value: 'text', label: 'Text Messages', description: 'Prefer written communication' },
    { value: 'voice', label: 'Voice Calls', description: 'Like talking over the phone' },
    { value: 'memes', label: 'Memes & Humor', description: 'Communicate through funny content' },
    { value: 'long_chats', label: 'Long Conversations', description: 'Enjoy deep, extended discussions' },
    { value: 'video_calls', label: 'Video Calls', description: 'Face-to-face virtual conversations' },
    { value: 'voice_notes', label: 'Voice Notes', description: 'Audio messages and voice recordings' },
    { value: 'emojis', label: 'Emojis & Visual', description: 'Express through emojis and images' },
    { value: 'formal', label: 'Formal Communication', description: 'Professional and structured conversation' }
  ];

  const emotionalAvailabilityOptions = [
    { value: 'guarded', label: 'Guarded', description: 'Taking time to open up and trust' },
    { value: 'open', label: 'Open', description: 'Ready for meaningful connections' },
    { value: 'healing', label: 'Healing', description: 'Working through personal growth' },
    { value: 'selective', label: 'Selective', description: 'Careful about who I connect with' },
    { value: 'ready', label: 'Ready', description: 'Fully available for new relationships' }
  ];

  if (loading && !formData.full_name) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-simples-cloud via-simples-silver to-simples-light">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <p className="text-xl text-simples-ocean font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-simples-cloud via-simples-silver to-simples-light">
      <style dangerouslySetInnerHTML={{ __html: sliderStyles }} />
      <div className="bg-white/80 backdrop-blur-sm border-b border-simples-silver/50 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-simples-ocean hover:text-simples-midnight transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          
          <h1 className="text-xl font-bold text-simples-midnight">Edit Profile</h1>
          
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-800">✅ Profile updated successfully! Redirecting...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-800">❌ {error}</p>
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Profile Picture</h2>
            
            <div 
              className={`border-2 border-dashed rounded-2xl p-6 transition-all ${
                isDragging 
                  ? 'border-simples-ocean bg-simples-ocean/5' 
                  : 'border-simples-silver hover:border-simples-ocean/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <img
                    src={formData.profile_picture_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=200&h=200&fit=crop&crop=face'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-simples-sky shadow-lg"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=200&h=200&fit=crop&crop=face';
                    }}
                  />
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-all">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={loading}
                    />
                  </label>
                  {loading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-semibold text-simples-midnight mb-2">Upload Your Photo</h3>
                  <p className="text-simples-storm text-sm mb-4">
                    {isDragging 
                      ? 'Drop your image here to upload!' 
                      : 'Choose a clear, recent photo that shows your face. You can drag & drop or click to browse.'
                    }
                  </p>
                  <div className="space-y-2 text-xs text-simples-storm mb-4">
                    <p>• Supported formats: JPEG, PNG, WebP</p>
                    <p>• Maximum file size: 5MB</p>
                    <p>• Recommended: Square photos work best</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="inline-flex items-center gap-2 bg-simples-silver hover:bg-simples-cloud text-simples-ocean px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors disabled:opacity-50">
                      <Upload className="w-4 h-4" />
                      {loading ? 'Uploading...' : 'Choose Photo'}
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={loading}
                      />
                    </label>
                    
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-simples-storm">
                        or drag & drop your image here
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Basic Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-simples-midnight mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full p-4 border border-simples-silver rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-simples-midnight mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthdate: e.target.value }))}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
                  className="w-full p-4 border border-simples-silver rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                  required
                />
                <p className="text-sm text-simples-storm mt-1">
                  You must be at least 18 years old to use this service
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-simples-midnight mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full p-4 border border-simples-silver rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="man">Man</option>
                  <option value="woman">Woman</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-simples-midnight mb-2">
                  Looking For *
                </label>
                <select
                  name="looking_for"
                  value={formData.looking_for}
                  onChange={(e) => setFormData(prev => ({ ...prev, looking_for: e.target.value }))}
                  className="w-full p-4 border border-simples-silver rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                  required
                >
                  <option value="">Select Preference</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="everyone">Everyone</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-simples-midnight mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country"
                  className="w-full p-4 border border-simples-silver rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">About You</h2>
            
            <div>
              <label className="block text-sm font-medium text-simples-midnight mb-2">
                Bio * <span className="text-simples-storm">(Tell people about yourself)</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={6}
                placeholder="Write something interesting about yourself..."
                className="w-full p-4 border border-simples-silver rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent resize-none"
                required
              />
              <p className="text-sm text-simples-storm mt-2">
                {formData.bio.length}/500 characters
              </p>
            </div>
          </div>

          {/* SECTION 1: WHAT YOU'RE LOOKING FOR */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">What You're Looking For</h2>
            
            {/* Intentions */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-simples-midnight mb-3">
                Intentions <span className="text-simples-storm text-sm font-normal">(Select all that apply)</span>
              </label>
              <p className="text-sm text-simples-storm mb-4">
                What type of connections are you seeking? This helps us match you with like-minded people.
              </p>
              
              <div className="grid md:grid-cols-2 gap-3">
                {intentionOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleArrayItem('intentions', option.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.intentions.includes(option.value)
                        ? 'border-simples-ocean bg-simples-ocean/10 text-simples-ocean'
                        : 'border-simples-silver hover:border-simples-ocean/50 text-simples-storm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                        formData.intentions.includes(option.value)
                          ? 'border-simples-ocean bg-simples-ocean'
                          : 'border-simples-silver'
                      }`}>
                        {formData.intentions.includes(option.value) && (
                          <X className="w-3 h-3 text-white transform rotate-45" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-simples-storm mt-1">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {formData.intentions.length > 0 && (
                <div className="mt-4 p-3 bg-simples-ocean/5 rounded-xl">
                  <p className="text-sm text-simples-ocean">
                    <strong>Selected:</strong> {formData.intentions.map(intent => 
                      intentionOptions.find(opt => opt.value === intent)?.label
                    ).join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Regional Preferences */}
            <div>
              <label className="block text-lg font-semibold text-simples-midnight mb-3">
                Regional Preferences <span className="text-simples-storm text-sm font-normal">(Optional)</span>
              </label>
              <p className="text-sm text-simples-storm mb-4">
                Which regions would you like to connect with? Great for diaspora connections and cultural exchange.
              </p>
              
              <div className="grid md:grid-cols-2 gap-3">
                {regionOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleArrayItem('region_preference', option.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      formData.region_preference.includes(option.value)
                        ? 'border-simples-tropical bg-simples-tropical/10 text-simples-tropical'
                        : 'border-simples-silver hover:border-simples-tropical/50 text-simples-storm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        formData.region_preference.includes(option.value)
                          ? 'border-simples-tropical bg-simples-tropical'
                          : 'border-simples-silver'
                      }`}>
                        {formData.region_preference.includes(option.value) && (
                          <X className="w-3 h-3 text-white transform rotate-45" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-simples-storm">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: PERSONALITY & LIFESTYLE */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Personality & Lifestyle</h2>
            
            {/* Your Vibe */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-simples-midnight mb-3">
                Your Vibe <span className="text-simples-storm text-sm font-normal">(Choose one)</span>
              </label>
              <p className="text-sm text-simples-storm mb-4">
                What's your general energy and approach to life? This helps match you with compatible personalities.
              </p>
              
              <div className="space-y-3">
                {vibeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, vibe: option.value }))}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      formData.vibe === option.value
                        ? 'border-simples-ocean bg-simples-ocean/10 text-simples-ocean'
                        : 'border-simples-silver hover:border-simples-ocean/50 text-simples-storm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.vibe === option.value
                          ? 'border-simples-ocean bg-simples-ocean'
                          : 'border-simples-silver'
                      }`}>
                        {formData.vibe === option.value && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-simples-storm">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Life Phase */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-simples-midnight mb-3">
                Life Phase <span className="text-simples-storm text-sm font-normal">(Choose one)</span>
              </label>
              <p className="text-sm text-simples-storm mb-4">
                Where are you in life right now? This helps match you with people in similar life stages.
              </p>
              
              <div className="space-y-3">
                {lifePhaseOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, life_phase: option.value }))}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      formData.life_phase === option.value
                        ? 'border-simples-lavender bg-simples-lavender/10 text-simples-lavender'
                        : 'border-simples-silver hover:border-simples-lavender/50 text-simples-storm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.life_phase === option.value
                          ? 'border-simples-lavender bg-simples-lavender'
                          : 'border-simples-silver'
                      }`}>
                        {formData.life_phase === option.value && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-simples-storm">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Communication Style */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-simples-midnight mb-3">
                Communication Style <span className="text-simples-storm text-sm font-normal">(Select all that apply)</span>
              </label>
              <p className="text-sm text-simples-storm mb-4">
                How do you prefer to communicate? This helps match you with people who share your communication preferences.
              </p>
              
              <div className="grid md:grid-cols-2 gap-3">
                {communicationStyleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleArrayItem('communication_style', option.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      formData.communication_style.includes(option.value)
                        ? 'border-simples-sky bg-simples-sky/10 text-simples-sky'
                        : 'border-simples-silver hover:border-simples-sky/50 text-simples-storm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        formData.communication_style.includes(option.value)
                          ? 'border-simples-sky bg-simples-sky'
                          : 'border-simples-silver'
                      }`}>
                        {formData.communication_style.includes(option.value) && (
                          <X className="w-3 h-3 text-white transform rotate-45" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-simples-storm">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Emotional Availability */}
            <div>
              <label className="block text-lg font-semibold text-simples-midnight mb-3">
                Emotional Availability <span className="text-simples-storm text-sm font-normal">(Choose one)</span>
              </label>
              <p className="text-sm text-simples-storm mb-4">
                How emotionally available are you for new connections? Be honest - this ensures better matches.
              </p>
              
              <div className="space-y-3">
                {emotionalAvailabilityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, emotional_availability: option.value }))}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      formData.emotional_availability === option.value
                        ? 'border-simples-rose bg-simples-rose/10 text-simples-rose'
                        : 'border-simples-silver hover:border-simples-rose/50 text-simples-storm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.emotional_availability === option.value
                          ? 'border-simples-rose bg-simples-rose'
                          : 'border-simples-silver'
                      }`}>
                        {formData.emotional_availability === option.value && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-simples-storm">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Interests *</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
                        setFormData(prev => ({
                          ...prev,
                          interests: [...prev.interests, newInterest.trim()]
                        }));
                        setNewInterest('');
                      }
                    }
                  }}
                  placeholder="Add an interest (e.g., Music, Travel, Cooking)"
                  className="flex-1 p-4 border border-simples-silver rounded-xl focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
                      setFormData(prev => ({
                        ...prev,
                        interests: [...prev.interests, newInterest.trim()]
                      }));
                      setNewInterest('');
                    }
                  }}
                  className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-6 py-4 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {formData.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-simples-ocean/10 to-simples-sky/10 text-simples-ocean px-4 py-2 rounded-full font-medium border border-simples-ocean/20 flex items-center gap-2"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        interests: prev.interests.filter((_, i) => i !== index)
                      }))}
                      className="text-simples-storm hover:text-simples-rose transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              
              {formData.interests.length === 0 && (
                <p className="text-simples-storm text-sm">
                  Add at least one interest to help others find you!
                </p>
              )}
            </div>
          </div>

          {/* Gallery Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Gallery</h2>
            <p className="text-simples-storm mb-6">
              Add up to 3 additional photos and 1 video to showcase more of yourself
            </p>
            
            {/* Gallery Images */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Photos ({galleryImages.length}/3)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {galleryImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-48 object-cover rounded-xl"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=400&h=300&fit=crop';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(imageUrl)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {galleryImages.length < 3 && (
                  <label className="border-2 border-dashed border-simples-silver hover:border-simples-ocean rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <ImageIcon className="w-12 h-12 text-simples-storm mb-2" />
                    <span className="text-simples-storm font-medium">
                      {galleryUploading ? 'Uploading...' : 'Add Photo'}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleGalleryImageUpload}
                      className="hidden"
                      disabled={galleryUploading}
                      multiple
                    />
                  </label>
                )}
              </div>
              
              <p className="text-sm text-simples-storm">
                Supported formats: JPEG, PNG, WebP • Max 5MB per image
              </p>
            </div>
            
            {/* Gallery Video */}
            <div>
              <h3 className="text-lg font-semibold text-simples-midnight mb-4 flex items-center gap-2">
                <VideoIcon className="w-5 h-5" />
                Video {galleryVideo && '(1/1)'}
              </h3>
              
              {galleryVideo ? (
                <div className="relative group">
                  <video
                    src={galleryVideo}
                    controls
                    className="w-full max-w-md h-64 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={removeGalleryVideo}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-simples-silver hover:border-simples-ocean rounded-xl h-64 max-w-md flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <VideoIcon className="w-12 h-12 text-simples-storm mb-2" />
                  <span className="text-simples-storm font-medium">
                    {galleryUploading ? 'Uploading...' : 'Add Video'}
                  </span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/mov,video/quicktime"
                    onChange={handleGalleryVideoUpload}
                    className="hidden"
                    disabled={galleryUploading}
                  />
                </label>
              )}
              
              <p className="text-sm text-simples-storm mt-2">
                Supported formats: MP4, WebM, OGG, MOV • Max 50MB
              </p>
            </div>
          </div>

          {/* SECTION 3: COMPATIBILITY SCORES */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Compatibility Scores</h2>
            <p className="text-simples-storm mb-6">
              These scores help fine-tune your matches based on your preferences and lifestyle.
            </p>
            
            {/* Value Alignment */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-simples-midnight mb-3">
                Value Alignment Importance
              </label>
              <p className="text-sm text-simples-storm mb-4">
                How important are shared values to you? (1 = Not important, 10 = Extremely important)
              </p>
              
              <div className="space-y-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.value_alignment_score}
                  onChange={(e) => handleSliderChange('value_alignment_score', e.target.value)}
                  className="w-full h-2 bg-simples-silver rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-simples-storm">
                  <span>1 - Not Important</span>
                  <span className="font-bold text-simples-ocean text-lg">{formData.value_alignment_score}</span>
                  <span>10 - Extremely Important</span>
                </div>
                <div className="p-3 bg-simples-ocean/5 rounded-xl">
                  <p className="text-sm text-simples-ocean">
                    <strong>Your setting:</strong> {
                      formData.value_alignment_score <= 3 ? 'Values matter less than other factors' :
                      formData.value_alignment_score <= 6 ? 'Values are somewhat important' :
                      formData.value_alignment_score <= 8 ? 'Values are very important' :
                      'Values are extremely important for compatibility'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Timezone Flexibility */}
            <div>
              <label className="block text-lg font-semibold text-simples-midnight mb-3">
                Timezone Flexibility
              </label>
              <p className="text-sm text-simples-storm mb-4">
                How flexible are you with different time zones? (1 = Need same timezone, 10 = Very flexible)
              </p>
              
              <div className="space-y-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.timezone_overlap_score}
                  onChange={(e) => handleSliderChange('timezone_overlap_score', e.target.value)}
                  className="w-full h-2 bg-simples-silver rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-simples-storm">
                  <span>1 - Same Timezone Only</span>
                  <span className="font-bold text-simples-tropical text-lg">{formData.timezone_overlap_score}</span>
                  <span>10 - Very Flexible</span>
                </div>
                <div className="p-3 bg-simples-tropical/5 rounded-xl">
                  <p className="text-sm text-simples-tropical">
                    <strong>Your setting:</strong> {
                      formData.timezone_overlap_score <= 3 ? 'Prefer people in similar timezones' :
                      formData.timezone_overlap_score <= 6 ? 'Moderately flexible with timezones' :
                      formData.timezone_overlap_score <= 8 ? 'Very flexible with timezones' :
                      'Timezone differences don\'t matter to me'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving Profile...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile; 