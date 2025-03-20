import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './index.css';

// API URL Constant
const API_URL = 'http://localhost:5000/api/objects';

// Custom models data (used when API fails or is unavailable)
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
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All Materials');
  const [modelLoaded, setModelLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [webGLError, setWebGLError] = useState(false);

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!context) {
        setWebGLError(true);
        console.error('WebGL not supported');
      }
    } catch (e) {
      setWebGLError(true);
      console.error('WebGL check failed:', e);
    }
  }, []);

  // Fetch Data
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading state
        const response = await fetch(API_URL, { signal: controller.signal });
  
        // Check if the response is successful
        if (!response.ok) {
          throw new Error('Failed to fetch objects');
        }
  
        const data = await response.json();
  
        // If no data is returned from the backend, use custom models
        if (data.length === 0) {
          console.warn('No data available from the backend, using custom models.');
          setObjects(customModels); // Use custom models
        } else {
          // Combine API data with custom models
          setObjects([...data, ...customModels]); 
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching objects:', error);
          console.log('Using custom models as fallback');
          setObjects(customModels); // Use custom models on error
        }
      } finally {
        setLoading(false); // Stop loading state
      }
    };
  
    fetchData(); // Call the fetch function
  
    return () => controller.abort(); // Abort the fetch on component unmount
  }, []);

  // Modified setupScene to handle embedded models
  const setupScene = useCallback(() => {
    if (!selectedObject || !mountRef.current) return;

    // If this is an embedded model (like from Sketchfab), handle differently
    if (selectedObject.is_embedded && selectedObject.embed_code) {
      const cleanupScene = () => {
        // Clean up existing Three.js scene if it exists
        if (sceneRef.current) {
          // Dispose of all objects and textures
          // ... existing cleanup code ...
        }
        if (mountRef.current) {
          mountRef.current.innerHTML = '';
        }
      };

      cleanupScene();
      setModelLoaded(true);

      // Create wrapper for the embedded iframe
      const embedWrapper = document.createElement('div');
      embedWrapper.className = 'embed-wrapper';
      embedWrapper.style.width = '100%';
      embedWrapper.style.height = '100%';
      embedWrapper.innerHTML = selectedObject.embed_code;
      
      // Add the embedded content
      if (mountRef.current) {
        mountRef.current.appendChild(embedWrapper);
      }

      return () => {
        if (mountRef.current) {
          mountRef.current.innerHTML = '';
        }
      };
    } else {
      // Handle regular GLTF models with Three.js renderer
      // ... existing setupScene code for GLTF models ...

      const cleanupScene = () => {
        // Clean up existing scene
        if (sceneRef.current) {
          try {
            sceneRef.current.traverse((object) => {
              if (object.geometry) object.geometry.dispose();
              if (object.material) {
                if (Array.isArray(object.material)) {
                  object.material.forEach(material => material.dispose());
                } else {
                  object.material.dispose();
                }
              }
              if (object.dispose) object.dispose();
            });
          } catch (e) {
            console.error("Error disposing scene objects:", e);
          }
        }

        if (rendererRef.current) {
          try {
            rendererRef.current.dispose();
            rendererRef.current.forceContextLoss();
            rendererRef.current = null;
          } catch (e) {
            console.error("Error disposing renderer:", e);
          }
        }

        if (controlsRef.current) {
          try {
            controlsRef.current.dispose();
            controlsRef.current = null;
          } catch (e) {
            console.error("Error disposing controls:", e);
          }
        }
        if (mountRef.current) {
          mountRef.current.innerHTML = '';
        }
      };

      cleanupScene();
      setModelLoaded(false);

      try {
        // Create new scene, camera, and renderer
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(darkMode ? 0x202020 : 0xffffff);
        
        const camera = new THREE.PerspectiveCamera(
          75,
          mountRef.current.clientWidth / mountRef.current.clientHeight,
          0.1,
          1000
        );
        
        // Try to create renderer with proper error handling
        let renderer;
        try {
          renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: true
          });
          renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio to prevent performance issues
          renderer.outputColorSpace = THREE.SRGBColorSpace;
        } catch (e) {
          console.error("WebGL Renderer creation failed:", e);
          setWebGLError(true);
          return;
        }
        
        // Add lights to the scene
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        // Attach renderer to DOM
        if (mountRef.current) {
          mountRef.current.innerHTML = '';
          mountRef.current.appendChild(renderer.domElement);
        }

        // Add orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;

        // Save references
        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;
        controlsRef.current = controls;

        // Show loading indicator
        const loadingElem = document.createElement('div');
        loadingElem.className = 'model-loading';
        loadingElem.textContent = 'Loading 3D model...';
        mountRef.current.appendChild(loadingElem);

        // Load the model based on selectedObject
        const loader = new GLTFLoader();
        const modelUrl = selectedObject.model_url || "./Models/martinskapelle_new.glb";
        
        loader.load(
          modelUrl,
          (gltf) => {
            try {
              // Remove loading indicator
              if (loadingElem.parentNode) {
                loadingElem.parentNode.removeChild(loadingElem);
              }

              const model = gltf.scene;
              scene.add(model);
              
              // Save reference to the model for download functionality
              modelRef.current = model.clone(); // Create a clone to ensure we have a clean copy for export
              setModelLoaded(true);

              // Compute bounding box to center camera
              const box = new THREE.Box3().setFromObject(model);
              const size = box.getSize(new THREE.Vector3()).length();
              const center = box.getCenter(new THREE.Vector3());

              // Position camera to view the entire model
              camera.position.set(center.x, center.y, center.z + size * 1.5);
              camera.lookAt(center);
              
              // Set controls target to center of the model
              controls.target.set(center.x, center.y, center.z);
              controls.update();
            } catch (e) {
              console.error("Error processing loaded model:", e);
              if (loadingElem.parentNode) {
                loadingElem.textContent = 'Error processing model';
              }
            }
          },
          (xhr) => {
            // Update loading progress if needed
            const percentComplete = Math.round((xhr.loaded / xhr.total) * 100);
            if (loadingElem) {
              loadingElem.textContent = `Loading 3D model: ${percentComplete}%`;
            }
          },
          (error) => {
            console.error('Error loading 3D model:', error);
            if (loadingElem.parentNode) {
              loadingElem.textContent = 'Error loading model';
            }
          }
        );

        // Animation loop
        let animationFrameId;
        const animate = () => {
          try {
            animationFrameId = requestAnimationFrame(animate);
            
            if (controlsRef.current) {
              controlsRef.current.update();
            }
            
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
              rendererRef.current.render(sceneRef.current, cameraRef.current);
            } else {
              cancelAnimationFrame(animationFrameId);
            }
          } catch (e) {
            console.error("Render loop error:", e);
            cancelAnimationFrame(animationFrameId);
            setWebGLError(true);
          }
        };
        
        animate();

        // Cleanup function
        return () => {
          cancelAnimationFrame(animationFrameId);
          cleanupScene();
        };
      } catch (e) {
        console.error("Scene setup error:", e);
        setWebGLError(true);
        return () => {};
      }
    }
  }, [selectedObject, darkMode]);

  // Update scene background when dark mode changes
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(darkMode ? 0x202020 : 0xffffff);
    }
  }, [darkMode]);

  // Initialize or update scene when selected object changes
  useEffect(() => {
    if (!selectedObject) return;
    
    const cleanup = setupScene();
    return cleanup;
  }, [selectedObject, setupScene]);

  // Resize handler
  const handleResize = useCallback(() => {
    if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
    
    // Update camera aspect ratio
    cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
    cameraRef.current.updateProjectionMatrix();
    
    // Update renderer size
    rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
  }, []);

  // Add resize event listener
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

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
  const materialOptions = ['All Materials', ...new Set(objects.filter(obj => obj.material).map(obj => obj.material))];

  // Filter objects based on search term and selected material
  const filteredObjects = objects.filter(obj => {
    const matchesSearch = !searchTerm || 
      (obj.name && obj.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (obj.description && obj.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (obj.material && obj.material.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMaterial = filter === 'All Materials' || obj.material === filter;
    
    return matchesSearch && matchesMaterial;
  });

  // Modify downloadModel function to handle embedded models
  const downloadModel = () => {
    if (selectedObject && selectedObject.is_embedded) {
      // For embedded models, redirect to original source
      window.open(`https://sketchfab.com/3d-models/human-insulin-molecular-model-and-sonification-0ba70b315d984ac294f24bc9f4549fc2`, '_blank');
      return;
    }
    
    if (!modelRef.current || !selectedObject || webGLError) return;
    
    setDownloading(true);
    
    try {
      // Create a new exporter
      const exporter = new GLTFExporter();
      
      // Export the current model
      exporter.parse(
        modelRef.current,
        (gltf) => {
          try {
            // Create a Blob from the exported GLB
            const blob = new Blob([gltf], { type: 'application/octet-stream' });
            
            // Create a download link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${selectedObject.name || 'model'}.glb`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (e) {
            console.error("Error creating download link:", e);
          } finally {
            setDownloading(false);
          }
        },
        (error) => {
          console.error('Error exporting model:', error);
          setDownloading(false);
        },
        { binary: true } // Export as binary GLB
      );
    } catch (e) {
      console.error("Error initiating export:", e);
      setDownloading(false);
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
              <span className="stat-number">{objects.length}</span>
              <span className="stat-label">3D Models</span>
            </div>
            {/* <div className="stat-item">
              <span className="stat-number">{new Set(objects.filter(obj => obj.material).map(obj => obj.material)).size}</span>
              <span className="stat-label">Materials</span>
            </div> */}
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
                disabled={webGLError}
              >
                Fullscreen
              </button>
              <button
                className="btn-secondary"
                onClick={() => setMetadataVisible(!metadataVisible)}
              >
                {metadataVisible ? 'Hide Info' : 'Show Info'}
              </button>
              <button
                className={`download-btn ${(!modelLoaded || downloading || webGLError) ? 'disabled' : ''}`}
                onClick={downloadModel}
                disabled={!modelLoaded || downloading || webGLError}
              >
                {downloading ? 'Downloading...' : 'Download Model'}
              </button>
            </div>

            <div className="model-viewer" ref={mountRef}>
              {loading ? (
                <div className="loading-spinner"></div>
              ) : !selectedObject ? (
                <div className="select-model-message">
                  <p>Select an artifact from the list below to view</p>
                </div>
              ) : webGLError ? (
                <div className="webgl-error-message">
                  <p>WebGL rendering error. Please try a different browser or device.</p>
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

        .download-btn.disabled {
          background-color: #cccccc;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .dark-mode .download-btn {
          background-color: #3a8a3e;
        }

        .dark-mode .download-btn:hover {
          background-color: #327a36;
        }

        .dark-mode .download-btn.disabled {
          background-color: #555555;
        }

        .webgl-error-message {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 20px;
          text-align: center;
          background-color: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.3);
          border-radius: 4px;
        }

        .webgl-error-message p {
          color: #d32f2f;
          font-weight: 500;
        }

        .dark-mode .webgl-error-message {
          background-color: rgba(255, 0, 0, 0.2);
        }

        .dark-mode .webgl-error-message p {
          color: #ff6659;
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