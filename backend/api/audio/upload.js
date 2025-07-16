const { createClient } = require('@supabase/supabase-js');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Extract user from JWT token
async function extractUser(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('No authorization header');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      throw new Error('Invalid token');
    }
    
    return user;
  } catch (error) {
    throw error;
  }
}

// Function to get file metadata (simplified)
function getAudioMetadata(filePath) {
  const stats = fs.statSync(filePath);
  return {
    size: stats.size,
    // In a real implementation, you'd use a library like node-ffmpeg 
    // or music-metadata to extract actual audio metadata
    duration: null,
    bitrate: null
  };
}

// Vercel serverless function for /api/audio/upload
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Handle POST request - upload audio file
  if (req.method === 'POST') {
    try {
      const user = await extractUser(req);
      
      // Parse the form data
      const form = formidable({
        maxFileSize: 50 * 1024 * 1024, // 50MB limit
        allowEmptyFiles: false,
        filter: function ({ name, originalFilename, mimetype }) {
          // Only allow audio files
          return mimetype && mimetype.includes('audio');
        }
      });
      
      const [fields, files] = await form.parse(req);
      
      const audioFile = files.audio?.[0];
      if (!audioFile) {
        return res.status(400).json({
          success: false,
          error: 'No audio file provided'
        });
      }
      
      // Validate file type
      const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mp4'];
      if (!allowedTypes.includes(audioFile.mimetype)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid file type. Only MP3, WAV, OGG, and MP4 audio files are allowed.'
        });
      }
      
      // Get file metadata
      const metadata = getAudioMetadata(audioFile.filepath);
      
      // Generate unique filename
      const fileExtension = path.extname(audioFile.originalFilename || '').toLowerCase();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}${fileExtension}`;
      
      // Read file buffer
      const fileBuffer = fs.readFileSync(audioFile.filepath);
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(fileName, fileBuffer, {
          contentType: audioFile.mimetype,
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error('Failed to upload file to storage');
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl(fileName);
      
      // Extract metadata from form fields
      const title = fields.title?.[0] || path.parse(audioFile.originalFilename || '').name;
      const artist_name = fields.artist_name?.[0] || 'Unknown Artist';
      const album_name = fields.album_name?.[0];
      const genre = fields.genre?.[0];
      const description = fields.description?.[0];
      const tags = fields.tags?.[0] ? fields.tags[0].split(',').map(tag => tag.trim()) : [];
      
      // Create database record
      const { data: track, error: dbError } = await supabase
        .from('audio_tracks')
        .insert({
          title,
          artist_name,
          album_name,
          genre,
          description,
          tags,
          file_url: publicUrl,
          file_size: metadata.size,
          duration: metadata.duration,
          bitrate: metadata.bitrate,
          format: fileExtension.substring(1), // Remove the dot
          uploaded_by: user.id,
          is_approved: false // Require manual approval
        })
        .select()
        .single();
      
      if (dbError) {
        console.error('Database error:', dbError);
        // Clean up uploaded file if database insert fails
        await supabase.storage
          .from('audio-files')
          .remove([fileName]);
        
        throw new Error('Failed to save track metadata');
      }
      
      // Clean up temp file
      fs.unlinkSync(audioFile.filepath);
      
      res.status(201).json({
        success: true,
        track,
        message: 'Audio file uploaded successfully. It will be available after approval.'
      });
      
    } catch (error) {
      console.error('Error uploading audio file:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to upload audio file'
      });
    }
  }
  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}; 