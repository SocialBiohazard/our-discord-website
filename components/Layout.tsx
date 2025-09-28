import React from 'react';
import Head from 'next/head';
import { NeonButton } from './NeonButton';
import ParticleBackground from './ParticleBackground';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  particleType?: 'duck' | 'creeper';
}

export default function Layout({ 
  children, 
  title = "Ducks In A Barrel & Co.", 
  description = "Discord, Minecraft, and Hall of Fame integration portal",
  particleType = 'duck'
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-black relative">
        {/* Particle Background */}
        <ParticleBackground particleType={particleType} />
        
        {/* Global Navigation */}
        <nav className="flex justify-center gap-6 pt-8 mb-12 relative z-10">
          <NeonButton href="/" variant="cyan">DISCORD</NeonButton>
          <NeonButton href="/minecraft" variant="pink">MINECRAFT</NeonButton>
          <NeonButton href="/hall-of-fame" variant="yellow">HALL OF FAME</NeonButton>
        </nav>

        {/* Page Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </>
  );
}
