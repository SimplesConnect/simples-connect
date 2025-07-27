import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Ban, 
  UserX, 
  Shield, 
  RotateCcw, 
  Edit3, 
  MessageSquare, 
  Heart, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  UserPlus,
  ArrowLeft,
  Crown,
  ShieldCheck,
  UserCheck,
  Trash2,
  Unlock,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const UserManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [actionReason, setActionReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userStats, setUserStats] = useState({});

  // Admin access check
  useEffect(() => {
    const isAdmin = user?.email?.toLowerCase().trim() === 'presheja@gmail.com' || 
                   user?.email?.includes('presheja');
    
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    
    fetchUsers();
  }, [user, currentPage, searchTerm, statusFilter]);

  // Fetch users from database
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          profile_picture_url,
          bio,
          location,
          birthdate,
          gender,
          interests,
          looking_for,
          created_at,
          updated_at,
          is_profile_complete
        `)
        .order('created_at', { ascending: false });

      // Apply search filter
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      // Apply pagination
      const from = (currentPage - 1) * usersPerPage;
      const to = from + usersPerPage - 1;
      query = query.range(from, to);

      const { data: profilesData, error: profilesError, count } = await query;

      if (profilesError) throw profilesError;

      // Get user auth data
      const userIds = profilesData.map(p => p.id);
      
      // Get matches and messages count for each user
      const { data: matchesData } = await supabase
        .from('matches')
        .select('user1_id, user2_id')
        .or(`user1_id.in.(${userIds.join(',')}),user2_id.in.(${userIds.join(',')})`);

      const { data: messagesData } = await supabase
        .from('messages')
        .select('sender_id')
        .in('sender_id', userIds);

      // Calculate stats for each user
      const usersWithStats = profilesData.map(profile => {
        const userMatches = matchesData?.filter(m => 
          m.user1_id === profile.id || m.user2_id === profile.id
        ).length || 0;
        
        const userMessages = messagesData?.filter(m => 
          m.sender_id === profile.id
        ).length || 0;

        return {
          ...profile,
          matchesCount: userMatches,
          messagesCount: userMessages,
          accountStatus: 'active', // Default status
          lastActive: new Date(profile.updated_at || profile.created_at),
          joinDate: new Date(profile.created_at)
        };
      });

      setUsers(usersWithStats);
      setTotalUsers(count || usersWithStats.length);
      
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle user actions
  const handleUserAction = async (action, userId, reason = '') => {
    try {
      console.log(`Performing ${action} on user ${userId}`, { reason });
      
      // Here you would implement actual user management actions
      // For now, we'll just update the local state
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, accountStatus: action === 'suspend' ? 'suspended' : action === 'ban' ? 'banned' : 'active' }
          : u
      ));

      setShowActionModal(false);
      setActionReason('');
      
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.accountStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // User actions menu
  const UserActionsMenu = ({ user, onClose }) => (
    <div className="absolute right-0 top-8 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-48">
      <button
        onClick={() => { setSelectedUser(user); setShowUserModal(true); onClose(); }}
        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
      >
        <Eye className="w-4 h-4" />
        View Details
      </button>
      <button
        onClick={() => { setSelectedUser(user); setCurrentAction('edit'); setShowActionModal(true); onClose(); }}
        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
      >
        <Edit3 className="w-4 h-4" />
        Edit Profile
      </button>
      <hr className="my-1" />
      <button
        onClick={() => { setSelectedUser(user); setCurrentAction('suspend'); setShowActionModal(true); onClose(); }}
        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-orange-600 flex items-center gap-3"
      >
        <UserX className="w-4 h-4" />
        Suspend User
      </button>
      <button
        onClick={() => { setSelectedUser(user); setCurrentAction('ban'); setShowActionModal(true); onClose(); }}
        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600 flex items-center gap-3"
      >
        <Ban className="w-4 h-4" />
        Ban User
      </button>
      <button
        onClick={() => { setSelectedUser(user); setCurrentAction('promote'); setShowActionModal(true); onClose(); }}
        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-purple-600 flex items-center gap-3"
      >
        <Crown className="w-4 h-4" />
        Promote to Admin
      </button>
      <hr className="my-1" />
      <button
        onClick={() => { setSelectedUser(user); setCurrentAction('reset_password'); setShowActionModal(true); onClose(); }}
        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
      >
        <RotateCcw className="w-4 h-4" />
        Reset Password
      </button>
    </div>
  );

  // User row component
  const UserRow = ({ user }) => {
    const [showActions, setShowActions] = useState(false);
    
    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            {user.profile_picture_url ? (
              <img 
                src={user.profile_picture_url} 
                alt={user.full_name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user.full_name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            )}
            <div>
              <div className="font-semibold text-gray-900">{user.full_name || 'No name'}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            {user.accountStatus === 'active' && <CheckCircle className="w-4 h-4 text-green-500" />}
            {user.accountStatus === 'suspended' && <XCircle className="w-4 h-4 text-orange-500" />}
            {user.accountStatus === 'banned' && <Ban className="w-4 h-4 text-red-500" />}
            <span className={`text-sm font-medium ${
              user.accountStatus === 'active' ? 'text-green-700' :
              user.accountStatus === 'suspended' ? 'text-orange-700' :
              'text-red-700'
            }`}>
              {user.accountStatus}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          {user.joinDate.toLocaleDateString()}
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          {user.lastActive.toLocaleDateString()}
        </td>
        <td className="px-6 py-4">
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-pink-500" />
              <span>{user.matchesCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span>{user.messagesCount}</span>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showActions && (
              <UserActionsMenu 
                user={user} 
                onClose={() => setShowActions(false)} 
              />
            )}
          </div>
        </td>
      </tr>
    );
  };

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
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-500">Manage and monitor all platform users</p>
              </div>
            </div>
            <button
              onClick={() => {/* Add new user functionality */}}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
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
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
          <button
            onClick={fetchUsers}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map(user => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalUsers > usersPerPage && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * usersPerPage >= totalUsers}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">User Details</h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-6 mb-6">
                {selectedUser.profile_picture_url ? (
                  <img 
                    src={selectedUser.profile_picture_url} 
                    alt={selectedUser.full_name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {selectedUser.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.full_name || 'No name'}</h3>
                  <p className="text-gray-500 mb-2">{selectedUser.email}</p>
                  <div className="flex items-center gap-2">
                    {selectedUser.accountStatus === 'active' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {selectedUser.accountStatus === 'suspended' && <XCircle className="w-4 h-4 text-orange-500" />}
                    {selectedUser.accountStatus === 'banned' && <Ban className="w-4 h-4 text-red-500" />}
                    <span className={`text-sm font-medium ${
                      selectedUser.accountStatus === 'active' ? 'text-green-700' :
                      selectedUser.accountStatus === 'suspended' ? 'text-orange-700' :
                      'text-red-700'
                    }`}>
                      {selectedUser.accountStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Joined {selectedUser.joinDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Last active {selectedUser.lastActive.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span className="text-sm">{selectedUser.matchesCount} matches</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">{selectedUser.messagesCount} messages</span>
                </div>
              </div>

              {selectedUser.bio && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Bio</h4>
                  <p className="text-gray-700">{selectedUser.bio}</p>
                </div>
              )}

              {selectedUser.location && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </h4>
                  <p className="text-gray-700">{selectedUser.location}</p>
                </div>
              )}

              {selectedUser.interests && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedUser.interests) ? selectedUser.interests : selectedUser.interests.split(',')).map((interest, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {interest.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                {currentAction === 'suspend' && 'Suspend User'}
                {currentAction === 'ban' && 'Ban User'}
                {currentAction === 'promote' && 'Promote User'}
                {currentAction === 'reset_password' && 'Reset Password'}
                {currentAction === 'edit' && 'Edit User'}
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to {currentAction} {selectedUser.full_name}?
              </p>
              
              {(currentAction === 'suspend' || currentAction === 'ban') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason (required)
                  </label>
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Provide a reason for this action..."
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUserAction(currentAction, selectedUser.id, actionReason)}
                  disabled={(currentAction === 'suspend' || currentAction === 'ban') && !actionReason.trim()}
                  className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    currentAction === 'ban' ? 'bg-red-600 hover:bg-red-700' :
                    currentAction === 'suspend' ? 'bg-orange-600 hover:bg-orange-700' :
                    'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 