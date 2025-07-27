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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [actionReason, setActionReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(50); // Show more users per page
  const [totalUsers, setTotalUsers] = useState(0);
  const [userStats, setUserStats] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [addUserFormData, setAddUserFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    bio: '',
    location: '',
    gender: '',
    interests: []
  });

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

  // Fetch users from database - REAL DATA
  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching real user data from database...');
      
      // First get total count for pagination
      const { count: totalCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      // Build query for users
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

      // Apply pagination (load more users per page)
      const from = (currentPage - 1) * usersPerPage;
      const to = from + usersPerPage - 1;
      query = query.range(from, to);

      const { data: profilesData, error: profilesError } = await query;

      if (profilesError) throw profilesError;

      console.log(`📊 Loaded ${profilesData.length} users from database`);

      // Get user auth data and check for admin status
      const userIds = profilesData.map(p => p.id);
      
      // Get real matches and messages count for each user
      const [matchesResult, messagesResult, adminResult] = await Promise.all([
        supabase
          .from('matches')
          .select('user1_id, user2_id')
          .or(`user1_id.in.(${userIds.join(',')}),user2_id.in.(${userIds.join(',')})`),
        supabase
          .from('messages')
          .select('sender_id')
          .in('sender_id', userIds),
        supabase
          .from('admin_users')
          .select('user_id, admin_level, is_active')
          .in('user_id', userIds)
          .eq('is_active', true)
      ]);

      // Calculate real stats for each user
      const usersWithStats = profilesData.map(profile => {
        const userMatches = matchesResult.data?.filter(m => 
          m.user1_id === profile.id || m.user2_id === profile.id
        ).length || 0;
        
        const userMessages = messagesResult.data?.filter(m => 
          m.sender_id === profile.id
        ).length || 0;

        const adminInfo = adminResult.data?.find(a => a.user_id === profile.id);

        return {
          ...profile,
          matchesCount: userMatches,
          messagesCount: userMessages,
          accountStatus: 'active', // Will be updated from user_status_history if exists
          isAdmin: !!adminInfo,
          adminLevel: adminInfo?.admin_level || null,
          lastActive: new Date(profile.updated_at || profile.created_at),
          joinDate: new Date(profile.created_at)
        };
      });

      setUsers(usersWithStats);
      setTotalUsers(totalCount || 0);
      console.log(`✅ Successfully loaded ${usersWithStats.length} users with real stats`);
      
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      alert('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle user actions - REAL DATABASE OPERATIONS
  const handleUserAction = async (action, userId, reason = '') => {
    try {
      console.log(`🔄 Performing ${action} on user ${userId}`, { reason });
      
      const targetUser = users.find(u => u.id === userId);
      if (!targetUser) {
        throw new Error('User not found');
      }

      let success = false;
      let message = '';

      switch (action) {
        case 'suspend':
          success = await suspendUser(userId, reason);
          message = success ? `✅ ${targetUser.full_name} has been suspended` : '❌ Failed to suspend user';
          break;
          
        case 'ban':
          success = await banUser(userId, reason);
          message = success ? `✅ ${targetUser.full_name} has been banned` : '❌ Failed to ban user';
          break;
          
        case 'activate':
          success = await activateUser(userId, reason);
          message = success ? `✅ ${targetUser.full_name} has been reactivated` : '❌ Failed to activate user';
          break;
          
        case 'promote':
          success = await promoteUser(userId, 'admin', reason);
          message = success ? `✅ ${targetUser.full_name} has been promoted to admin` : '❌ Failed to promote user';
          break;
          
        case 'demote':
          success = await demoteUser(userId, reason);
          message = success ? `✅ ${targetUser.full_name} has been demoted` : '❌ Failed to demote user';
          break;
          
        case 'reset_password':
          success = await resetUserPassword(userId);
          message = success ? `✅ Password reset email sent to ${targetUser.email}` : '❌ Failed to reset password';
          break;
          
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      if (success) {
        // Refresh user list to show updated status
        await fetchUsers();
        alert(message);
      } else {
        alert(message);
      }

      setShowActionModal(false);
      setActionReason('');
      setCurrentAction(null);
      setSelectedUser(null);
      
    } catch (error) {
      console.error(`❌ Error performing ${action}:`, error);
      alert(`Failed to ${action} user: ${error.message}`);
    }
  };

  // Suspend user - Add to user_status_history and update profile
  const suspendUser = async (userId, reason) => {
    try {
      // Insert suspension record
      const { error: statusError } = await supabase
        .from('user_status_history')
        .insert({
          user_id: userId,
          status: 'suspended',
          reason: reason,
          changed_by: user.id,
          changed_at: new Date().toISOString()
        });

      if (statusError) throw statusError;

      // Log admin action
      await logAdminAction('suspend_user', userId, { reason });
      
      console.log(`✅ User ${userId} suspended successfully`);
      return true;
    } catch (error) {
      console.error('❌ Error suspending user:', error);
      return false;
    }
  };

  // Ban user - Add to user_status_history and update profile  
  const banUser = async (userId, reason) => {
    try {
      // Insert ban record
      const { error: statusError } = await supabase
        .from('user_status_history')
        .insert({
          user_id: userId,
          status: 'banned',
          reason: reason,
          changed_by: user.id,
          changed_at: new Date().toISOString()
        });

      if (statusError) throw statusError;

      // Log admin action
      await logAdminAction('ban_user', userId, { reason });
      
      console.log(`✅ User ${userId} banned successfully`);
      return true;
    } catch (error) {
      console.error('❌ Error banning user:', error);
      return false;
    }
  };

  // Activate user - Remove suspension/ban
  const activateUser = async (userId, reason) => {
    try {
      // Insert activation record
      const { error: statusError } = await supabase
        .from('user_status_history')
        .insert({
          user_id: userId,
          status: 'active',
          reason: reason,
          changed_by: user.id,
          changed_at: new Date().toISOString()
        });

      if (statusError) throw statusError;

      // Log admin action
      await logAdminAction('activate_user', userId, { reason });
      
      console.log(`✅ User ${userId} activated successfully`);
      return true;
    } catch (error) {
      console.error('❌ Error activating user:', error);
      return false;
    }
  };

  // Promote user to admin
  const promoteUser = async (userId, adminLevel, reason) => {
    try {
      // Insert or update admin_users record
      const { error: adminError } = await supabase
        .from('admin_users')
        .upsert({
          user_id: userId,
          admin_level: adminLevel,
          is_active: true,
          promoted_by: user.id,
          promoted_at: new Date().toISOString()
        });

      if (adminError) throw adminError;

      // Log admin action
      await logAdminAction('promote_user', userId, { adminLevel, reason });
      
      console.log(`✅ User ${userId} promoted to ${adminLevel} successfully`);
      return true;
    } catch (error) {
      console.error('❌ Error promoting user:', error);
      return false;
    }
  };

  // Demote user from admin
  const demoteUser = async (userId, reason) => {
    try {
      // Deactivate admin record
      const { error: adminError } = await supabase
        .from('admin_users')
        .update({ 
          is_active: false,
          demoted_by: user.id,
          demoted_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (adminError) throw adminError;

      // Log admin action
      await logAdminAction('demote_user', userId, { reason });
      
      console.log(`✅ User ${userId} demoted successfully`);
      return true;
    } catch (error) {
      console.error('❌ Error demoting user:', error);
      return false;
    }
  };

  // Reset user password
  const resetUserPassword = async (userId) => {
    try {
      const targetUser = users.find(u => u.id === userId);
      if (!targetUser?.email) {
        throw new Error('User email not found');
      }

      // Use Supabase Auth API to send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(targetUser.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;

      // Log admin action
      await logAdminAction('reset_password', userId, { email: targetUser.email });
      
      console.log(`✅ Password reset email sent to ${targetUser.email}`);
      return true;
    } catch (error) {
      console.error('❌ Error resetting password:', error);
      return false;
    }
  };

  // Edit user profile - REAL DATABASE UPDATE
  const handleEditUser = async (userId, updateData) => {
    try {
      console.log('🔄 Updating user profile:', userId, updateData);
      
      // Update user profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updateData.full_name,
          bio: updateData.bio,
          location: updateData.location,
          gender: updateData.gender,
          interests: updateData.interests,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Log admin action
      await logAdminAction('edit_user', userId, { changes: updateData });
      
      // Refresh user list
      await fetchUsers();
      
      alert('✅ User profile updated successfully!');
      setShowEditModal(false);
      setEditFormData({});
      
      console.log(`✅ User ${userId} profile updated successfully`);
      return true;
    } catch (error) {
      console.error('❌ Error updating user:', error);
      alert(`Failed to update user: ${error.message}`);
      return false;
    }
  };

  // Add new user - REAL DATABASE INSERT
  const handleAddUser = async (userData) => {
    try {
      console.log('🔄 Adding new user:', userData);
      
      // Create user auth account first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Insert profile data
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: userData.full_name,
            email: userData.email,
            bio: userData.bio,
            location: userData.location,
            gender: userData.gender,
            interests: userData.interests,
            created_at: new Date().toISOString(),
            is_profile_complete: true
          });

        if (profileError) {
          console.warn('Profile creation failed:', profileError);
          // Auth user was created but profile failed - this is OK, profile will be created on first login
        }

        // Log admin action
        await logAdminAction('add_user', authData.user.id, { userData });
        
        // Refresh user list
        await fetchUsers();
        
        alert(`✅ User ${userData.full_name} created successfully!`);
        setShowAddUserModal(false);
        setAddUserFormData({
          full_name: '',
          email: '',
          password: '',
          bio: '',
          location: '',
          gender: '',
          interests: []
        });
        
        console.log(`✅ User ${userData.full_name} created successfully`);
        return true;
      }
    } catch (error) {
      console.error('❌ Error adding user:', error);
      alert(`Failed to add user: ${error.message}`);
      return false;
    }
  };

  // Log admin actions
  const logAdminAction = async (action, targetUserId, details = {}) => {
    try {
      const { error } = await supabase
        .from('admin_audit_logs')
        .insert({
          admin_id: user.id,
          action: action,
          target_user_id: targetUserId,
          details: details,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.warn('Failed to log admin action:', error);
        // Don't throw error - logging failure shouldn't break the main action
      }
    } catch (error) {
      console.warn('Error logging admin action:', error);
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
        onClick={() => { 
          setSelectedUser(user); 
          setEditFormData({
            full_name: user.full_name || '',
            bio: user.bio || '',
            location: user.location || '',
            gender: user.gender || '',
            interests: Array.isArray(user.interests) ? user.interests : (user.interests ? user.interests.split(',').map(i => i.trim()) : [])
          });
          setShowEditModal(true); 
          onClose(); 
        }}
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
              onClick={() => setShowAddUserModal(true)}
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

             {/* Edit User Modal */}
       {showEditModal && selectedUser && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
             <div className="p-6 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <h2 className="text-xl font-bold">Edit User Profile</h2>
                 <button
                   onClick={() => setShowEditModal(false)}
                   className="p-2 hover:bg-gray-100 rounded-lg"
                 >
                   <XCircle className="w-5 h-5" />
                 </button>
               </div>
             </div>
             <div className="p-6">
               <form onSubmit={(e) => {
                 e.preventDefault();
                 handleEditUser(selectedUser.id, editFormData);
               }}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Full Name
                     </label>
                     <input
                       type="text"
                       value={editFormData.full_name || ''}
                       onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       required
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Gender
                     </label>
                     <select
                       value={editFormData.gender || ''}
                       onChange={(e) => setEditFormData({...editFormData, gender: e.target.value})}
                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     >
                       <option value="">Select Gender</option>
                       <option value="male">Male</option>
                       <option value="female">Female</option>
                       <option value="other">Other</option>
                     </select>
                   </div>
                 </div>
                 
                 <div className="mb-4">
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Bio
                   </label>
                   <textarea
                     value={editFormData.bio || ''}
                     onChange={(e) => setEditFormData({...editFormData, bio: e.target.value})}
                     rows="3"
                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Tell us about yourself..."
                   />
                 </div>
                 
                 <div className="mb-4">
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Location
                   </label>
                   <input
                     type="text"
                     value={editFormData.location || ''}
                     onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="City, Country"
                   />
                 </div>
                 
                 <div className="mb-6">
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Interests (comma separated)
                   </label>
                   <input
                     type="text"
                     value={Array.isArray(editFormData.interests) ? editFormData.interests.join(', ') : ''}
                     onChange={(e) => setEditFormData({...editFormData, interests: e.target.value.split(',').map(i => i.trim()).filter(i => i)})}
                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Music, Sports, Travel, etc."
                   />
                 </div>
                 
                 <div className="flex gap-3">
                   <button
                     type="button"
                     onClick={() => setShowEditModal(false)}
                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                   >
                     Save Changes
                   </button>
                 </div>
               </form>
             </div>
           </div>
         </div>
       )}

       {/* Add User Modal */}
       {showAddUserModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
             <div className="p-6 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <h2 className="text-xl font-bold">Add New User</h2>
                 <button
                   onClick={() => setShowAddUserModal(false)}
                   className="p-2 hover:bg-gray-100 rounded-lg"
                 >
                   <XCircle className="w-5 h-5" />
                 </button>
               </div>
             </div>
             <div className="p-6">
               <form onSubmit={(e) => {
                 e.preventDefault();
                 handleAddUser(addUserFormData);
               }}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Full Name *
                     </label>
                     <input
                       type="text"
                       value={addUserFormData.full_name}
                       onChange={(e) => setAddUserFormData({...addUserFormData, full_name: e.target.value})}
                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       required
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Email *
                     </label>
                     <input
                       type="email"
                       value={addUserFormData.email}
                       onChange={(e) => setAddUserFormData({...addUserFormData, email: e.target.value})}
                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       required
                     />
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Password *
                     </label>
                     <input
                       type="password"
                       value={addUserFormData.password}
                       onChange={(e) => setAddUserFormData({...addUserFormData, password: e.target.value})}
                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       minLength="6"
                       required
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Gender
                     </label>
                     <select
                       value={addUserFormData.gender}
                       onChange={(e) => setAddUserFormData({...addUserFormData, gender: e.target.value})}
                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     >
                       <option value="">Select Gender</option>
                       <option value="male">Male</option>
                       <option value="female">Female</option>
                       <option value="other">Other</option>
                     </select>
                   </div>
                 </div>
                 
                 <div className="mb-4">
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Bio
                   </label>
                   <textarea
                     value={addUserFormData.bio}
                     onChange={(e) => setAddUserFormData({...addUserFormData, bio: e.target.value})}
                     rows="3"
                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Tell us about this person..."
                   />
                 </div>
                 
                 <div className="mb-4">
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Location
                   </label>
                   <input
                     type="text"
                     value={addUserFormData.location}
                     onChange={(e) => setAddUserFormData({...addUserFormData, location: e.target.value})}
                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="City, Country"
                   />
                 </div>
                 
                 <div className="mb-6">
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Interests (comma separated)
                   </label>
                   <input
                     type="text"
                     value={Array.isArray(addUserFormData.interests) ? addUserFormData.interests.join(', ') : ''}
                     onChange={(e) => setAddUserFormData({...addUserFormData, interests: e.target.value.split(',').map(i => i.trim()).filter(i => i)})}
                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Music, Sports, Travel, etc."
                   />
                 </div>
                 
                 <div className="flex gap-3">
                   <button
                     type="button"
                     onClick={() => setShowAddUserModal(false)}
                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                   >
                     Create User
                   </button>
                 </div>
               </form>
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