import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './index.css';

// API URL Constant
const API_URL = 'http://localhost:5000/api/objects';

const Navbar = ({ isNavOpen, setIsNavOpen, darkMode, setDarkMode }) => (
  <nav className="navbar">
    <div className="nav-brand">Algoma University 3D Archive</div>
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

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  // Fetch Data
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Failed to fetch objects');
        }

        const data = await response.json();
        
        // If no data is available, use sample data for development
        if (data.length === 0) {
          const sampleData = [
            {
              id: 1,
              name: "Ceremonial Vessel",
              date: "c. 1500-1600",
              description: "A ceremonial vessel used in traditional ceremonies.",
              material: "Ceramic",
              model_url: "/Models/martinskapelle_new.glb"
            },
            {
              id: 2,
              name: "Stone Arrowhead",
              date: "c. 800-1000",
              description: "Finely crafted stone arrowhead with serrated edges.",
              material: "Stone",
              model_url: "/Models/martinskapelle_new.glb"
            }
          ];
          setObjects(sampleData);
        } else {
          setObjects(data);
        }
        setLoading(false);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching objects:', error);
          
          // Use sample data on error for development
          const sampleData = [
            {
              id: 1,
              name: "Ceremonial Vessel",
              date: "c. 1500-1600",
              description: "A ceremonial vessel used in traditional ceremonies.",
              material: "Ceramic",
              model_url: "/Models/martinskapelle_new.glb"
            },
            {
              id: 2,
              name: "Stone Arrowhead",
              date: "c. 800-1000",
              description: "Finely crafted stone arrowhead with serrated edges.",
              material: "Stone",
              model_url: "/Models/martinskapelle_new.glb"
            }
          ];
          setObjects(sampleData);
        }
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  // Initialize or Reinitialize Three.js Scene when a new object is selected
  useEffect(() => {
    if (!selectedObject) return;

    // Dispose previous scene if it exists
    const cleanupScene = () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };

    cleanupScene();

    // Create new scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(darkMode ? 0x202020 : 0xffffff);
    
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add lights to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Attach renderer to DOM
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

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
    const modelUrl = selectedObject.model_url || "/Models/martinskapelle_new.glb";
    
    loader.load(
      modelUrl,
      (gltf) => {
        // Remove loading indicator
        if (loadingElem.parentNode) {
          loadingElem.parentNode.removeChild(loadingElem);
        }

        const model = gltf.scene;
        scene.add(model);

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
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      } else {
        cancelAnimationFrame(animationId);
      }
    };
    
    animate();

    // Cleanup function
    return () => {
      cleanupScene();
    };
  }, [selectedObject, darkMode]);

  // Update scene background when dark mode changes
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(darkMode ? 0x202020 : 0xffffff);
    }
  }, [darkMode]);

  // Resize handler
  const handleResize = useCallback(() => {
    if (cameraRef.current && mountRef.current && rendererRef.current) {
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    }
  }, []);

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

  // Filter objects based on search term and material filter
  const filteredObjects = objects.filter(obj => {
    const matchesSearch = obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          obj.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All Materials' || obj.material === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Get unique materials for filter dropdown
  const materialOptions = ['All Materials', ...new Set(objects.map(obj => obj.material))];

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar 
        isNavOpen={isNavOpen} 
        setIsNavOpen={setIsNavOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <section className="hero">
        <div className="hero-content">
          <h1>Explore 3D Artifacts</h1>
          <p>Discover historical treasures from Wishart Library's collection</p>
        </div>
      </section>

      <main className="content-container">
        <div className="search-filter">
          <input 
            type="text" 
            placeholder="Search artifacts..." 
            className="search-bar" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="filter-dropdown"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {materialOptions.map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
        </div>

        <div className="viewer-metadata-container">
          <div className="viewer-container">
            <div className="viewer-controls">
              <button className="btn-primary" onClick={toggleFullscreen}>Fullscreen</button>
              <button
                className="btn-secondary"
                onClick={() => setMetadataVisible(!metadataVisible)}
              >
                {metadataVisible ? 'Hide Info' : 'Show Info'}
              </button>
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
                        <div className="thumbnail-image"></div>
                      </td>
                      <td>{obj.name}</td>
                      <td>{obj.date}</td>
                      <td className="hide-on-mobile">{obj.description}</td>
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
    </div>
  );
};

export default App;