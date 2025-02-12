import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './index.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [metadataVisible, setMetadataVisible] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const mountRef = useRef(null);

  // Fetch data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/objects');
        if (!response.ok) {
          throw new Error('Failed to fetch objects');
        }
        const data = await response.json();
        setObjects(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching objects:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!selectedObject) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0xffffff);

    if (mountRef.current) {
      mountRef.current.innerHTML = '';
      mountRef.current.appendChild(renderer.domElement);
    }

    // Add Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10).normalize();
    scene.add(light);

    // Load 3D Model
    const loader = new GLTFLoader();
    loader.load("/Models/martinskapelle_new.glb", (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());

      camera.position.set(center.x, center.y, size * 1.5);
      camera.lookAt(center);
    });

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle Window Resize
    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup Function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, [selectedObject]);

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">Algoma University 3D Archive</div>
        <div className={`nav-links ${isNavOpen ? 'open' : ''}`}>
          <a href="#home">Home</a>
          <a href="#explore">Explore</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <button 
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
        <div 
          className="hamburger-menu"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          ☰
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Explore 3D Artifacts</h1>
          <p>Discover historical treasures from Wishart Library's collection</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="content-container">
        {/* Search and Filters */}
        <div className="search-filter">
          <input 
            type="text" 
            placeholder="Search artifacts..." 
            className="search-bar"
          />
          <select className="filter-dropdown">
            <option>All Materials</option>
            <option>Ceramic</option>
            <option>Stone</option>
          </select>
        </div>

        {/* 3D Viewer Section */}
        <div className="viewer-container">
          <div className="viewer-controls">
            <button className="btn-primary">Fullscreen</button>
            <button 
              className="btn-secondary"
              onClick={() => setMetadataVisible(!metadataVisible)}
            >
              {metadataVisible ? 'Hide Info' : 'Show Info'}
            </button>
          </div>
          
          {/* 3D Viewer Placeholder */}
          <div className="model-viewer" ref={mountRef}>
            {loading ? (
              <div className="loading-spinner"></div>
            ) : selectedObject ? (
              <div className="model-placeholder">
                {/* 3D model will be rendered here */}
              </div>
            ) : (
              <p>Select an artifact to view</p>
            )}
          </div>
        </div>

        {/* Thumbnail Gallery (Table Format) */}
        <div className="thumbnail-table-container">
          {loading ? (
            <p>Loading artifacts...</p>
          ) : objects.length > 0 ? (
            <table className="thumbnail-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Material</th>
                </tr>
              </thead>
              <tbody>
                {objects.map(obj => (
                  <tr 
                    key={obj.id} 
                    className="thumbnail-row"
                    onClick={() => setSelectedObject(obj)}
                  >
                    <td className="thumbnail-image-cell">
                      <div className="thumbnail-image"></div>
                    </td>
                    <td>{obj.name}</td>
                    <td>{obj.date}</td>
                    <td>{obj.description}</td>
                    <td>{obj.material}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No artifacts found.</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#privacy" className="footer-btn">Privacy Policy</a>
            <a href="#terms" className="footer-btn">Terms of Use</a>
            <a href="#contact" className="footer-btn">Contact</a>
          </div>
          <div className="social-icons">
            {/* Add social media icons here */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;