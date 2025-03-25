import React, { useState, useEffect, useRef } from 'react';
import './index.css';

// Custom models data
const customModels = [
  {
    id: 'insulin',
    name: 'Human insulin molecular model and sonification',
    date: 'Sep 21st 2018',
    description: 'This is a 3D model of human insulin molecule, converted from a 2hiu.pdb (Protein Data Bank) file. I have represented the amino acids (the building blocks of protein molecules) of the insulin molecule with musical notes, a process called scientific sonification. Here is the sound file: https://soundcloud.com/user-313087328/sonification-of-the-2hiu-human-insulin-molecule Sonification is the process of using non-speech sound properties that convey meaningful information. I mapped Insulin molecule\'s amino acids to musical notes played by 4 different instruments. Each instrument determines each amino acid\'s hydrophobicity: Very hydrophobic=acoustic grand piano, Hydrophobic=violin, Neutral=trumpet, Hydrophilic=xylophone. For more information about scientific sonification of molecules: Garcia-Ruiz, M.A., & Gutierrez-Pulido, J.R. (2006). An overview of auditory display to assist comprehension of molecular information. Interacting with Computers, Elsevier, 18(4).',
    material: 'Human insulin',
    thumbnail: './metamodels/molecule.png',
    embed_code: '<iframe title="human insulin molecular model and sonification" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/0ba70b315d984ac294f24bc9f4549fc2/embed"> </iframe>',
    is_embedded: true
  },
  {
    id: 'Woodenbunny',
    name: 'Brown wooden bunny',
    date: 'April 18th 2017',
    description: 'A small wooden figurine carved in the shape of a bunny. Toy carved by a student from the Shingwauk Indian Residential School, Sault ste. Marie, Canada. This object belongs to Algoma University Archives.',
    material: 'wood',
    thumbnail: './metamodels/Woodenbunny.png',
    embed_code: '<iframe title="Brown wooden bunny" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/44ce7f1dfdd94aeaba8ffd5951275598/embed"> </iframe>',
    is_embedded: true
  },
  {
    id: 'Soldier',
    name: 'Terracotta Soldier',
    date: 'March 29th 2017',
    description: 'Testing the Matter and Form 3D scanner with this replica of a Terracota Soldier from China.',
    material: 'terracotta',
    thumbnail: './metamodels/TerracottaSoldier.png',
    embed_code: '<iframe title="Terracotta Soldier" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/7a519d2fe77341a4ae337db5d1324f6f/embed"> </iframe>',
    is_embedded: true
  },
  {
    id: 'PrintingMold',
    name: 'old wooden printing mold block',
    date: 'March 25th 2024',
    description: 'Old printing mold block with the inscription: "Algoma Missionary News" Algoma University Archive',
    material: 'wooden printing mold block',
    thumbnail: './metamodels/Oldwoodenprinting.png',
    embed_code: '<iframe title="Artifact 2 -- old wooden printing mold block" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/74f860c566844daeadd20a3a05b7ebbe/embed"> </iframe>',
    is_embedded: true
  },
  {
    id: 'mold block',
    name: 'lead printing mold block',
    date: 'March 25th 2024',
    description: 'Old lead printing mold block with the inscription: "Algoma Missionary News and Shingwauk Journal" Algoma University Archive',
    material: 'lead printing mold block',
    thumbnail: './metamodels/leadprintingmold.png',
    embed_code: '<iframe title="Artifact3 - lead printing mold block" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/0017c9f50b194984a6aceec762e1cf5f/embed"> </iframe>',
    is_embedded: true
  },
  {
    id: 'old mold block 2',
    name: 'old wooden printing mold block',
    date: 'March 25th 2024',
    description: 'Old lead printing mold block with the inscription: "Algoma Missionary News and Shingwauk Journal" Algoma University Archive',
    material: 'wooden printing mold block 2',
    thumbnail: './metamodels/oldwoodenprinting2.png',
    embed_code: '<iframe title="Artifact1 --- old wooden printing mold block" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/3d032e35ddbf4640a4905d2057774ddb/embed"> </iframe>',
    is_embedded: true
  },
  {
    id: 'dog',
    name: 'Dog',
    date: 'April 18th 2017',
    description: 'Toy carved by a student from the Shingwauk Indian Residential School, Sault ste. Marie, Canada',
    material: 'wood',
    thumbnail: './metamodels/dog.png',
    embed_code: '<iframe title="Dog" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/39b78840da6147599878b1e63349f1bb/embed"> </iframe> ',
    is_embedded: true
  }
];

const Navbar = ({ isNavOpen, setIsNavOpen, darkMode, setDarkMode }) => (
  <nav className="navbar">
    <div className="nav-brand">
      <img src="/images/weblogo.png" alt="Algoma University Logo" className="nav-logo" />
      <span>Algoma University 3D Archive</span>
    </div>
    <div className={`nav-links ${isNavOpen ? 'open' : ''}`}>
      <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>
    <div className="hamburger-menu" onClick={() => setIsNavOpen(!isNavOpen)}>☰</div>
  </nav>
);

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-content">
      <div className="footer-links">
        <a href="#privacy" className="footer-btn">Privacy Policy</a>
        <a href="#terms" className="footer-btn">Terms of Use</a>
        <a href="#contact" className="footer-btn">Contact</a>
      </div>
    </div>
  </footer>
);

const MetadataPanel = ({ object, visible, toggleVisibility }) => {
  if (!object || !visible) return null;
  
  return (
    <div className="metadata-panel">
      <div className="metadata-header">
        <h3>{object.name}</h3>
        <button onClick={toggleVisibility} className="close-btn">×</button>
      </div>
      <div className="metadata-content">
        <p><strong>Date:</strong> {object.date}</p>
        <p><strong>Material:</strong> {object.material}</p>
        <p><strong>Description:</strong> {object.description}</p>
        {object.additional_info && (
          <div className="additional-info">
            <h4>Additional Information</h4>
            <p>{object.additional_info}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  // Use separate state variables for better maintainability
  const [darkMode, setDarkMode] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [metadataVisible, setMetadataVisible] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All Materials');

  const mountRef = useRef(null);

  // Setup for embedded models
  useEffect(() => {
    if (!selectedObject || !mountRef.current) return;

    // Handle embedded models
    if (selectedObject.is_embedded && selectedObject.embed_code) {
      // Clean up any existing content
      mountRef.current.innerHTML = '';
      
      // Create wrapper for the embedded iframe
      const embedWrapper = document.createElement('div');
      embedWrapper.className = 'embed-wrapper';
      embedWrapper.style.width = '100%';
      embedWrapper.style.height = '100%';
      embedWrapper.innerHTML = selectedObject.embed_code;
      
      // Add the embedded content
      mountRef.current.appendChild(embedWrapper);
    }

    return () => {
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, [selectedObject]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    const viewer = mountRef.current;
    
    if (!document.fullscreenElement) {
      if (viewer.requestFullscreen) {
        viewer.requestFullscreen();
      } else if (viewer.webkitRequestFullscreen) {
        viewer.webkitRequestFullscreen();
      } else if (viewer.msRequestFullscreen) {
        viewer.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // Get unique materials for filter dropdown
  const materialOptions = ['All Materials', ...new Set(customModels.filter(obj => obj.material).map(obj => obj.material))];

  // Filter objects based on search term and selected material
  const filteredObjects = customModels.filter(obj => {
    const matchesSearch = !searchTerm || 
      (obj.name && obj.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (obj.description && obj.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (obj.material && obj.material.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMaterial = filter === 'All Materials' || obj.material === filter;
    
    return matchesSearch && matchesMaterial;
  });

  // View original model on Sketchfab
  const viewOriginalModel = () => {
    if (selectedObject && selectedObject.is_embedded) {
      // Extract Sketchfab model ID from embed code
      const modelIdMatch = selectedObject.embed_code.match(/models\/([a-f0-9]+)\/embed/);
      if (modelIdMatch && modelIdMatch[1]) {
        window.open(`https://sketchfab.com/3d-models/${modelIdMatch[1]}`, '_blank');
      }
    }
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Navbar 
        isNavOpen={isNavOpen} 
        setIsNavOpen={setIsNavOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Exploring 3D Models of Algoma University</h1>
          <p className="hero-description">Discover our collection of detailed 3D artifacts and molecular models</p>
          <div className="hero-actions">
            <button 
              className="hero-button primary" 
              onClick={() => document.querySelector('.search-section').scrollIntoView({ behavior: 'smooth' })}
            >
              Browse Collection
            </button>
            <button 
              className="hero-button secondary"
              onClick={() => window.open('https://algomau.ca/research/', '_blank')}
            >
              Learn More
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{customModels.length}</span>
              <span className="stat-label">3D Models</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{new Set(customModels.filter(obj => obj.material).map(obj => obj.material)).size}</span>
              <span className="stat-label">Materials</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Access</span>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator" onClick={() => document.querySelector('.search-section').scrollIntoView({ behavior: 'smooth' })}>
          <span>Scroll to Explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      <main className="main-content">
        <div className="search-section">
          <h2 className="search-title">Search 3D Objects</h2>
          <div className="search-filter-container">
            <div className="search-input-wrapper">
              <i className="search-icon">🔍</i>
          <input 
            type="text" 
                placeholder="Search by name, material, or description..."
                className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
              {searchTerm && (
                <button 
                  className="clear-search-btn" 
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>
            <div className="select-wrapper">
          <select 
                className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {materialOptions.map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>
          {searchTerm && (
            <div className="search-results-info">
              Found {filteredObjects.length} object(s) matching "{searchTerm}"
            </div>
          )}
        </div>

        <div className="viewer-metadata-container">
          <div className="viewer-container">
            <div className="viewer-controls">
              <button 
                className="btn-primary" 
                onClick={toggleFullscreen}
              >
                Fullscreen
              </button>
              <button
                className="btn-secondary"
                onClick={() => setMetadataVisible(!metadataVisible)}
              >
                {metadataVisible ? 'Hide Info' : 'Show Info'}
              </button>
              {selectedObject && selectedObject.is_embedded && (
              <button
                  className="download-btn"
                  onClick={viewOriginalModel}
              >
                  View on Sketchfab
              </button>
              )}
            </div>

            <div className="model-viewer" ref={mountRef}>
              {loading ? (
                <div className="loading-spinner"></div>
              ) : !selectedObject ? (
                <div className="select-model-message">
                  <p>Select an artifact from the list below to view</p>
                </div>
              ) : null}
            </div>
          </div>

          {selectedObject && (
            <MetadataPanel 
              object={selectedObject} 
              visible={metadataVisible}
              toggleVisibility={() => setMetadataVisible(!metadataVisible)} 
            />
          )}
        </div>

        <div className="thumbnail-table-container">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : filteredObjects.length > 0 ? (
            <div className="responsive-table-wrapper">
              <table className="thumbnail-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th className="hide-on-mobile">Description</th>
                    <th>Material</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredObjects.map(obj => (
                    <tr
                      key={obj.id}
                      className={`thumbnail-row ${selectedObject && selectedObject.id === obj.id ? 'selected' : ''}`}
                      onClick={() => setSelectedObject(obj)}
                    >
                      <td className="thumbnail-image-cell">
                        {obj.thumbnail ? (
                          <div className="thumbnail-image">
                            <img src={obj.thumbnail} alt={obj.name} />
                          </div>
                        ) : (
                        <div className="thumbnail-image"></div>
                        )}
                      </td>
                      <td>{obj.name}</td>
                      <td>{obj.date}</td>
                      <td className="hide-on-mobile">
                        {obj.description && obj.description.length > 100 
                          ? `${obj.description.substring(0, 100)}...` 
                          : obj.description}
                      </td>
                      <td>{obj.material}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-results">No artifacts found matching your search.</p>
          )}
        </div>
      </main>

      <Footer />

      {/* Additional CSS for embedded models and thumbnails */}
      <style jsx>{`
        .download-btn {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 8px;
        }

        .download-btn:hover {
          background-color: #45a049;
        }

        .download-btn:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
        }

        .dark-mode .download-btn {
          background-color: #3a8a3e;
        }

        .dark-mode .download-btn:hover {
          background-color: #327a36;
        }

        .embed-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .embed-wrapper iframe {
          width: 100%;
          height: 100%;
          border: 0;
          position: absolute;
          top: 0;
          left: 0;
        }

        .thumbnail-image {
          width: 60px;
          height: 60px;
          background-color: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .thumbnail-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dark-mode .thumbnail-image {
          background-color: #333333;
        }

        @media (max-width: 768px) {
          .viewer-controls {
            flex-wrap: wrap;
            justify-content: center;
          }

          .download-btn {
            margin-top: 8px;
            margin-left: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default App;