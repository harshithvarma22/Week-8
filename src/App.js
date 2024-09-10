import React, { useState, useEffect } from 'react';
import UploadNovelForm from './UploadNovelForm';
import './App.css';

function App() {
  const [view, setView] = useState('home');
  const [novels, setNovels] = useState([]);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Retrieve data from localStorage when the app loads
  useEffect(() => {
    const storedNovels = JSON.parse(localStorage.getItem('novels'));
    if (storedNovels) {
      setNovels(storedNovels);
    }
  }, []);

  // Store the updated novels in localStorage whenever the novel list changes
  useEffect(() => {
    if (novels.length > 0) {
      localStorage.setItem('novels', JSON.stringify(novels));
    }
  }, [novels]);

  const switchView = (view) => {
    setView(view);
  };

  const addNovel = (novel) => {
    setNovels([...novels, novel]);
    setView('home');
  };

  const selectNovel = (novel) => {
    setSelectedNovel(novel);
    setView('details');
  };

  const updateNovel = (updatedNovel) => {
    setNovels(
      novels.map((novel) =>
        novel.title === selectedNovel.title ? updatedNovel : novel
      )
    );
    setView('home');
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredNovels = novels.filter((novel) =>
    novel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    novel.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <h1>NOVEL BLOG</h1>
      {view === 'home' && (
        <div>
          <button onClick={() => switchView('upload')}>Upload New Novel</button>
          <input
            type="text"
            placeholder="Search for novels by title or author"
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginTop: '20px', padding: '10px', width: '80%' }}
          />
          <ul>
            {filteredNovels.map((novel, index) => (
              <li key={index} onClick={() => selectNovel(novel)}>
                {novel.imageUrl && (
                  <img
                    src={novel.imageUrl}
                    alt={novel.title}
                    style={{ width: '100px', height: '150px' }}
                  />
                )}
                <span>{novel.title} by {novel.author}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {view === 'upload' && <UploadNovelForm addNovel={addNovel} switchView={switchView} />}
      {view === 'details' && selectedNovel && (
        <div>
          <h2>{selectedNovel.title}</h2>
          <p>Author: {selectedNovel.author}</p>
          <p>Genre: {selectedNovel.genre}</p>
          <p>Summary: {selectedNovel.summary}</p>
          {selectedNovel.imageUrl && (
            <img
              src={selectedNovel.imageUrl}
              alt={selectedNovel.title}
              style={{ width: '200px', height: '300px' }}
            />
          )}
          <div className="button-group">
            <button onClick={() => setView('home')}>Back to Home</button>
            <button onClick={() => setView('update')}>Update Novel</button>
          </div>
        </div>
      )}
      {view === 'update' && selectedNovel && (
        <UploadNovelForm
          addNovel={updateNovel}
          switchView={switchView}
          existingNovel={selectedNovel}
        />
      )}
    </div>
  );
}

export default App;
