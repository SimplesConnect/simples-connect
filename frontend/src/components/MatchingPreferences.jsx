// Matching Preferences Component for Enhanced Social Networking
import React from 'react';

const MatchingPreferences = ({ onSave, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-simples-midnight mb-4">
          ⚠️ Feature Temporarily Disabled
        </h2>
        <p className="text-simples-storm mb-6">
          Matching preferences are temporarily disabled while we update our database. 
          Basic matching is still available on the Discover page.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-simples-ocean text-white py-3 rounded-xl font-semibold hover:bg-simples-sky transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default MatchingPreferences; 