import React from 'react';

const Courses: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* YouTube Embed */}
        <div>
          <h2 className="text-xl font-semibold mb-4">YouTube</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-64 rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
        {/* Instagram Embed */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Instagram</h2>
          <div className="w-full h-64 rounded-lg shadow-lg bg-white flex items-center justify-center">
            <iframe
              src="https://www.instagram.com/p/Cv1QwQ0Jv1A/embed"
              title="Instagram post embed"
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
        {/* TikTok Embed */}
        <div>
          <h2 className="text-xl font-semibold mb-4">TikTok</h2>
          <div className="w-full h-64 rounded-lg shadow-lg bg-white flex items-center justify-center">
            <iframe
              src="https://www.tiktok.com/embed/7266848881234567890"
              title="TikTok video embed"
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
        {/* Twitter/X Embed */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Twitter</h2>
          <div className="w-full h-64 rounded-lg shadow-lg bg-white flex items-center justify-center">
            <iframe
              src="https://twitframe.com/show?url=https://twitter.com/jack/status/20"
              title="Twitter post embed"
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses; 