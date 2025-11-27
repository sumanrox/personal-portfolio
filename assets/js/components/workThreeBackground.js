/**
 * Three.js Abstract Background for Research Section
 * Studio-grade particle network animation
 */

export function initWorkThreeBackground() {
  // Check if Three.js is available
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded, skipping work background animation');
    return;
  }

  const canvas = document.getElementById('work-three-canvas');
  if (!canvas) {
    console.warn('Work canvas not found');
    return;
  }

  const section = document.getElementById('work');
  if (!section) return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true,
    antialias: true 
  });

  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  camera.position.z = 50;

  // Particle system
  const particleCount = 150;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];
  const colors = new Float32Array(particleCount * 3);

  // Color palette for particles
  const colorPalette = [
    new THREE.Color(0xff0000), // Red
    new THREE.Color(0xff6b00), // Orange
    new THREE.Color(0x3b82f6), // Blue
    new THREE.Color(0x000000), // Black
    new THREE.Color(0x6b7280), // Gray
  ];

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Random positions
    positions[i3] = (Math.random() - 0.5) * 100;
    positions[i3 + 1] = (Math.random() - 0.5) * 100;
    positions[i3 + 2] = (Math.random() - 0.5) * 60;

    // Random velocities
    velocities.push({
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.01
    });

    // Random colors from palette
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Particle material
  const particleMaterial = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });

  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);

  // Create connections between nearby particles
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending
  });

  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = new Float32Array(particleCount * particleCount * 6);
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  // Animation loop
  let animationId;
  let time = 0;

  function updateConnections() {
    const positions = particleSystem.geometry.attributes.position.array;
    const linePositions = lines.geometry.attributes.position.array;
    let lineIndex = 0;
    const maxDistance = 15;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const x1 = positions[i3];
      const y1 = positions[i3 + 1];
      const z1 = positions[i3 + 2];

      for (let j = i + 1; j < particleCount; j++) {
        const j3 = j * 3;
        const x2 = positions[j3];
        const y2 = positions[j3 + 1];
        const z2 = positions[j3 + 2];

        const dx = x1 - x2;
        const dy = y1 - y2;
        const dz = z1 - z2;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < maxDistance) {
          linePositions[lineIndex++] = x1;
          linePositions[lineIndex++] = y1;
          linePositions[lineIndex++] = z1;
          linePositions[lineIndex++] = x2;
          linePositions[lineIndex++] = y2;
          linePositions[lineIndex++] = z2;
        }
      }
    }

    // Fill remaining with zeros
    while (lineIndex < linePositions.length) {
      linePositions[lineIndex++] = 0;
    }

    lines.geometry.attributes.position.needsUpdate = true;
  }

  function animate() {
    animationId = requestAnimationFrame(animate);
    time += 0.001;

    const positions = particleSystem.geometry.attributes.position.array;

    // Update particle positions
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      positions[i3] += velocities[i].x;
      positions[i3 + 1] += velocities[i].y;
      positions[i3 + 2] += velocities[i].z;

      // Boundary check and bounce
      if (Math.abs(positions[i3]) > 50) velocities[i].x *= -1;
      if (Math.abs(positions[i3 + 1]) > 50) velocities[i].y *= -1;
      if (Math.abs(positions[i3 + 2]) > 30) velocities[i].z *= -1;
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
    updateConnections();

    // Gentle rotation
    particleSystem.rotation.y = time * 0.1;
    particleSystem.rotation.x = Math.sin(time * 0.5) * 0.1;

    renderer.render(scene, camera);
  }

  animate();

  // Handle resize
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }, 250);
  }

  window.addEventListener('resize', handleResize);

  // Cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    renderer.dispose();
    particleMaterial.dispose();
    lineMaterial.dispose();
    particles.dispose();
    lineGeometry.dispose();
  };
}
