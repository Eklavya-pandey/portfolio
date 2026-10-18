import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * MeridianScene3D
 * Signature Architectural Kinetic System Monolith.
 * Represents digital craftsmanship, modular design systems, and multi-platform fintech interfaces.
 * Features nested spatial viewports, modular component prisms, and a central refractive core.
 */
export default function MeridianScene3D({ scrollProgress = 0, currentPage = 'home' }) {
  const containerRef = useRef(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;
  const pageRef = useRef(currentPage);
  pageRef.current = currentPage;
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        powerPreference: 'high-performance',
        antialias: true,
        alpha: true
      });
    } catch (err) {
      console.warn('[MERIDIAN 3D] WebGL initialization error:', err);
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const maxPixelRatio = window.innerWidth < 768 ? 1.5 : 2;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    // Master Architectural Assembly Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Modular Subgroups
    const viewportFront = new THREE.Group();
    const viewportMid = new THREE.Group();
    const viewportBack = new THREE.Group();
    const modulesGroup = new THREE.Group();
    const coreGroup = new THREE.Group();

    masterGroup.add(viewportBack);
    masterGroup.add(viewportMid);
    masterGroup.add(coreGroup);
    masterGroup.add(modulesGroup);
    masterGroup.add(viewportFront);

    // 1. Premium Materials
    const goldSpecularMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xE0BA55,
      metalness: 0.94,
      roughness: 0.16,
      reflectivity: 0.95,
      clearcoat: 0.8,
      clearcoatRoughness: 0.12
    });

    const glassSlabMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0E0E16,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.85,
      thickness: 0.5,
      transparent: true,
      opacity: 0.88,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08
    });

    const brushedTitanium = new THREE.MeshStandardMaterial({
      color: 0x7E7E90,
      metalness: 0.85,
      roughness: 0.3
    });

    const wireframeGold = new THREE.MeshBasicMaterial({
      color: 0xF3D27E,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });

    const coreCrystalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0A0A10,
      metalness: 0.6,
      roughness: 0.08,
      reflectivity: 0.98,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });

    // 2. Geometries: Spatial Viewport Slabs (Representing Interface Screens & Canvas)
    const slabGeo = new THREE.BoxGeometry(3.6, 2.3, 0.05);

    // Beveled Edge Frames for Viewports
    const edgeGeo = new THREE.EdgesGeometry(slabGeo);
    const goldEdgeMat = new THREE.LineBasicMaterial({ color: 0xE0BA55, transparent: true, opacity: 0.65 });

    const frontMesh = new THREE.Mesh(slabGeo, glassSlabMaterial);
    const frontLine = new THREE.LineSegments(edgeGeo, goldEdgeMat);
    viewportFront.add(frontMesh);
    viewportFront.add(frontLine);

    const midMesh = new THREE.Mesh(slabGeo, glassSlabMaterial);
    const midLine = new THREE.LineSegments(edgeGeo, goldEdgeMat);
    viewportMid.add(midMesh);
    viewportMid.add(midLine);

    const backMesh = new THREE.Mesh(slabGeo, glassSlabMaterial);
    const backLine = new THREE.LineSegments(edgeGeo, goldEdgeMat);
    viewportBack.add(backMesh);
    viewportBack.add(backLine);

    // Initial subtle layer spacing
    viewportFront.position.z = 0.25;
    viewportMid.position.z = 0;
    viewportBack.position.z = -0.25;

    // 3. Central Crystalline Hub (The creative lens)
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 0);
    const coreMesh = new THREE.Mesh(coreGeo, coreCrystalMaterial);
    const coreWire = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 0), wireframeGold);
    coreGroup.add(coreMesh);
    coreGroup.add(coreWire);

    // 4. Floating Modular Component Prisms (Representing Design Tokens & System Modules)
    const modulePrisms = [];
    const moduleGeo = new THREE.BoxGeometry(0.5, 0.35, 0.12);
    const moduleEdges = new THREE.EdgesGeometry(moduleGeo);

    const modulePositions = [
      { x: -1.4, y: 0.8, z: 0.4 },
      { x: 1.4, y: 0.8, z: -0.4 },
      { x: -1.4, y: -0.8, z: -0.3 },
      { x: 1.4, y: -0.8, z: 0.5 }
    ];

    modulePositions.forEach((pos) => {
      const pGroup = new THREE.Group();
      const pMesh = new THREE.Mesh(moduleGeo, goldSpecularMaterial);
      const pLine = new THREE.LineSegments(moduleEdges, goldEdgeMat);
      pGroup.add(pMesh);
      pGroup.add(pLine);
      pGroup.position.set(pos.x, pos.y, pos.z);
      modulesGroup.add(pGroup);
      modulePrisms.push({ group: pGroup, origPos: { ...pos } });
    });

    // 5. Precision Gimbal Ring Frame
    const gimbalGeo = new THREE.TorusGeometry(2.8, 0.032, 24, 100);
    const gimbalMesh = new THREE.Mesh(gimbalGeo, brushedTitanium);
    masterGroup.add(gimbalMesh);

    // 6. Minimal Ambient Stardust
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 16;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xE0BA55,
      size: 0.03,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Lighting
    const ambientLight = new THREE.AmbientLight(0x0C0C14, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFE8B0, 3.2);
    keyLight.position.set(7, 9, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x4A6D96, 2.4);
    rimLight.position.set(-8, -6, -6);
    scene.add(rimLight);

    const coreLight = new THREE.PointLight(0xE0BA55, 2.0, 7);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Resize Handling
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.fov = w < 768 ? 52 : 40;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Visibility Handling
    let animId;
    let isVisible = true;
    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let clock = new THREE.Clock();

    // Choreographed Render Loop
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();
      const p = scrollRef.current; // Normalized progress [0, 1]

      // Smooth mouse lerping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      if (!prefersReducedMotion) {
        // Continuous subtle internal rotation
        coreMesh.rotation.y += 0.005;
        coreWire.rotation.y -= 0.003;
        coreMesh.rotation.x += 0.003;
        gimbalMesh.rotation.z += 0.002;
        particles.rotation.y += 0.0005;

        // Dynamic State Transitions Across 6 Sections:
        let targetX = 0;
        let targetY = 0;
        let targetZ = 0;
        let targetScale = 1;
        let targetRotX = 0.35 + p * Math.PI * 0.8;
        let targetRotY = 0.55 + p * Math.PI * 1.2;

        const curPage = pageRef.current || 'home';

        if (curPage === 'home') {
          // Signature Assembled Monolith on right, gentle drift as user scrolls
          targetX = window.innerWidth > 1024 ? 1.55 : 0;
          targetY = Math.sin(elapsed * 0.75) * 0.12 - p * 0.4;
          targetZ = -p * 0.5;
          targetScale = 1.05 - p * 0.12;

          viewportFront.position.z = 0.25 + p * 0.3;
          viewportBack.position.z = -0.25 - p * 0.3;
          viewportFront.rotation.y = p * 0.1;
          viewportBack.rotation.y = -p * 0.1;

          modulePrisms.forEach((m) => {
            m.group.position.set(m.origPos.x, m.origPos.y, m.origPos.z);
          });
        } else if (curPage === 'work') {
          // Exploded Architectural perspective layered on right edge
          targetX = window.innerWidth > 1024 ? 2.3 : 0;
          targetY = -0.15 + Math.sin(elapsed * 0.6) * 0.08 - p * 0.3;
          targetZ = -0.8;
          targetScale = 0.92;

          viewportFront.position.z = 0.7 + p * 0.4;
          viewportBack.position.z = -0.7 - p * 0.4;
          viewportFront.rotation.y = 0.18;
          viewportBack.rotation.y = -0.18;

          modulePrisms.forEach((m) => {
            m.group.position.x = m.origPos.x * 1.35;
            m.group.position.y = m.origPos.y * 1.35;
            m.group.position.z = m.origPos.z * 1.6;
          });
        } else if (curPage === 'about') {
          // Orthogonal Precision alignment matching Design Systems & timeline
          targetX = window.innerWidth > 1024 ? -2.2 : 0;
          targetY = Math.sin(elapsed * 0.65) * 0.1;
          targetZ = 0;
          targetScale = 0.95;
          targetRotX = 0;
          targetRotY = Math.PI / 2 + p * 0.5;

          viewportFront.position.z = 0.35;
          viewportBack.position.z = -0.35;
          viewportFront.rotation.y = 0;
          viewportBack.rotation.y = 0;

          modulePrisms.forEach((m) => {
            m.group.position.set(m.origPos.x, m.origPos.y, m.origPos.z);
          });
        } else if (curPage === 'contact') {
          // Re-converged into Minimal Monolith Seal
          targetX = 0;
          targetY = -0.2;
          targetZ = 0.2;
          targetScale = 1.0 + Math.sin(elapsed * 1.1) * 0.03;

          viewportFront.position.z = 0.18;
          viewportBack.position.z = -0.18;
          viewportFront.rotation.y = 0;
          viewportBack.rotation.y = 0;

          modulePrisms.forEach((m) => {
            m.group.position.set(m.origPos.x, m.origPos.y, m.origPos.z);
          });
        }

        // Mobile responsive compensation
        if (window.innerWidth < 768) {
          targetX = 0;
          targetScale *= 0.58;
          targetZ -= 1.8;
        }

        // Apply smooth lerping
        masterGroup.position.x += (targetX + mouseX * 0.45 - masterGroup.position.x) * 0.055;
        masterGroup.position.y += (targetY + mouseY * 0.35 - masterGroup.position.y) * 0.055;
        masterGroup.position.z += (targetZ - masterGroup.position.z) * 0.055;
        masterGroup.scale.setScalar(targetScale);

        masterGroup.rotation.x += (targetRotX - masterGroup.rotation.x) * 0.045;
        masterGroup.rotation.y += (targetRotY - masterGroup.rotation.y) * 0.045;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resource Disposal & Memory Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      slabGeo.dispose();
      edgeGeo.dispose();
      coreGeo.dispose();
      moduleGeo.dispose();
      moduleEdges.dispose();
      gimbalGeo.dispose();
      particleGeo.dispose();

      goldSpecularMaterial.dispose();
      glassSlabMaterial.dispose();
      brushedTitanium.dispose();
      wireframeGold.dispose();
      coreCrystalMaterial.dispose();
      goldEdgeMat.dispose();
      particleMat.dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      {!webglSupported && (
        <div className="meridian-webgl-fallback" />
      )}
    </div>
  );
}
