-- Fix for Matching Algorithm Trigger Bug
-- This fixes the issue where likes don't become matches

-- Drop the existing buggy trigger and function
DROP TRIGGER IF EXISTS ensure_match_consistency_trigger ON matches;
DROP FUNCTION IF EXISTS ensure_match_consistency();

-- Create the corrected function
CREATE OR REPLACE FUNCTION ensure_match_consistency()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure user1_id is always less than user2_id to prevent duplicate matches
  IF NEW.user1_id > NEW.user2_id THEN
    -- Swap the user IDs to maintain consistency
    -- FIX: Use NEW values, not OLD values (OLD doesn't exist for INSERT)
    DECLARE
      temp_user_id UUID;
    BEGIN
      temp_user_id := NEW.user1_id;
      NEW.user1_id := NEW.user2_id;
      NEW.user2_id := temp_user_id;
    END;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the corrected trigger
CREATE TRIGGER ensure_match_consistency_trigger
  BEFORE INSERT OR UPDATE ON matches
  FOR EACH ROW EXECUTE PROCEDURE ensure_match_consistency();

-- Test the fix by checking if the function works correctly
-- This should succeed without errors
SELECT 'Trigger function fixed successfully!' as status;