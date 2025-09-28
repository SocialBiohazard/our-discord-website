import React from 'react';
import Layout from '@/components/Layout';
import DiscordWidget from '@/components/DiscordWidget';
import DiscordEvents from '@/components/DiscordEvents';
import AnnouncementsMirror from '@/components/AnnouncementsMirror';
import SocialsAnnouncementsMirror from '@/components/SocialsAnnouncementsMirror';
import SocialsDiscordEvents from '@/components/SocialsDiscordEvents';
import HeavenlyAnnouncementsMirror from '@/components/HeavenlyAnnouncementsMirror';
import HeavenlyDiscordEvents from '@/components/HeavenlyDiscordEvents';

export default function Home() {
  return (
    <Layout particleType="duck">
      {/* Welcome Section */}
      <div className="max-w-6xl mx-auto px-6 mb-44 mt-36">
          <h2 className="text-3xl font-orbitron font-bold text-white mb-6 text-center underline shining-text">
            Welcome to Ducks in a Barrel – The Coziest Pond on Discord!
          </h2>
          
          <div className="text-gray-300 leading-relaxed space-y-4 mb-8 mt-8">
            <p>
                Dive into the quack-tastic world of Ducks in a Barrel, a vibrant and welcoming Discord community where ducks of all feathers flock together to relax, connect, and share their passions! Our server is a cozy, safe, and fun-filled pond designed for friendly folks who love creativity, gaming, and good vibes. Whether you&apos;re here to chat, showcase your art, join game nights, or simply waddle through our quirky community, there&apos;s a spot in the barrel for you!
            </p>
          </div>

        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h4 className="text-lg font-orbitron font-medium text-purple-400 mb-3 underline shining-text">
                Friendly & Inclusive Vibe
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                We&apos;re all about being kind, respectful, and welcoming to every duck who paddles in. Our community thrives on positivity and mutual respect, with just a splash of playful humor - quackers!
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h4 className="text-lg font-orbitron font-medium text-purple-400 mb-3 underline shining-text">
                Creative & Fun Channels
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                From sharing your latest artwork to diving into gaming sessions, our dedicated channels keep the fun organized and flowing. Show off your creations, join discussions, or hop into voice chats for some lively quacking!
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h4 className="text-lg font-orbitron font-medium text-purple-400 mb-3 underline shining-text">
                Safe & Cozy Environment
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Our pond is a safe-for-work haven. We keep things clean, friendly, and free from drama, ensuring everyone feels comfortable and secure.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h4 className="text-lg font-orbitron font-medium text-purple-400 mb-3 underline shining-text">
                Engaging Events
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                From art contests to game nights, our Lead Ducks host exciting events that bring the community together. Follow their quacks and join the fun!
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h4 className="text-lg font-orbitron font-medium text-purple-400 mb-3 underline shining-text">
                Tight-Knit Community
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Whether you&apos;re a chatty duck or a quiet paddler, you&apos;ll find a warm nest here. Connect with others who share your interests and make new friends in a supportive space.
              </p>
            </div>

            {/* Feature 6 - New Feature */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h4 className="text-lg font-orbitron font-medium text-purple-400 mb-3 underline shining-text">
                Quack-Tastic Memes
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Share and enjoy duck-themed memes that keep the pond bubbling with laughter and creativity!
              </p>
            </div>
          </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mb-12">
          <h2 className="text-3xl font-orbitron font-bold text-white mb-6 text-center underline shining-text">
           Check us out on Discord!
          </h2>
          </div>

      {/* Main Content Container - Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 mb-44">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left - Announcements and Events (3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Announcements Section */}
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h3 className="text-lg font-orbitron font-semibold text-white mb-4">Announcements</h3>
              <AnnouncementsMirror />
            </div>

            {/* Events Section */}
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h3 className="text-lg font-orbitron font-semibold text-white mb-4">Upcoming Events</h3>
              <DiscordEvents />
            </div>
          </div>

          {/* Right - Discord Widget (1 column, aligned with feature grid) */}
          <div className="flex-shrink-0 w-full lg:w-80">
            <div className="sticky top-6">
              <DiscordWidget
                serverId="1390814481872851015"
                width="100%"
                height="600"
                theme="dark"
              />
            </div>
          </div>

        </div>
      </div>

    

      {/* Social's Nightclub Section */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-orbitron font-bold text-white mb-6 text-center underline shining-text">
        Meet our partners and step into Social&apos;s Nightclub!
        </h2>
        
        <div className="text-gray-300 leading-relaxed space-y-4 mb-8">
          <p>
            Step into the neon-lit halls of Social&apos;s Nightclub, the ultimate virtual nightclub where the night never ends! Our server is a buzzing hotspot for music lovers, gamers, creators, and social butterflies looking to vibe, connect, and let loose. Whether you&apos;re here to hit the dance floor, chill in our lounge, showcase your latest creations, or just meet new people under the glow of the virtual lights, you&apos;ll find your place in the club. Grab a drink, join the crowd, and let&apos;s make every night unforgettable!
          </p>
        </div>
      </div>

      {/* Social's Nightclub Discord Content - Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left - Social's Announcements and Events (3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Social's Announcements Section */}
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h3 className="text-lg font-orbitron font-semibold text-white mb-4">Social&apos;s Announcements</h3>
              <SocialsAnnouncementsMirror />
            </div>

            {/* Social's Events Section */}
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h3 className="text-lg font-orbitron font-semibold text-white mb-4">Social&apos;s Upcoming Events</h3>
              <SocialsDiscordEvents />
            </div>
          </div>

          {/* Right Side - Social's Discord Widget (1 column) */}
          <div className="flex-shrink-0 w-full lg:w-80">
            <div className="sticky top-6">
              <DiscordWidget
                serverId="694912331267964961"
                width="100%"
                height="600"
                theme="dark"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Heavenly Domain Header */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-orbitron font-bold text-white text-center underline shining-text">
          Meet our friends at Heavenly Domain!
        </h2>
      </div>

      {/* Heavenly Domain Description */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="bg-gray-900/50 rounded-xl p-8">
          <p className="text-gray-300 leading-relaxed text-center">
            Step into <strong className="text-purple-400">✧ Heavenly Domain ✧</strong>, an 18+ chill community where like-minded souls gather to socialize, share their passion for anime and manga, and dive into epic gaming sessions. This mature server offers a relaxed atmosphere perfect for meaningful conversations, discovering new shows, and connecting with fellow enthusiasts who appreciate both the finer things in digital entertainment and good company.
          </p>
        </div>
      </div>

      {/* Heavenly Domain Discord Content - Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left - Heavenly Announcements and Events (3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Heavenly Announcements Section */}
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h3 className="text-lg font-orbitron font-semibold text-white mb-4">Heavenly Domain Announcements</h3>
              <HeavenlyAnnouncementsMirror />
            </div>

            {/* Heavenly Events Section */}
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h3 className="text-lg font-orbitron font-semibold text-white mb-4">Heavenly Domain Upcoming Events</h3>
              <HeavenlyDiscordEvents />
            </div>
          </div>

          {/* Right Side - Heavenly Discord Widget (1 column) */}
          <div className="flex-shrink-0 w-full lg:w-80">
            <div className="sticky top-6">
              <DiscordWidget
                serverId="1303423213790822521"
                width="100%"
                height="600"
                theme="dark"
              />
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
