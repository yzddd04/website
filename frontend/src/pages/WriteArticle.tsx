import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Save, Eye, Bold, Italic, List, Link as LinkIcon, Type } from 'lucide-react';
import { addArticle } from '../api';

const WriteArticle: React.FC = () => {
  const { user } = useAuth();
  const [article, setArticle] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Tutorial',
    featuredImage: ''
  });
  const [isPreview, setIsPreview] = useState(false);

  const categories = ['Tutorial', 'News', 'Tips & Tricks', 'Success Story', 'Event', 'Workshop'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setArticle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'heading':
        formattedText = `## ${selectedText || 'Heading'}`;
        break;
      case 'list':
        formattedText = `- ${selectedText || 'List item'}`;
        break;
      case 'link':
        formattedText = `[${selectedText || 'link text'}](url)`;
        break;
      default:
        return;
    }

    const newContent = 
      textarea.value.substring(0, start) + 
      formattedText + 
      textarea.value.substring(end);
    
    setArticle(prev => ({ ...prev, content: newContent }));
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  const handleSave = async () => {
    // Save article to backend
    await addArticle(article);
    setIsPreview(false);
    alert('Article posted successfully!');
  };

  const handlePublish = () => {
    if (!article.title || !article.content || !article.excerpt) {
      alert('Please fill in all required fields');
      return;
    }
    
    // In a real app, this would publish the article
    console.log('Publishing article:', article);
    alert('Article published successfully!');
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-gray-900 mb-4">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-gray-900 mb-3">$1</h3>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-purple-600 hover:text-purple-700 underline">$1</a>')
      .replace(/\n/g, '<br>');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please login to write articles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Write Article
          </h1>
          <p className="text-gray-600">
            Share your knowledge and experiences with the community
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {!isPreview ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              {/* Article Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={article.title}
                    onChange={handleInputChange}
                    placeholder="Enter your article title..."
                    className="w-full px-4 py-3 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    name="excerpt"
                    value={article.excerpt}
                    onChange={handleInputChange}
                    placeholder="Brief description of your article..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    name="featuredImage"
                    value={article.featuredImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Formatting Toolbar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-300 flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => insertFormatting('bold')}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                        title="Bold"
                      >
                        <Bold className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('italic')}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                        title="Italic"
                      >
                        <Italic className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('heading')}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                        title="Heading"
                      >
                        <Type className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('list')}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                        title="List"
                      >
                        <List className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('link')}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                        title="Link"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <textarea
                      id="content"
                      name="content"
                      value={article.content}
                      onChange={handleInputChange}
                      placeholder="Write your article content here... You can use markdown formatting."
                      rows={20}
                      className="w-full px-4 py-3 border-0 focus:ring-0 resize-none"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Supports markdown: **bold**, *italic*, ## headings, - lists, [links](url)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Preview */
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <article>
                {article.featuredImage && (
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full mb-4">
                    {article.category}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {article.title || 'Article Title'}
                  </h1>
                  <p className="text-xl text-gray-600 mb-6">
                    {article.excerpt || 'Article excerpt will appear here...'}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>By {user.name}</span>
                    <span>•</span>
                    <span>{new Date().toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: renderMarkdown(article.content || 'Your article content will appear here...') 
                  }}
                />
              </article>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Article Settings */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={article.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {user.name}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <p className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  Draft
                </p>
              </div>
            </div>
          </div>

          {/* Writing Tips */}
          <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Writing Tips</h3>
            <ul className="space-y-2 text-sm text-purple-800">
              <li>• Use clear, engaging headlines</li>
              <li>• Include relevant images or media</li>
              <li>• Break up text with subheadings</li>
              <li>• Write in a conversational tone</li>
              <li>• Proofread before publishing</li>
              <li>• Add value for your readers</li>
            </ul>
          </div>

          {/* Markdown Guide */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Markdown Guide</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div><code>**bold**</code> → <strong>bold</strong></div>
              <div><code>*italic*</code> → <em>italic</em></div>
              <div><code>## Heading</code> → <strong>Heading</strong></div>
              <div><code>- List item</code> → • List item</div>
              <div><code>[link](url)</code> → <span className="text-purple-600 underline">link</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;