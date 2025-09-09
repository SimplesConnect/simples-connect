-- Test Database Structure for Enhanced Matching
-- Run this after applying COMPLETE_DATABASE_FIX.sql to verify everything is working

-- =====================================================
-- 1. TEST ENHANCED MATCHING COLUMNS EXIST
-- =====================================================

-- Check if all required columns exist
SELECT 
  CASE 
    WHEN COUNT(*) = 13 THEN '✅ All enhanced matching columns exist!'
    ELSE '❌ Missing columns: ' || (13 - COUNT(*))::TEXT
  END as column_check
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN (
    'intentions', 'vibe', 'life_phase', 'timezone_overlap_score', 
    'value_alignment_score', 'communication_style', 'emotional_availability', 
    'region_preference', 'birthdate', 'gallery_images', 'gallery_video',
    'last_active_at', 'conversation_boundaries'
  );

-- =====================================================
-- 2. TEST TIMESTAMP COLUMNS ARE CORRECT
-- =====================================================

-- Verify timestamp columns exist and have correct types
SELECT 
  column_name,
  data_type,
  column_default,
  CASE 
    WHEN column_name = 'last_active' THEN '❌ Should be last_active_at'
    WHEN column_name = 'last_active_at' AND data_type = 'timestamp with time zone' THEN '✅ Correct'
    WHEN column_name IN ('created_at', 'updated_at') AND data_type = 'timestamp with time zone' THEN '✅ Correct'
    ELSE '⚠️ Check this column'
  END as status
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('last_active', 'last_active_at', 'created_at', 'updated_at')
ORDER BY column_name;

-- =====================================================
-- 3. TEST CONSTRAINTS ARE APPLIED
-- =====================================================

-- Check if constraints exist
SELECT 
  constraint_name,
  CASE 
    WHEN constraint_name = 'check_vibe_values' THEN '✅ Vibe constraint exists'
    WHEN constraint_name = 'check_life_phase_values' THEN '✅ Life phase constraint exists'
    WHEN constraint_name = 'check_emotional_availability_values' THEN '✅ Emotional availability constraint exists'
    ELSE '⚠️ Unknown constraint'
  END as status
FROM information_schema.check_constraints 
WHERE constraint_name IN ('check_vibe_values', 'check_life_phase_values', 'check_emotional_availability_values');

-- =====================================================
-- 4. TEST MATCHING FUNCTIONS EXIST
-- =====================================================

-- Check if matching functions exist
SELECT 
  routine_name,
  routine_type,
  CASE 
    WHEN routine_name = 'calculate_match_score' THEN '✅ Match scoring function exists'
    WHEN routine_name = 'get_match_label' THEN '✅ Match label function exists'
    WHEN routine_name = 'find_potential_matches' THEN '✅ Match discovery function exists'
    WHEN routine_name = 'update_user_last_active' THEN '✅ Last active update function exists'
    ELSE '⚠️ Check this function'
  END as status
FROM information_schema.routines 
WHERE routine_name IN ('calculate_match_score', 'get_match_label', 'find_potential_matches', 'update_user_last_active')
  AND routine_schema = 'public';

-- =====================================================
-- 5. TEST INDEXES EXIST
-- =====================================================

-- Check if performance indexes exist
SELECT 
  indexname,
  CASE 
    WHEN indexname LIKE '%intentions%' THEN '✅ Intentions index exists'
    WHEN indexname LIKE '%vibe%' THEN '✅ Vibe index exists'
    WHEN indexname LIKE '%life_phase%' THEN '✅ Life phase index exists'
    WHEN indexname LIKE '%last_active_at%' THEN '✅ Last active index exists'
    WHEN indexname LIKE '%value_alignment%' THEN '✅ Value alignment index exists'
    WHEN indexname LIKE '%timezone%' THEN '✅ Timezone index exists'
    ELSE '⚠️ Check this index'
  END as status
FROM pg_indexes 
WHERE tablename = 'profiles' 
  AND indexname LIKE '%matching%' 
   OR indexname LIKE '%intentions%' 
   OR indexname LIKE '%vibe%' 
   OR indexname LIKE '%life_phase%'
   OR indexname LIKE '%last_active_at%'
   OR indexname LIKE '%value_alignment%'
   OR indexname LIKE '%timezone%';

-- =====================================================
-- 6. TEST SAMPLE DATA
-- =====================================================

-- Test that we can insert and query enhanced matching data
DO $$
DECLARE
  test_user_id UUID;
  test_score INTEGER;
BEGIN
  -- Try to find a user with complete profile
  SELECT id INTO test_user_id FROM profiles WHERE is_profile_complete = true LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    -- Test the matching function
    SELECT calculate_match_score(test_user_id, test_user_id) INTO test_score;
    RAISE NOTICE '✅ Match scoring function works! Self-match score: %', test_score;
  ELSE
    RAISE NOTICE '⚠️ No complete profiles found to test matching';
  END IF;
END $$;

-- =====================================================
-- 7. FINAL STATUS CHECK
-- =====================================================

SELECT 
  CASE 
    WHEN (
      SELECT COUNT(*) FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name IN (
        'intentions', 'vibe', 'life_phase', 'timezone_overlap_score', 
        'value_alignment_score', 'communication_style', 'emotional_availability', 
        'region_preference', 'last_active_at'
      )
    ) >= 9 
    AND (
      SELECT COUNT(*) FROM information_schema.routines 
      WHERE routine_name IN ('calculate_match_score', 'get_match_label', 'find_potential_matches')
    ) >= 3
    AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'last_active'
    )
    THEN '🎉 DATABASE IS READY FOR ENHANCED MATCHING! 🎉'
    ELSE '❌ Database setup incomplete - check the issues above'
  END as final_status;

SELECT 'Run this test after applying COMPLETE_DATABASE_FIX.sql' as instructions;
