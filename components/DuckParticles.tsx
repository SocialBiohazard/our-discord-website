import React, { useEffect, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

const DuckParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 24; i++) {
        particlesRef.current.push({
          id: i,
          x: Math.random() * containerRect.width,
          y: Math.random() * containerRect.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 15 + 20, // 20-35px
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 2,
        });
      }
    };

    // Create particle elements
    const createParticleElements = () => {
      // Clear existing particles
      container.innerHTML = '';

      particlesRef.current.forEach((particle) => {
        const element = document.createElement('div');
        element.className = 'duck-particle';
        element.style.position = 'absolute';
        element.style.width = `${particle.size}px`;
        element.style.height = `${particle.size}px`;
        element.style.backgroundImage = 'url(/duck-simple.svg)';
        element.style.backgroundSize = 'contain';
        element.style.backgroundRepeat = 'no-repeat';
        element.style.backgroundPosition = 'center';
        element.style.opacity = '0.4';
        element.style.filter = 'hue-rotate(280deg) saturate(1.5)'; // Make it purple
        element.style.pointerEvents = 'none';
        element.style.transition = 'opacity 0.3s ease';
        element.id = `particle-${particle.id}`;
        container.appendChild(element);
      });
    };

    // Animation loop
    const animate = () => {
      const containerRect = container.getBoundingClientRect();

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;

        // Boundary checks - wrap around
        if (particle.x < -particle.size) particle.x = containerRect.width;
        if (particle.x > containerRect.width) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = containerRect.height;
        if (particle.y > containerRect.height) particle.y = -particle.size;

        // Update DOM element
        const element = document.getElementById(`particle-${particle.id}`);
        if (element) {
          element.style.left = `${particle.x}px`;
          element.style.top = `${particle.y}px`;
          element.style.transform = `rotate(${particle.rotation}deg)`;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      particlesRef.current.forEach((particle) => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx -= (dx / distance) * force * 0.01;
          particle.vy -= (dy / distance) * force * 0.01;
        }

        // Damping to prevent particles from going too fast
        particle.vx *= 0.99;
        particle.vy *= 0.99;
      });
    };

    // Handle window resize
    const handleResize = () => {
      const newRect = container.getBoundingClientRect();
      particlesRef.current.forEach((particle) => {
        if (particle.x > newRect.width) particle.x = newRect.width - particle.size;
        if (particle.y > newRect.height) particle.y = newRect.height - particle.size;
      });
    };

    initParticles();
    createParticleElements();
    animate();

    container.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default DuckParticles;
