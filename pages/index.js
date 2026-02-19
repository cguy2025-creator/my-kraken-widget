import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function KrakenWidget() {
  const { data: session } = useSession();
  const [track, setTrack] = useState(null);
  const router = useRouter();
  
  // NZXT CAM adds ?kraken=1 to the URL when displaying on the AIO screen
  const isKrakenDisplay = router.query.kraken === '1';

  useEffect(() => {
    const updateTrack = async () => {
      // This calls the internal API we will build next
      const res = await fetch('/api/spotify/now-playing');
      if (res.ok) {
        const data = await res.json();
        setTrack(data);
      }
    };
    
    // Refresh every 3 seconds to keep the progress bar moving
    const timer = setInterval(updateTrack, 3000); 
    return () => clearInterval(timer);
  }, []);

  // Login Screen: Only shows on your desktop monitor (so you can sign in)
  if (!session && !isKrakenDisplay) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-white font-sans">
        <h1 className="mb-8 text-2xl font-bold">Kraken Spotify Setup</h1>
        <button 
          onClick={() => signIn('spotify')} 
          className="bg-[#1DB954] hover:bg-[#1ed760] transition-colors px-10 py-4 rounded-full text-white font-bold text-lg shadow-lg"
        >
          Connect Spotify
        </button>
      </div>
    );
  }

  // AIO Screen: This is what shows on your pump
  return (
    <div className="w-[640px] h-[640px] bg-black text-white relative overflow-hidden font-sans">
      
      {/* Blurred Background Image */}
      {track?.albumArt && (
        <img 
          src={track.albumArt} 
          className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-50 scale-125" 
          alt=""
        />
      )}

      {/* Main Content Layout */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-20 text-center">
        
        {/* Top Spotify Icon */}
        <div className="mb-6 opacity-90">
          <svg width="45" height="45" viewBox="0 0 24 24" fill="#1DB954">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.306c-.215.353-.674.464-1.025.249-2.858-1.746-6.456-2.14-10.693-1.171-.403.093-.81-.157-.903-.561-.093-.404.157-.811.561-.904 4.635-1.06 8.625-.615 11.811 1.332.35.215.462.673.249 1.025zm1.467-3.259c-.27.439-.844.582-1.283.312-3.272-2.012-8.258-2.592-12.127-1.417-.495.15-.1.85-.347.649-.494-.15-.799-.679-.65-1.173 4.417-1.34 9.907-.7 13.699 1.632.44.27.583.844.312 1.283zm.127-3.41c-3.926-2.331-10.407-2.546-14.175-1.402-.602.183-1.233-.162-1.416-.764-.182-.603.162-1.233.764-1.416 4.327-1.314 11.479-1.056 16.002 1.628.541.321.716 1.021.395 1.562-.321.542-1.021.717-1.562.395z"/>
          </svg>
        </div>

        {track ? (
          <>
            {/* Album Art Cover */}
            <div className="relative mb-8">
               <img 
                src={track.albumArt} 
                className="w-64 h-64 rounded-lg shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-white/20" 
                alt="Album Cover"
              />
            </div>

            {/* Song Details */}
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 truncate w-full px-10">
              {track.title}
            </h1>
            <p className="text-2xl text-zinc-300 font-medium truncate w-full px-10">
              {track.artist}
            </p>
            
            {/* Progress Bar (Matches your screenshot) */}
            <div className="w-64 h-2 bg-white/20 rounded-full mt-10 overflow-hidden">
               <div 
                className="bg-white h-full transition-all duration-1000 ease-linear" 
                style={{ width: `${(track.progress / track.duration) * 100}%` }}
               ></div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-zinc-500 text-2xl italic animate-pulse">Waiting for Spotify...</p>
          </div>
        )}
      </div>
    </div>
  );
}
