import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './index.css'; // Make sure to import the CSS file

function App() {
  const [metadata, setMetadata] = useState(null);
  const mountRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/objects")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Metadata:", data);
        if (data.length > 0) {
          setMetadata(data[0]);
        } else {
          console.warn("API returned empty array");
          setMetadata(null);
        }
      })
      .catch((error) => console.error('Error fetching metadata:', error));

    // Initialize Three.js Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
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
    loader.load('/models/martinskapelle_new.glb', (gltf) => {
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
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup Function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div>
      {/* Header */}
      <header>
        <h1>3D Object Viewer</h1>
        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* Hero Section with 3D object */}
      <div className="hero">
        <div id="3d-container" ref={mountRef} />
      </div>

      {/* Metadata Table */}
      {metadata ? (
        <div className="metadata-table">
          <h2>Object Metadata</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Date</th>
                <th>Material</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{metadata.name}</td>
                <td>{metadata.description}</td>
                <td>{metadata.date}</td>
                <td>{metadata.material}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p>No metadata available</p>
      )}

      {/* Footer */}
      <footer>
        <p>&copy; 2025 3D Object Viewer. All rights reserved.</p>
        <p>
          <a href="#privacy-policy">Privacy Policy</a> | <a href="#terms-of-service">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
