import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Play,
  Plus,
  Star,
  Calendar,
  ExternalLink,
  Mail,
  Phone,
  Building,
  Users,
  DollarSign,
  FileText,
  Youtube,
  Settings,
  BarChart3,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Edit3,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const ContentModeration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'content'
  
  // Advertiser requests state
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState(null); // 'approve' or 'reject'
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Featured content state
  const [featuredContent, setFeaturedContent] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [contentFormData, setContentFormData] = useState({
    advertiser_request_id: '',
    title: '',
    description: '',
    youtube_url: '',
    start_date: '',
    end_date: ''
  });
  
  // Stats
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    activeContent: 0
  });

  // Admin access check
  useEffect(() => {
    const isAdmin = user?.email?.toLowerCase().trim() === 'presheja@gmail.com' || 
                   user?.email?.includes('presheja');
    
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    
    fetchData();
  }, [user]);

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchAdvertiserRequests(),
      fetchFeaturedContent(),
      fetchStats()
    ]);
    setLoading(false);
  };

  // Fetch advertiser requests
  const fetchAdvertiserRequests = async () => {
    try {
      setRequestsLoading(true);
      console.log('🔍 Fetching advertiser requests...');
      
      let query = supabase
        .from('advertiser_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchTerm) {
        query = query.or(`business_name.ilike.%${searchTerm}%,contact_person.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setRequests(data || []);
      console.log(`✅ Loaded ${data?.length || 0} advertiser requests`);
      
    } catch (error) {
      console.error('❌ Error fetching advertiser requests:', error);
      setRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  };

  // Fetch featured content
  const fetchFeaturedContent = async () => {
    try {
      setContentLoading(true);
      console.log('🔍 Fetching featured content...');
      
      const { data, error } = await supabase
        .from('featured_content')
        .select(`
          *,
          advertiser_requests!inner(
            business_name,
            contact_person,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setFeaturedContent(data || []);
      console.log(`✅ Loaded ${data?.length || 0} featured content items`);
      
    } catch (error) {
      console.error('❌ Error fetching featured content:', error);
      setFeaturedContent([]);
    } finally {
      setContentLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const [requestsResult, contentResult] = await Promise.all([
        supabase.from('advertiser_requests').select('status'),
        supabase.from('featured_content').select('is_active')
      ]);

      if (requestsResult.data) {
        const requests = requestsResult.data;
        setStats({
          totalRequests: requests.length,
          pendingRequests: requests.filter(r => r.status === 'pending').length,
          approvedRequests: requests.filter(r => r.status === 'approved').length,
          rejectedRequests: requests.filter(r => r.status === 'rejected').length,
          activeContent: contentResult.data?.filter(c => c.is_active).length || 0
        });
      }
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
    }
  };

  // Handle request approval/rejection
  const handleRequestAction = async (action, requestId, reason = '') => {
    try {
      console.log(`🔄 ${action}ing request ${requestId}`);
      
      const updateData = {
        status: action,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString()
      };

      if (action === 'rejected' && reason) {
        updateData.rejection_reason = reason;
      }

      const { error } = await supabase
        .from('advertiser_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      // Log admin action
      await supabase
        .from('admin_audit_logs')
        .insert({
          admin_id: user.id,
          action: `${action}_advertiser_request`,
          target_user_id: null,
          details: { requestId, reason },
          timestamp: new Date().toISOString()
        });

      alert(`✅ Request ${action}d successfully!`);
      
      // Refresh data
      await fetchData();
      setShowApprovalModal(false);
      setRejectionReason('');
      
    } catch (error) {
      console.error(`❌ Error ${action}ing request:`, error);
      alert(`Failed to ${action} request: ${error.message}`);
    }
  };

  // Add featured content
  const handleAddContent = async (formData) => {
    try {
      console.log('🔄 Adding featured content:', formData);
      
      // Extract YouTube video ID from URL
      const extractYouTubeId = (url) => {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
        const match = url.match(regex);
        return match ? match[1] : url;
      };

      const videoId = extractYouTubeId(formData.youtube_url);
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      const { error } = await supabase
        .from('featured_content')
        .insert({
          advertiser_request_id: formData.advertiser_request_id,
          title: formData.title,
          description: formData.description,
          youtube_video_id: videoId,
          youtube_url: formData.youtube_url,
          thumbnail_url: thumbnailUrl,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          created_by: user.id
        });

      if (error) throw error;

      // Log admin action
      await supabase
        .from('admin_audit_logs')
        .insert({
          admin_id: user.id,
          action: 'add_featured_content',
          target_user_id: null,
          details: { videoId, title: formData.title },
          timestamp: new Date().toISOString()
        });

      alert('✅ Featured content added successfully!');
      
      // Reset form and refresh data
      setContentFormData({
        advertiser_request_id: '',
        title: '',
        description: '',
        youtube_url: '',
        start_date: '',
        end_date: ''
      });
      setShowAddContentModal(false);
      await fetchData();
      
    } catch (error) {
      console.error('❌ Error adding featured content:', error);
      alert(`Failed to add content: ${error.message}`);
    }
  };

  // Toggle featured content active status
  const toggleContentActive = async (contentId, isActive) => {
    try {
      const { error } = await supabase
        .from('featured_content')
        .update({ is_active: !isActive })
        .eq('id', contentId);

      if (error) throw error;

      alert(`✅ Content ${!isActive ? 'activated' : 'deactivated'} successfully!`);
      await fetchFeaturedContent();
      
    } catch (error) {
      console.error('❌ Error toggling content status:', error);
      alert(`Failed to update content: ${error.message}`);
    }
  };

  // Delete featured content
  const deleteContent = async (contentId) => {
    if (!confirm('Are you sure you want to delete this featured content?')) return;
    
    try {
      const { error } = await supabase
        .from('featured_content')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      alert('✅ Featured content deleted successfully!');
      await fetchFeaturedContent();
      
    } catch (error) {
      console.error('❌ Error deleting content:', error);
      alert(`Failed to delete content: ${error.message}`);
    }
  };

  // Get status badge component
  const StatusBadge = ({ status }) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      review: 'bg-blue-100 text-blue-800'
    };

    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
      review: AlertCircle
    };

    const Icon = icons[status];

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Filter requests based on search and status
  const filteredRequests = requests.filter(request => {
    const matchesSearch = !searchTerm || 
      request.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content moderation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
                <p className="text-gray-500">Manage advertiser requests and featured content</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Requests</p>
                <p className="text-xl font-bold">{stats.totalRequests}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-xl font-bold">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Approved</p>
                <p className="text-xl font-bold">{stats.approvedRequests}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Rejected</p>
                <p className="text-xl font-bold">{stats.rejectedRequests}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Play className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Content</p>
                <p className="text-xl font-bold">{stats.activeContent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Advertiser Requests
                </div>
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Youtube className="w-4 h-4" />
                  Featured Content
                </div>
              </button>
            </nav>
          </div>

          {/* SECTION 1: Advertiser Requests */}
          {activeTab === 'requests' && (
            <div className="p-6">
              {/* Filters */}
              <div className="flex gap-4 items-center mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="review">Under Review</option>
                </select>
              </div>

              {/* Requests Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Content Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requestsLoading ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                            Loading requests...
                          </div>
                        </td>
                      </tr>
                    ) : filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          No advertiser requests found
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-semibold text-gray-900">{request.business_name}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {request.business_description}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">{request.contact_person}</div>
                              <div className="text-sm text-gray-500">{request.email}</div>
                              {request.phone && (
                                <div className="text-sm text-gray-500">{request.phone}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {request.content_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {request.budget_range || 'Not specified'}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={request.status} />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(request.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowRequestModal(true);
                                }}
                                className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {request.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedRequest(request);
                                      setApprovalAction('approved');
                                      setShowApprovalModal(true);
                                    }}
                                    className="p-1 text-green-600 hover:text-green-800 transition-colors"
                                    title="Approve"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedRequest(request);
                                      setApprovalAction('rejected');
                                      setShowApprovalModal(true);
                                    }}
                                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                    title="Reject"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 2: Featured Content */}
          {activeTab === 'content' && (
            <div className="p-6">
              {/* Add Content Button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Featured Content Management</h2>
                <button
                  onClick={() => setShowAddContentModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Featured Content
                </button>
              </div>

              {/* Featured Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentLoading ? (
                  <div className="col-span-full flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                    Loading featured content...
                  </div>
                ) : featuredContent.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No featured content found
                  </div>
                ) : (
                  featuredContent.map((content) => (
                    <div key={content.id} className="bg-white rounded-lg shadow overflow-hidden">
                      {/* Video Thumbnail */}
                      <div className="relative">
                        <img
                          src={content.thumbnail_url}
                          alt={content.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setPreviewVideo(content);
                              setShowPreviewModal(true);
                            }}
                            className="bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors"
                          >
                            <Play className="w-4 h-4" />
                            Preview
                          </button>
                        </div>
                        {content.is_active && (
                          <div className="absolute top-2 right-2">
                            <span className="bg-green-500 text-white px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Active
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{content.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{content.description}</p>
                        
                        <div className="text-xs text-gray-500 mb-3">
                          <div>Advertiser: {content.advertiser_requests.business_name}</div>
                          <div>Added: {new Date(content.created_at).toLocaleDateString()}</div>
                          {content.start_date && (
                            <div>Runs: {new Date(content.start_date).toLocaleDateString()} - {content.end_date ? new Date(content.end_date).toLocaleDateString() : 'Ongoing'}</div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleContentActive(content.id, content.is_active)}
                              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                                content.is_active
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {content.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <a
                              href={content.youtube_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                              title="View on YouTube"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => deleteContent(content.id)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {showRequestModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Request Details</h2>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Business Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Business Name</label>
                        <p className="text-gray-900">{selectedRequest.business_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Contact Person</label>
                        <p className="text-gray-900">{selectedRequest.contact_person}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{selectedRequest.email}</p>
                      </div>
                      {selectedRequest.phone && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p className="text-gray-900">{selectedRequest.phone}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-500">Business Description</label>
                      <p className="text-gray-900">{selectedRequest.business_description}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Target Audience & Budget
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Target Audience</label>
                        <p className="text-gray-900">{selectedRequest.target_audience || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Budget Range</label>
                        <p className="text-gray-900">{selectedRequest.budget_range || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Content Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Content Type</label>
                        <p className="text-gray-900">{selectedRequest.content_type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <StatusBadge status={selectedRequest.status} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Content Description</label>
                      <p className="text-gray-900">{selectedRequest.content_description || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {selectedRequest.website_url && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Website
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <a
                        href={selectedRequest.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {selectedRequest.website_url}
                      </a>
                    </div>
                  </div>
                )}

                {selectedRequest.additional_notes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900">{selectedRequest.additional_notes}</p>
                    </div>
                  </div>
                )}

                {selectedRequest.status === 'rejected' && selectedRequest.rejection_reason && (
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Rejection Reason</h3>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-red-900">{selectedRequest.rejection_reason}</p>
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-500 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Submitted: {new Date(selectedRequest.created_at).toLocaleString()}</span>
                    {selectedRequest.reviewed_at && (
                      <span>Reviewed: {new Date(selectedRequest.reviewed_at).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval/Rejection Modal */}
      {showApprovalModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                {approvalAction === 'approved' ? 'Approve Request' : 'Reject Request'}
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to {approvalAction === 'approved' ? 'approve' : 'reject'} the request from {selectedRequest.business_name}?
              </p>
              
              {approvalAction === 'rejected' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for rejection (required)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Provide a clear reason for rejection..."
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRequestAction(approvalAction, selectedRequest.id, rejectionReason)}
                  disabled={approvalAction === 'rejected' && !rejectionReason.trim()}
                  className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    approvalAction === 'approved' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {approvalAction === 'approved' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Content Modal */}
      {showAddContentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Add Featured Content</h2>
                <button
                  onClick={() => setShowAddContentModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAddContent(contentFormData);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Approved Advertiser *
                    </label>
                    <select
                      value={contentFormData.advertiser_request_id}
                      onChange={(e) => setContentFormData({...contentFormData, advertiser_request_id: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select an approved advertiser...</option>
                      {requests
                        .filter(r => r.status === 'approved')
                        .map(request => (
                          <option key={request.id} value={request.id}>
                            {request.business_name} - {request.contact_person}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Title *
                    </label>
                    <input
                      type="text"
                      value={contentFormData.title}
                      onChange={(e) => setContentFormData({...contentFormData, title: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter video title..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={contentFormData.description}
                      onChange={(e) => setContentFormData({...contentFormData, description: e.target.value})}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter video description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube URL *
                    </label>
                    <input
                      type="url"
                      value={contentFormData.youtube_url}
                      onChange={(e) => setContentFormData({...contentFormData, youtube_url: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={contentFormData.start_date}
                        onChange={(e) => setContentFormData({...contentFormData, start_date: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={contentFormData.end_date}
                        onChange={(e) => setContentFormData({...contentFormData, end_date: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddContentModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Content
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {showPreviewModal && previewVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold">{previewVideo.title}</h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${previewVideo.youtube_video_id}`}
                title={previewVideo.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 bg-gray-50">
              <p className="text-gray-700">{previewVideo.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                Advertiser: {previewVideo.advertiser_requests?.business_name}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentModeration; 