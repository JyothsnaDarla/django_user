// src/components/ArticleList.tsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';

const safeParseDate = (isoString) => {
  if (!isoString) return new Date(); 
  const simplifiedString = isoString.substring(0, 19).replace('T', ' '); 
  const date = new Date(simplifiedString);
  if (isNaN(date.getTime())) return new Date(isoString); 
  return date;
};

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  useEffect(() => {
    setLoading(true);
    const url = searchQuery 
      ? `articles/?search=${searchQuery}`
      : 'articles/';

    api.get(url)
      .then(response => {
        setArticles(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
        setLoading(false);
      });
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    } else {
      setSearchParams({});
    }
  };

  if (loading) return <div className="loading">समाचार लोड हो रहा है...</div>;

  return (
    <div className="article-list">
      <h2>नवीनतम समाचार</h2>

      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search articles by title or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">खोज</button>
      </form>

      {searchQuery && (
        <p className="search-status">
          परिणाम प्रदर्शित हो रहे हैं: <strong>"{searchQuery}"</strong> ({articles.length} मिल गए)
        </p>
      )}

      {articles.length === 0 ? (
        <p className="no-results">आपके मापदंड से मेल खाने वाले कोई लेख नहीं मिले.</p>
      ) : (
        articles.map(article => (
          <div key={article.id} className="article-preview">
            <div className="media-thumbnail">
              {article.images?.length > 0 ? (
                <img 
  src={article.images[0]?.image} 
  alt={article.title} 
/>

              ) : article.videos?.length > 0 ? (
                <video 
                  src={`http://localhost:8000${article.videos[0].video_file}`} 
                  controls 
                  muted 
                />
              ) : (
                <div className="no-media-placeholder">कोई मीडिया नहीं</div>
              )}
            </div>

            <div className="article-info">
              <span className="category-tag">
                {article.category?.name || 'N/A'}
              </span>
              <h3><Link to={`/articles/${article.id}`}>{article.title}</Link></h3>
              <p>
                {article.detailed_description 
                  ? article.detailed_description.substring(0, 150) 
                  : 'No content'}...
              </p> 
              <small>
                प्रकाशित: {article.publication_date
                  ? format(safeParseDate(article.publication_date), 'dd MMMM yyyy')
                  : 'N/A Time'}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ArticleList;
