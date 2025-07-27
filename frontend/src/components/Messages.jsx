// src/components/Messages.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Send, Paperclip, X, Smile, Mic, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';

const Messages = () => {
  const { user } = useAuth();
  const { markMatchAsRead, fetchUnreadCount } = useMessages();
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageCaption, setImageCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Handle pre-selected match from navigation
  useEffect(() => {
    let preSelectedMatch = null;
    
    // Handle selectedMatch format (from MatchesView, RealMatchingComponent)
    if (location.state?.selectedMatch) {
      preSelectedMatch = location.state.selectedMatch;
      console.log('Pre-selected match from navigation (selectedMatch format):', preSelectedMatch);
    }
    // Handle targetUserId/targetUser format (from ViewProfile)
    else if (location.state?.targetUserId && location.state?.targetUser) {
      const { targetUserId, targetUser } = location.state;
      preSelectedMatch = {
        id: targetUserId,
        matchId: null, // Will be resolved when we find the conversation
        name: targetUser.full_name,
        photo: targetUser.profile_picture_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=150&h=150&fit=crop',
        userId: targetUserId,
        otherUserId: targetUserId
      };
      console.log('Pre-selected match from navigation (targetUser format):', preSelectedMatch);
    }
    
    if (preSelectedMatch) {
      // Always set the selected match immediately for better UX
      setSelected(preSelectedMatch);
      
      // Load messages for this match if we have a matchId
      if (preSelectedMatch.matchId) {
        loadMessages(preSelectedMatch.matchId);
      }
      
      // If conversations are loaded, try to find matching conversation
      if (conversations.length > 0) {
        const matchingConversation = conversations.find(conv => 
          conv.matchId === preSelectedMatch.matchId || 
          conv.id === preSelectedMatch.id ||
          conv.userId === preSelectedMatch.userId ||
          conv.otherUserId === preSelectedMatch.userId
        );
        
        if (matchingConversation) {
          console.log('Found matching conversation:', matchingConversation);
          setSelected(matchingConversation);
          
          // Load messages for this conversation
          if (matchingConversation.matchId) {
            loadMessages(matchingConversation.matchId);
          }
        } else if (preSelectedMatch.userId) {
          // No existing conversation found - check if there's a match without messages
          console.log('No existing conversation found for user:', preSelectedMatch.userId);
          
          // Try to find a match without messages
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              const { data: potentialMatch, error: matchError } = await supabase
                .from('matches')
                .select('id, user1_id, user2_id')
                .or(`and(user1_id.eq.${user.id},user2_id.eq.${preSelectedMatch.userId}),and(user1_id.eq.${preSelectedMatch.userId},user2_id.eq.${user.id})`)
                .eq('is_active', true)
                .single();

              if (potentialMatch && !matchError) {
                // Found a match! Set it up properly
                console.log('Found existing match without messages:', potentialMatch.id);
                setSelected({
                  ...preSelectedMatch,
                  matchId: potentialMatch.id,
                  id: potentialMatch.id
                });
                loadMessages(potentialMatch.id);
                return;
              }
            }
          } catch (error) {
            console.log('No existing match found, showing connect first screen');
          }
          
          // No match found - show "not matched" state
          setSelected({
            ...preSelectedMatch,
            notMatched: true // Flag to show "not matched" state
          });
        }
      }
    }
  }, [location.state, conversations]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      
      // Get the current session to get the access token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch('/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load conversations');
      }

      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
      // Show empty state instead of error for better UX
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (matchId) => {
    try {
      // Get the current session to get the access token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`/api/messages/match/${matchId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load messages');
      }

      const data = await response.json();
      setMessages(data.messages || []);

      // Mark messages as read and update unread count
      await markMatchAsRead(matchId);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const sendMessage = async (content, messageType = 'text') => {
    if (!selected || !content.trim()) return;

    try {
      setSendingMessage(true);
      
      // Debug logging
      console.log('Sending message:', {
        selectedMatchId: selected.matchId,
        selectedId: selected.id,
        content: content.trim(),
        messageType
      });

      // Ensure we have a valid matchId
      let matchId = selected.matchId || selected.id;
      
      if (!matchId) {
        console.error('No matchId found for selected conversation:', selected);
        throw new Error('Cannot send message: No match ID found. Please try selecting the conversation again.');
      }
      
      // Get the current session to get the access token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }
      
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          match_id: matchId,
          content: content.trim(),
          message_type: messageType
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        throw new Error(errorData.error || `Failed to send message (${response.status})`);
      }

      const data = await response.json();
      
      // Add message to local state immediately for better UX
      setMessages(prev => [...prev, data.message]);
      
      // Update conversation list with new last message
      setConversations(prev => prev.map(conv => 
        conv.id === selected.id 
          ? { 
              ...conv, 
              lastMessage: messageType === 'image' ? '📷 Photo' : content.trim(),
              lastMessageTime: new Date()
            }
          : conv
      ));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show more helpful error messages
      let errorMessage = 'Failed to send message. Please try again.';
      if (error.message.includes('No match ID found')) {
        errorMessage = 'Please select a conversation from the list first, then try sending your message.';
      } else if (error.message.includes('No active session')) {
        errorMessage = 'Your session has expired. Please refresh the page and try again.';
      } else if (error.message.includes('403')) {
        errorMessage = 'You are not authorized to send messages in this conversation.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Invalid message content. Please check your message and try again.';
      }
      
      alert(errorMessage);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image file size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop().toLowerCase();
      const fileName = `${user.id}-message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `messages/${fileName}`;
      
      // Upload to Supabase Storage
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

      // Send message with image URL and caption
      const messageContent = imageCaption.trim() ? 
        JSON.stringify({ url: urlData.publicUrl, caption: imageCaption.trim() }) :
        urlData.publicUrl;

      await sendMessage(messageContent, 'image');

      // Clear image preview and caption
      setImagePreview(null);
      setImageCaption('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async () => {
    if (sendingMessage || uploading) return;
    
    if (imagePreview) {
      // Handle image send
      const fileInput = fileInputRef.current;
      if (fileInput && fileInput.files[0]) {
        await handleImageUpload(fileInput.files[0]);
      }
    } else if (input.trim()) {
      // Handle text send
      await sendMessage(input);
      setInput('');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const clearImagePreview = () => {
    setImagePreview(null);
    setImageCaption('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConversationSelect = async (conversation) => {
    setSelected(conversation);
    setMessages([]);
    await loadMessages(conversation.matchId);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const parseImageMessage = (content) => {
    try {
      const parsed = JSON.parse(content);
      if (parsed.url && parsed.caption) {
        return { url: parsed.url, caption: parsed.caption };
      }
    } catch (e) {
      // Not JSON, treat as plain URL
    }
    return { url: content, caption: null };
  };

  // Common emojis for quick access
  const quickEmojis = ['😀', '😂', '😍', '🥰', '😘', '😊', '😉', '😎', '🤔', '😢', '😭', '😡', '👍', '👎', '❤️', '💕', '🔥', '💯', '🎉', '👏'];

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker') && !event.target.closest('.emoji-button')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-simples-sky mx-auto mb-4"></div>
          <p className="text-simples-storm">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (selected) {
    // Show "not matched" state if user tried to message someone they're not matched with
    if (selected.notMatched) {
      return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23e879f9" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
          </div>
          
          {/* Floating Hearts Animation */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 text-pink-300 animate-bounce text-2xl">💕</div>
            <div className="absolute top-32 right-16 text-purple-300 animate-ping text-xl">💜</div>
            <div className="absolute bottom-32 left-20 text-blue-300 animate-pulse text-lg">💙</div>
            <div className="absolute bottom-20 right-12 text-red-300 animate-bounce text-xl">❤️</div>
          </div>
          
          {/* Main Content */}
          <div className="relative z-10 max-w-sm mx-auto p-8">
            {/* Glass Card */}
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-500">
              
              {/* Animated Icon */}
              <div className="relative mx-auto mb-6 w-24 h-24">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                  <div className="text-3xl animate-pulse">🔒</div>
                </div>
              </div>
              
              {/* Modern Heading */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Oops! Not Connected Yet! 
                </h2>
                <div className="text-lg mb-3">
                  <span className="animate-bounce inline-block">🚀</span>
                  <span className="ml-1 font-semibold text-gray-700">Let's fix that!</span>
                </div>
              </div>
              
              {/* Fun Description */}
              <div className="text-center mb-8 space-y-2">
                <p className="text-gray-600 leading-relaxed">
                  <span className="font-medium text-purple-600">{selected.name}</span> looks amazing, but you'll need to 
                  <span className="font-bold text-pink-600"> match first</span> to slide into those DMs! 
                </p>
                <p className="text-sm text-gray-500 italic">
                  It's like getting VIP access to the coolest party 🎉
                </p>
              </div>
              
              {/* Action Buttons with Modern Design */}
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/discover')}
                  className="group w-full relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <span className="text-xl">🎯</span>
                    <span>Start Swiping!</span>
                    <span className="text-xl animate-bounce">✨</span>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate(`/profile/${selected.userId}`)}
                  className="group w-full bg-white/50 backdrop-blur-sm border-2 border-purple-200 text-purple-700 py-3 px-6 rounded-2xl font-semibold hover:bg-white/70 hover:border-purple-300 transition-all duration-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">👀</span>
                    <span>Peek at {selected.name}'s Profile</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setSelected(null)}
                  className="w-full text-gray-500 hover:text-gray-700 py-2 font-medium transition-colors duration-300 text-sm"
                >
                  ← Back to Messages
                </button>
              </div>
              
              {/* Fun Footer */}
              <div className="mt-6 pt-4 border-t border-white/20 text-center">
                <p className="text-xs text-gray-500">
                  Pro tip: Be yourself and let the magic happen! 
                  <span className="animate-bounce inline-block ml-1">🌟</span>
                </p>
              </div>
            </div>
            
            {/* Floating Action Hint */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/40">
                <span className="text-sm text-gray-600 font-medium">Swipe right on</span>
                <span className="text-sm font-bold text-purple-600">{selected.name}</span>
                <span className="text-sm text-gray-600">to unlock chat</span>
                <span className="animate-pulse">🔓</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: '#f8fafc'
      }}>
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-3 bg-white shadow-sm border-b border-simples-silver">
          <button 
            onClick={() => setSelected(null)} 
            className="text-simples-storm hover:text-simples-midnight p-1 rounded-full hover:bg-simples-cloud transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => navigate(`/profile/${selected.otherUserId}`)} 
            className="flex items-center gap-3 hover:bg-simples-cloud rounded-lg p-2 transition-colors group"
          >
            <img 
              src={selected.photo} 
              alt={selected.name} 
              className="w-10 h-10 rounded-full object-cover cursor-pointer" 
            />
            <div className="flex-1 text-left">
              <div className="font-semibold text-simples-midnight group-hover:text-simples-ocean transition-colors">{selected.name}</div>
              <div className="text-xs text-simples-tropical flex items-center gap-1">
                <div className="w-2 h-2 bg-simples-tropical rounded-full"></div>
                online
              </div>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 text-simples-storm hover:text-simples-sky rounded-full hover:bg-simples-cloud transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button className="p-2 text-simples-storm hover:text-simples-sky rounded-full hover:bg-simples-cloud transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-simples-storm mb-2">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-simples-storm">Start a conversation with {selected.name}!</p>
              <p className="text-sm text-simples-storm opacity-75 mt-1">Send a message to break the ice 🧊</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={msg.id || i}
                className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md relative ${
                    msg.from === 'me'
                      ? 'bg-simples-sky text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-md'
                      : 'bg-white text-simples-midnight rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-md shadow-sm border border-simples-silver'
                  } ${msg.type === 'image' ? 'p-1' : 'px-3 py-2'}`}
                >
                  {msg.type === 'image' ? (
                    <div>
                      {(() => {
                        const imageData = parseImageMessage(msg.text);
                        return (
                          <>
                            <img
                              src={imageData.url}
                              alt="Shared image"
                              className="rounded-xl max-w-full h-auto cursor-pointer hover:opacity-95 transition-opacity"
                              style={{ maxHeight: '250px', maxWidth: '280px' }}
                              onClick={() => window.open(imageData.url, '_blank')}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=280&h=250&fit=crop';
                              }}
                            />
                            {imageData.caption && (
                              <div className="px-2 py-1">
                                <p className={`text-sm ${msg.from === 'me' ? 'text-white' : 'text-simples-midnight'}`}>
                                  {imageData.caption}
                                </p>
                              </div>
                            )}
                          </>
                        );
                      })()}
                      <div className={`text-xs px-2 pb-1 flex items-center justify-end gap-1 ${
                        msg.from === 'me' ? 'text-blue-100' : 'text-simples-storm'
                      }`}>
                        <span>{msg.time}</span>
                        {msg.from === 'me' && (
                          <div className="flex">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <svg className="w-4 h-4 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm">{msg.text}</p>
                      <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${
                        msg.from === 'me' ? 'text-blue-100' : 'text-simples-storm'
                      }`}>
                        <span>{msg.time}</span>
                        {msg.from === 'me' && (
                          <div className="flex">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <svg className="w-4 h-4 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="px-4 py-2 bg-white border-t border-simples-silver">
            <div className="flex items-start gap-3 p-3 bg-simples-cloud rounded-lg">
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <button
                  onClick={clearImagePreview}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-simples-rose text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-simples-midnight">📷 Image ready to send</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="Add a caption..."
                    maxLength={200}
                    className="flex-1 px-3 py-2 border border-simples-silver rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-simples-sky focus:border-transparent"
                  />
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="emoji-button p-2 text-simples-storm hover:text-simples-sky rounded-full hover:bg-white transition-colors"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                {imageCaption && (
                  <div className="text-xs text-simples-storm mt-1">
                    {imageCaption.length}/200 characters
                  </div>
                )}
              </div>
              <button
                onClick={handleSend}
                disabled={uploading || sendingMessage}
                className="px-4 py-2 bg-simples-sky text-white rounded-full hover:bg-simples-light-sky disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {uploading || sendingMessage ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-sm">Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span className="text-sm">Send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="emoji-picker absolute bottom-20 right-4 bg-white rounded-lg shadow-lg border border-simples-silver p-3 z-10">
            <div className="grid grid-cols-5 gap-2">
              {quickEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (imagePreview) {
                      setImageCaption(prev => prev + emoji);
                    } else {
                      setInput(prev => prev + emoji);
                    }
                    setShowEmojiPicker(false);
                  }}
                  className="p-2 hover:bg-simples-cloud rounded-lg transition-colors text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-simples-silver">
          <div className="flex items-end gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={imagePreview || uploading || sendingMessage}
              className="p-3 text-simples-storm hover:text-simples-sky rounded-full hover:bg-simples-cloud disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={imagePreview ? "Image selected - add caption above" : "Type a message..."}
                disabled={imagePreview || sendingMessage}
                className="w-full px-4 py-3 pr-12 border border-simples-silver rounded-full focus:outline-none focus:ring-2 focus:ring-simples-sky focus:border-transparent disabled:opacity-50 disabled:bg-simples-cloud"
              />
              
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={imagePreview || sendingMessage}
                className="emoji-button absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-simples-storm hover:text-simples-sky rounded-full hover:bg-simples-cloud disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleSend}
              disabled={(!input.trim() && !imagePreview) || uploading || sendingMessage}
              className="p-3 bg-simples-sky text-white rounded-full hover:bg-simples-light-sky disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {sendingMessage ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : input.trim() || imagePreview ? (
                <Send className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Conversations List
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-simples-cloud">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-simples-silver p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-simples-midnight">Messages</h1>
          <button className="p-2 text-simples-storm hover:text-simples-sky rounded-full hover:bg-simples-cloud transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full px-4 py-2 pl-10 border border-simples-silver rounded-full focus:outline-none focus:ring-2 focus:ring-simples-sky focus:border-transparent"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-simples-storm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Conversations */}
      <div className="divide-y divide-simples-silver">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-simples-storm mb-4">
              <svg className="w-20 h-20 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-simples-midnight mb-2">No conversations yet</h3>
            <p className="text-simples-storm mb-4">Start swiping to find matches and begin conversations!</p>
            <button 
              onClick={() => window.location.href = '/matching'}
              className="px-6 py-3 bg-simples-sky text-white rounded-full hover:bg-simples-light-sky transition-colors"
            >
              Start Matching
            </button>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleConversationSelect(conversation)}
              className="p-4 hover:bg-white cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={conversation.photo} 
                    alt={conversation.name}
                    className="w-14 h-14 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${conversation.otherUserId}`);
                    }}
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-simples-tropical border-2 border-white rounded-full"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 
                      className="font-semibold text-simples-midnight truncate cursor-pointer hover:text-simples-ocean transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${conversation.otherUserId}`);
                      }}
                    >
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-simples-storm">
                      {new Date(conversation.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-simples-storm truncate">{conversation.lastMessage}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Messages;