import React, { useEffect, useState } from 'react';
import { Calendar, User, Eye, Heart, MessageCircle, Shield } from 'lucide-react';
// @ts-expect-error: No type declaration for '../api', safe to ignore for now
import { getNews } from '../api';

interface NewsItem {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  isAdmin: boolean;
  date: string;
  views: number;
  likes: number;
  comments: number;
  category: string;
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  useEffect(() => {
    getNews().then(setNews);
  }, []);

  const categories = ['All', 'Workshop', 'Partnership', 'Success Story', 'Update', 'Event', 'Tutorial'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredNews = selectedCategory === 'All' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Workshop': return 'bg-blue-100 text-blue-800';
      case 'Partnership': return 'bg-green-100 text-green-800';
      case 'Success Story': return 'bg-yellow-100 text-yellow-800';
      case 'Update': return 'bg-purple-100 text-purple-800';
      case 'Event': return 'bg-pink-100 text-pink-800';
      case 'Tutorial': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          News & Updates
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Dapatkan informasi terbaru tentang komunitas, tips content creation, dan berbagai event menarik
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Article */}
      {filteredNews.length > 0 && (
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={filteredNews[0].image}
                  alt={filteredNews[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(filteredNews[0].category)}`}>
                    {filteredNews[0].category}
                  </span>
                  <span className="text-sm text-gray-500">Featured</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {filteredNews[0].title}
                </h2>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {filteredNews[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span className="flex items-center space-x-1">
                        <span>{filteredNews[0].author}</span>
                        {filteredNews[0].isAdmin && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                            <Shield className="h-2.5 w-2.5 mr-0.5" />
                            Admin
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(filteredNews[0].date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{filteredNews[0].views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{filteredNews[0].likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNews.slice(1).map((article) => (
          <article
            key={article._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-100"
          >
            <div className="relative">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span className="flex items-center space-x-1">
                    <span>{article.author}</span>
                    {article.isAdmin && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <Shield className="h-2.5 w-2.5 mr-0.5" />
                        Admin
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.date)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{article.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{article.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{article.comments}</span>
                  </div>
                </div>
                <button className="text-purple-600 hover:text-purple-700 font-medium">
                  Read More
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <MessageCircle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tidak ada artikel ditemukan
          </h3>
          <p className="text-gray-600">
            Coba pilih kategori lain atau kembali lagi nanti
          </p>
        </div>
      )}
    </div>
  );
};

export default News;