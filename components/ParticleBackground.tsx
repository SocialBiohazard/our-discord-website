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

interface ParticleBackgroundProps {
  particleType?: 'duck' | 'creeper';
  particleCount?: number;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ 
  particleType = 'duck', 
  particleCount = 24 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          id: i,
          x: Math.random() * container.clientWidth,
          y: Math.random() * container.clientHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 20 + 15, // 15-35px
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
        element.className = `${particleType}-particle`;
        element.style.position = 'absolute';
        element.style.width = `${particle.size}px`;
        element.style.height = `${particle.size}px`;
        element.style.backgroundSize = 'contain';
        element.style.backgroundRepeat = 'no-repeat';
        element.style.backgroundPosition = 'center';
        element.style.opacity = '0.4';
        element.style.pointerEvents = 'none';
        element.style.transition = 'opacity 0.3s ease';
        element.id = `particle-${particle.id}`;
        
        // Set background image and styling based on particle type
        if (particleType === 'duck') {
          element.style.backgroundImage = 'url(/duck-simple.svg)';
          element.style.filter = 'hue-rotate(280deg) saturate(1.5)'; // Purple duck
        } else if (particleType === 'creeper') {
          element.style.backgroundImage = 'url(/minecraftcreeper.svg)';
          element.style.filter = 'hue-rotate(120deg) saturate(1.2) brightness(0.9)'; // Green creeper
        }
        
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

        // Update rotation
        particle.rotation += particle.rotationSpeed;

        // Wrap around screen edges
        if (particle.x > containerRect.width + particle.size) {
          particle.x = -particle.size;
        }
        if (particle.x < -particle.size) {
          particle.x = containerRect.width + particle.size;
        }
        if (particle.y > containerRect.height + particle.size) {
          particle.y = -particle.size;
        }
        if (particle.y < -particle.size) {
          particle.y = containerRect.height + particle.size;
        }

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
    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = event.clientX - container.offsetLeft;
      const mouseY = event.clientY - container.offsetTop;

      particlesRef.current.forEach((particle) => {
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx += (dx / distance) * force * 0.02;
          particle.vy += (dy / distance) * force * 0.02;
        }

        // Apply damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Limit velocity
        const maxVelocity = 2;
        const velocity = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (velocity > maxVelocity) {
          particle.vx = (particle.vx / velocity) * maxVelocity;
          particle.vy = (particle.vy / velocity) * maxVelocity;
        }
      });
    };

    // Resize handling
    const handleResize = () => {
      initParticles();
      createParticleElements();
    };

    // Initialize
    initParticles();
    createParticleElements();
    animate();

    // Event listeners
    container.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [particleType, particleCount]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'transparent',
        overflow: 'hidden'
      }}
    />
  );
};

export default ParticleBackground;
