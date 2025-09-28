import React from 'react';
import Layout from '@/components/Layout';
import MinecraftStatus from '@/components/MinecraftStatus';
import PlayerList from '@/components/PlayerList';
import Leaderboard from '@/components/Leaderboard';

export default function MinecraftPage() {
  return (
    <Layout title="Minecraft - Ducks In A Barrel & Co." particleType="creeper">
      <div>
        {/* Welcome Section */}
        <div className="max-w-6xl mx-auto px-6 mb-44 mt-36">
          <h2 className="text-3xl font-orbitron font-bold text-white mb-6 text-center underline shining-text">
            Join Us On Minecraft!
          </h2>
          
          <div className="text-gray-300 leading-relaxed space-y-4 mb-8 mt-8">
            <p>
              Dive into Better MC BMC5, the ultimate Vanilla+ modpack for Minecraft 1.21.1 on NeoForge! Designed with players like you in mind, this fresh take on the Better MC series enhances your survival adventure without overwhelming the core game. Expect seamless exploration, RPG elements, and a host of quality-of-life tweaks that make every world feel alive and immersive.
            </p>
          </div>

          {/* Modpack Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Modpack Version */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h4 className="text-lg font-orbitron font-medium text-purple-400 mb-3 underline shining-text">
                Modpack Version
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong>Better MC BMC5</strong><br />
                Version: <span className="text-purple-400 font-semibold">21.1.208</span><br />
                Minecraft: <span className="text-purple-400 font-semibold">1.21.1</span><br />
                Platform: <span className="text-purple-400 font-semibold">NeoForge</span>
              </p>
            </div>

            {/* System Requirements */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h4 className="text-lg font-orbitron font-medium text-purple-400 mb-3 underline shining-text">
                Minimum Requirements
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong>RAM:</strong> 6GB allocated minimum<br />
                <strong>Recommended:</strong> 8GB+ allocated<br />
                <strong>Java:</strong> Java 21 or higher<br />
                <strong>Storage:</strong> 4GB+ free space
              </p>
            </div>

            {/* Download Link */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h4 className="text-lg font-orbitron font-medium text-purple-400 mb-3 underline shining-text">
                Download Modpack
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Get the official modpack from CurseForge and start your enhanced survival adventure today!
              </p>
              <a 
                href="https://www.curseforge.com/minecraft/modpacks/better-mc-neoforge-bmc5"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shining-text"
              >
                Download on CurseForge
              </a>
            </div>
          </div>
        </div>

        {/* Server Integration Section */}
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <h2 className="text-3xl font-orbitron font-bold text-white mb-6 text-center underline shining-text">
            Live Server Info
          </h2>
        </div>

        {/* Server Status and Player List - Top Row */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MinecraftStatus serverAddress="DucksAtTheNightclub.exaroton.me" />
            <PlayerList serverAddress="DucksAtTheNightclub.exaroton.me" />
          </div>
        </div>



        {/* Leaderboard - Full Width */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <Leaderboard serverAddress="DucksAtTheNightclub.exaroton.me" />
        </div>
      </div>
    </Layout>
  );
}
