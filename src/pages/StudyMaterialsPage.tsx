import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, ArrowRight, Youtube, X } from 'lucide-react';

// Mock data for study materials
const mockMaterials = [
  {
    id: 1,
    subject: 'Physics',
    difficulty: 'Beginner',
    title: 'Kinematics: Motion in One Dimension',
    topic: 'Mechanics',
    type: 'Video Lecture',
    duration: '45 mins',
    badgeColor: 'bg-blue-600',
    subjectColor: 'bg-blue-100 text-blue-700',
    difficultyColor: 'bg-green-100 text-green-700',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    subject: 'Chemistry',
    difficulty: 'Advanced',
    title: 'Organic Chemistry: Reaction Mechanisms',
    topic: 'Organic Chemistry',
    type: 'PDF Notes',
    duration: '32 pages',
    badgeColor: 'bg-purple-600',
    subjectColor: 'bg-purple-100 text-purple-700',
    difficultyColor: 'bg-red-100 text-red-700',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    subject: 'Mathematics',
    difficulty: 'Intermediate',
    title: 'Differential Calculus: Applications',
    topic: 'Calculus',
    type: 'Interactive Module',
    duration: '60 mins',
    badgeColor: 'bg-green-600',
    subjectColor: 'bg-green-100 text-green-700',
    difficultyColor: 'bg-yellow-100 text-yellow-700',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  },
];

const topChannels: Record<string, { name: string; url: string; avatar: string; description: string }[]> = {
  Physics: [
    { name: "Physics Wallah", url: "https://www.youtube.com/c/PhysicsWallah", avatar: "https://yt3.ggpht.com/ytc/AKedOLQw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Q=s88-c-k-c0x00ffffff-no-rj", description: "India's most popular Physics channel for JEE/NEET." },
    { name: "Unacademy JEE", url: "https://www.youtube.com/c/UnacademyJEE", avatar: "https://yt3.ggpht.com/ytc/AKedOLQw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Q=s88-c-k-c0x00ffffff-no-rj", description: "Live classes and crash courses for JEE." },
    { name: "Kota Factory", url: "https://www.youtube.com/c/jeekotafactory", avatar: "https://yt3.ggpht.com/ytc/AKedOLQw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Q=s88-c-k-c0x00ffffff-no-rj", description: "Concepts and problem-solving for JEE Physics." },
  ],
  Chemistry: [
    { name: "Vedantu JEE", url: "https://www.youtube.com/c/VedantuJEE", avatar: "https://yt3.ggpht.com/ytc/AKedOLQw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Q=s88-c-k-c0x00ffffff-no-rj", description: "Chemistry lectures and tips for JEE." },
    { name: "Organic Chemistry Tutor", url: "https://www.youtube.com/c/TheOrganicChemistryTutor", avatar: "https://yt3.ggpht.com/ytc/AKedOLQw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Q=s88-c-k-c0x00ffffff-no-rj", description: "Clear explanations for organic chemistry." },
    { name: "Unacademy JEE", url: "https://www.youtube.com/c/UnacademyJEE", avatar: "https://yt3.ggpht.com/ytc/AKedOLQw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Q=s88-c-k-c0x00ffffff-no-rj", description: "Live classes and crash courses for JEE." },
  ],
  Mathematics: [
    { name: "Mohit Tyagi", url: "https://www.youtube.com/c/MohitTyagiMTsir", avatar: "https://yt3.ggpht.com/ytc/AKedOLQw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Q=s88-c-k-c0x00ffffff-no-rj", description: "Advanced math for JEE aspirants." },
    { name: "MathonGo", url: "https://www.youtube.com/c/MathonGo", avatar: "https://yt3.ggpht.com/ytc/AKedOLQw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Q=s88-c-k-c0x00ffffff-no-rj", description: "Math tricks and problem-solving." },
    { name: "Vedantu JEE", url: "https://www.youtube.com/c/VedantuJEE", avatar: "https://yt3.ggpht.com/ytc/AKedOLQw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Q=s88-c-k-c0x00ffffff-no-rj", description: "Math lectures and tips for JEE." },
  ],
};

// Enhanced mock video data (add views and likes)
const mockVideos = [
  {
    title: 'Kinematics for IIT JEE | Complete Chapter | Physics Wallah',
    url: 'https://www.youtube.com/watch?v=abcd1234',
    videoId: 'abcd1234',
    thumbnail: 'https://i.ytimg.com/vi/abcd1234/hqdefault.jpg',
    channel: 'Physics Wallah',
    views: 1200000,
    likes: 48000,
  },
  {
    title: 'JEE Main 2024: Organic Chemistry Mechanisms',
    url: 'https://www.youtube.com/watch?v=efgh5678',
    videoId: 'efgh5678',
    thumbnail: 'https://i.ytimg.com/vi/efgh5678/hqdefault.jpg',
    channel: 'Vedantu JEE',
    views: 950000,
    likes: 41000,
  },
  {
    title: 'Differential Calculus Tricks for JEE',
    url: 'https://www.youtube.com/watch?v=ijkl9012',
    videoId: 'ijkl9012',
    thumbnail: 'https://i.ytimg.com/vi/ijkl9012/hqdefault.jpg',
    channel: 'Mohit Tyagi',
    views: 870000,
    likes: 39000,
  },
  {
    title: 'Projectile Motion | JEE Physics | Unacademy JEE',
    url: 'https://www.youtube.com/watch?v=mnop3456',
    videoId: 'mnop3456',
    thumbnail: 'https://i.ytimg.com/vi/mnop3456/hqdefault.jpg',
    channel: 'Unacademy JEE',
    views: 1100000,
    likes: 42000,
  },
];

const getLikeRatio = (video: typeof mockVideos[0]) => video.likes / video.views;

const StudyMaterialsPage = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('recommended');
  const [subject, setSubject] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [youtubeLinks, setYoutubeLinks] = useState<string[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [videos, setVideos] = useState<typeof mockVideos>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [modalVideo, setModalVideo] = useState<null | typeof mockVideos[0]>(null);
  
  // Filtered materials (mock logic)
  const filteredMaterials = mockMaterials.filter((mat) => {
    return (
      (!search || mat.title.toLowerCase().includes(search.toLowerCase())) &&
      (!subject || mat.subject === subject) &&
      (!resourceType || mat.type === resourceType) &&
      (!difficulty || mat.difficulty === difficulty)
    );
  });
  
  // Fetch and sort top YouTube videos for the selected topic
  useEffect(() => {
    const fetchYoutubeLinks = async () => {
      if (!search && !subject) {
        setYoutubeLinks([]);
        setVideos([]);
        return;
      }
      setLoadingLinks(true);
      setLoadingVideos(true);
      try {
        // Fallback: YouTube search link and mock videos
        const topic = encodeURIComponent(`IIT JEE ${search || subject}`);
        setYoutubeLinks([
          `https://www.youtube.com/results?search_query=${topic}`
        ]);
        // Filter and sort videos by topic, views, and like ratio
        let filtered = mockVideos.filter(v => (search || subject) ? v.title.toLowerCase().includes((search || subject).toLowerCase()) : true);
        filtered = filtered.sort((a, b) => {
          // Sort by like ratio, then by views
          const ratioA = getLikeRatio(a);
          const ratioB = getLikeRatio(b);
          if (ratioA !== ratioB) return ratioB - ratioA;
          return b.views - a.views;
        });
        setVideos(filtered);
      } catch {
        setYoutubeLinks([]);
        setVideos([]);
      }
      setLoadingLinks(false);
      setLoadingVideos(false);
    };
    fetchYoutubeLinks();
  }, [search, subject]);

  return (
    <div className="px-4 md:px-12 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Study Materials</h1>
      <p className="text-lg text-gray-600 mb-8">Comprehensive resources for your IIT-JEE preparation</p>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            className="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
            placeholder="Search by topic or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select className="px-3 py-2 border rounded-lg" value={subject} onChange={e => setSubject(e.target.value)}>
            <option value="">Subject</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Mathematics">Mathematics</option>
          </select>
          <select className="px-3 py-2 border rounded-lg" value={resourceType} onChange={e => setResourceType(e.target.value)}>
            <option value="">Resource Type</option>
            <option value="Video Lecture">Video Lecture</option>
            <option value="PDF Notes">PDF Notes</option>
            <option value="Interactive Module">Interactive Module</option>
          </select>
          <select className="px-3 py-2 border rounded-lg" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="">Difficulty Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">Filters</button>
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'recommended' ? 'bg-gray-200 text-blue-700' : 'bg-white border'}`}
          onClick={() => setActiveTab('recommended')}
        >
          Recommended
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'library' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
          onClick={() => setActiveTab('library')}
        >
          My Library
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMaterials.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12">
            No study materials found. Try adjusting your search or filters.
          </div>
        ) : (
          filteredMaterials.map((mat) => (
            <div key={mat.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-40 w-full">
                <img src={mat.image} alt={mat.title} className="object-cover w-full h-full" />
                <span className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-semibold ${mat.subjectColor}`}>{mat.subject}</span>
                <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${mat.difficultyColor}`}>{mat.difficulty}</span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-1">{mat.title}</h3>
                <p className="text-gray-500 mb-2 text-sm">{mat.topic}</p>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <span className="flex items-center gap-1"><BookOpen size={16} /> {mat.type}</span>
                  <span className="flex items-center gap-1"><CheckCircle size={16} /> {mat.duration}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Top IIT JEE YouTube Channels */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Top IIT JEE YouTube Channels</h2>
        <div className="flex flex-wrap gap-6 mb-8">
          {(subject && topChannels[subject] ? topChannels[subject] : Object.values(topChannels).flat()).map((ch: { name: string; url: string; avatar: string; description: string }, idx: number) => (
            <div key={ch.url + idx} className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-64 border hover:shadow-lg transition">
              <img src={ch.avatar} alt={ch.name} className="w-16 h-16 rounded-full mb-2 border" />
              <a href={ch.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 text-lg hover:underline mb-1 flex items-center gap-1">
                <Youtube size={18} /> {ch.name}
              </a>
              <p className="text-gray-600 text-sm text-center mb-2">{ch.description}</p>
              <a href={ch.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">Subscribe</a>
            </div>
          ))}
        </div>
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Top YouTube Videos for IIT JEE {search || subject ? `- ${search || subject}` : ''}</h3>
        {loadingVideos ? (
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-64 h-48 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="flex flex-wrap gap-6">
            {videos.map((video, idx) => (
              <div key={video.url + idx} className="bg-white rounded-xl shadow p-3 w-64 flex flex-col items-center border hover:shadow-lg transition cursor-pointer" onClick={() => setModalVideo(video)}>
                <img src={video.thumbnail} alt={video.title} className="w-full h-36 object-cover rounded mb-2" />
                <div className="font-semibold text-blue-700 hover:underline text-center mb-1 line-clamp-2">
                  {video.title}
                </div>
                <div className="text-gray-500 text-xs mb-1">{video.channel}</div>
                <div className="flex gap-2 text-xs text-gray-600 mb-2">
                  <span>{video.views.toLocaleString()} views</span>
                  <span>·</span>
                  <span>{video.likes.toLocaleString()} likes</span>
                  <span>·</span>
                  <span>{((video.likes / video.views) * 100).toFixed(1)}% likes</span>
                </div>
                <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium flex items-center gap-1">
                  <Youtube size={16} /> Watch
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div>No video links found. <a href={youtubeLinks[0]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Search on YouTube</a></div>
        )}
      </div>
      {/* Video Modal Popup */}
      {modalVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-4 relative w-full max-w-2xl">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-red-600" onClick={() => setModalVideo(null)}>
              <X size={28} />
            </button>
            <div className="aspect-w-16 aspect-h-9 w-full rounded overflow-hidden">
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${modalVideo.videoId}`}
                title={modalVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-4 text-lg font-semibold text-center">{modalVideo.title}</div>
            <div className="text-gray-500 text-center text-sm">{modalVideo.channel}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyMaterialsPage;