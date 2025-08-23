import React from 'react';

const Loader = () => {
  return (
    <div className="inline-flex items-center">
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600 mr-2"></div>
      <span>Uploading...</span>
    </div>
  );
};

export default Loader;