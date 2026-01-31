
export default function CommitteeDisplay() {
  
  const clgFacultyMembers = [
     {
      id: 1,
      name: "DR. J.M. VYAS",
      designation: "VICE CHANCELLOR, NFSU",
      photo: "/vc.webp",
      color: "#FF0044"
    },
    {
      id: 2,
      name: "PROF. (DR.) PURVI POKHRIYAL",
      designation: "CAMPUS DIRECTOR, NFSU DELHI",
      photo: "/cd.webp",
      color: "#00D9FF"
    },
    {
      id: 3,
      name: "COL. NIDHISH BHATNAGAR",
      designation: "FACULTY ADVISOR",
      photo: "/col.webp",
      color: "#FFD700"
    },
    {
      id: 4,
      name: "DR. RUTWIK SHEDGE",
      designation: "FACULTY CO-ADVISOR",
      photo: "/coad.webp",
      color: "#00FF88"
    },
  ]
  
  const committeeMembers = [
    {
      id: 1,
      name: "AMAN YADAV",
      designation: "PRESIDENT",
      photo: "/aman.webp",
      color: "#FF0044"
    },
    {
      id: 2,
      name: "NETRANSH ADHOJ",
      designation: "VICE PRESIDENT",
      photo: "/netransh.webp",
      color: "#00D9FF"
    },
    {
      id: 3,
      name: "ARJUN SINGH",
      designation: "GENERAL SECRETARY",
      photo: "/arjun.webp",
      color: "#FFD700"
    },
    {
      id: 4,
      name: "TAMANNA KHURANA",
      designation: "TREASURER",
      photo: "/tamanna.webp",
      color: "#00FF88"
    },
    {
      id: 5,
      name: "SAHIL YADAV",
      designation: "EVENT MANAGER",
      photo: "/sahil.webp",
      color: "#FF6B00"
    },
    {
      id: 6,
      name: "PRATEEK",
      designation: "EVENT MANAGER",
      photo: "/prateek.webp",
      color: "#FF00FF"
    },
    {
      id: 7,
      name: "KASHIF SHAHID",
      designation: "SOCIAL MEDIA HEAD",
      photo: "/kashif.webp",
      color: "#00cafb"
    },
    {
      id: 8,
      name: "DEBORSHI ROY",
      designation: "STUDENT CO-ORDINATOR",
      photo: "/debo.webp",
      color: "#7CFF00"
    },
    {
      id: 9,
      name: "SHRUTI",
      designation: "STUDENT CO-ORDINATOR",
      photo: "/shruti.webp",
      color: "#FF1493"
    }
    
  ];


  return (
    <div className="min-h-screen bg-black p-4 sm:p-8 overflow-hidden relative">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'linear-gradient(#00FF88 1px, transparent 1px), linear-gradient(90deg, #00FF88 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            animation: 'gridScroll 20s linear infinite'
          }}
        ></div>
      </div>

      {/* Scanlines */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-5" 
        style={{
          background: 'repeating-linear-gradient(0deg, #000 0px, #000 2px, transparent 2px, transparent 4px)'
        }}
      ></div>

     {/* Header for COLLEGE FACULTY */}
      <div className="relative z-10 mb-8 sm:mb-12 text-center px-2">
        <div className="inline-block bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 p-1 mb-4 animate-pulse w-full sm:w-auto">
          <div className="bg-black px-4 sm:px-8 py-3 sm:py-4">
            <h1 
              className="text-xl sm:text-3xl md:text-4xl lg:text-5xl text-white" 
              style={{ fontFamily: '"Press Start 2P", monospace', lineHeight: '1.5' }}
            >
              ORGANISING COMMITTEE
            </h1>
          </div>
        </div>
      </div>

      {/* College Faculty Grid - True Masonry */}
      <div className="relative z-10 max-w-7xl mx-auto mb-8">
        <div className="masonry-grid">
          {clgFacultyMembers.map((member, index) => (
            <div
              key={member.id}
              className="masonry-item group transform transition-all duration-300 hover:scale-105"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animation: 'fadeInUp 0.6s ease-out forwards',
                opacity: 0
              }}
            >
              {/* Card container with retro border */}
              <div className="member-card-inner relative bg-gray-900 p-1 hover:animate-pulse">
                <div 
                  className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${member.color}40, transparent)` }}
                ></div>
                
                {/* Inner card */}
                <div 
                  className="relative bg-black border-2 sm:border-4 border-gray-700 group-hover:border-opacity-100 transition-all duration-300"
                  style={{ borderColor: member.color }}
                >
                  {/* Corner decorations */}
                  <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4" style={{ borderColor: member.color }}></div>
                  <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 sm:border-t-4 border-r-2 sm:border-r-4" style={{ borderColor: member.color }}></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4" style={{ borderColor: member.color }}></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4" style={{ borderColor: member.color }}></div>

                  <div className="p-3 sm:p-4">
                    {/* Photo container with pixelated effect */}
                    <div className="relative mb-3 sm:mb-4 overflow-hidden group-hover:animate-pulse">
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                      <img 
                        src={member.photo} 
                        alt={member.name}
                        className="w-full aspect-square object-cover border-2 sm:border-4 transition-all duration-300 group-hover:brightness-125"
                        style={{ 
                          borderColor: member.color,
                          imageRendering: 'pixelated',
                          filter: 'contrast(1.1) saturate(1.2)'
                        }}
                      />
                      {/* Pixel overlay effect */}
                      <div 
                        className="absolute inset-0 opacity-20 group-hover:opacity-0 transition-opacity"
                        style={{ 
                          backgroundImage: `linear-gradient(${member.color}40 1px, transparent 1px), linear-gradient(90deg, ${member.color}40 1px, transparent 1px)`,
                          backgroundSize: '4px 4px'
                        }}
                      ></div>
                    </div>

                    {/* Name */}
                    <div className="mb-2 sm:mb-3 p-2 bg-gradient-to-r from-gray-800 to-transparent">
                      <h3 
                        className="text-xs sm:text-sm lg:text-base text-white leading-relaxed break-words" 
                        style={{ fontFamily: '"Press Start 2P", monospace', lineHeight: '1.6' }}
                      >
                        {member.name}
                      </h3>
                    </div>

                    {/* Designation badge */}
                    <div 
                      className="inline-block px-2 sm:px-3 py-1 sm:py-2 border sm:border-2 group-hover:animate-pulse"
                      style={{ borderColor: member.color, backgroundColor: `${member.color}20` }}
                    >
                      <p 
                        className="text-xs leading-relaxed" 
                        style={{ fontFamily: '"Press Start 2P", monospace', color: member.color, lineHeight: '1.6' }}
                      >
                        {member.designation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8 sm:mb-12 text-center px-2">
        <div className="inline-block bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 p-1 mb-4 animate-pulse w-full sm:w-auto">
          <div className="bg-black px-4 sm:px-8 py-3 sm:py-4">
            <h1 
              className="text-xl sm:text-3xl md:text-4xl lg:text-5xl text-white" 
              style={{ fontFamily: '"Press Start 2P", monospace', lineHeight: '1.5' }}
            >
              TEAM PARAKRAM
            </h1>
          </div>
        </div>
      </div>

      {/* Committee Grid - True Masonry */}
      <div className="relative z-10 max-w-7xl mx-auto mb-8">
        <div className="masonry-grid">
          {committeeMembers.map((member, index) => (
            <div
              key={member.id}
              className="masonry-item group transform transition-all duration-300 hover:scale-105"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animation: 'fadeInUp 0.6s ease-out forwards',
                opacity: 0
              }}
            >
              {/* Card container with retro border */}
              <div className="member-card-inner relative bg-gray-900 p-1 hover:animate-pulse">
                <div 
                  className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${member.color}40, transparent)` }}
                ></div>
                
                {/* Inner card */}
                <div 
                  className="relative bg-black border-2 sm:border-4 border-gray-700 group-hover:border-opacity-100 transition-all duration-300"
                  style={{ borderColor: member.color }}
                >
                  {/* Corner decorations */}
                  <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4" style={{ borderColor: member.color }}></div>
                  <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 sm:border-t-4 border-r-2 sm:border-r-4" style={{ borderColor: member.color }}></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4" style={{ borderColor: member.color }}></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4" style={{ borderColor: member.color }}></div>

                  <div className="p-3 sm:p-4">
                    {/* Photo container with pixelated effect */}
                    <div className="relative mb-3 sm:mb-4 overflow-hidden group-hover:animate-pulse">
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                      <img 
                        src={member.photo} 
                        alt={member.name}
                        className="w-full aspect-square object-cover image_render border-2 sm:border-4 transition-all duration-300 group-hover:brightness-125"
                        style={{ 
                          borderColor: member.color,
                          filter: 'contrast(1.1) saturate(1.2)'
                        }}
                      />
                      {/* Pixel overlay effect */}
                      <div 
                        className="absolute inset-0 opacity-20 group-hover:opacity-0 transition-opacity"
                        style={{ 
                          backgroundImage: `linear-gradient(${member.color}40 1px, transparent 1px), linear-gradient(90deg, ${member.color}40 1px, transparent 1px)`,
                          backgroundSize: '4px 4px'
                        }}
                      ></div>
                    </div>

                    {/* Name */}
                    <div className="mb-2 sm:mb-3 p-2 bg-gradient-to-r from-gray-800 to-transparent">
                      <h3 
                        className="text-xs sm:text-sm lg:text-base text-white leading-relaxed break-words" 
                        style={{ fontFamily: '"Press Start 2P", monospace', lineHeight: '1.6' }}
                      >
                        {member.name}
                      </h3>
                    </div>

                    {/* Designation badge */}
                    <div 
                      className="inline-block px-2 sm:px-3 py-1 sm:py-2 border sm:border-2 group-hover:animate-pulse"
                      style={{ borderColor: member.color, backgroundColor: `${member.color}20` }}
                    >
                      <p 
                        className="text-xs leading-relaxed" 
                        style={{ fontFamily: '"Press Start 2P", monospace', color: member.color, lineHeight: '1.6' }}
                      >
                        {member.designation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer credits */}
      <div className="relative z-10 text-center mt-8 sm:mt-12 pb-8 px-2">
        <div className="inline-block border-2 sm:border-4 border-yellow-400 bg-black px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto">
          <p 
            className="text-xs sm:text-sm text-yellow-400 mb-2 leading-relaxed" 
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            GAME OVER?{' '}
            <a href="/" className="text-red-500 hover:text-red-300 transition-colors underline">
              RETRY NOW
            </a>
          </p>
          <div className="flex justify-center gap-2 mt-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 animate-pulse" 
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Developer credits */}
      <div className="fixed bottom-2 right-2 text-right text-xs sm:text-sm text-gray-500 z-10" style={{ fontFamily: '"Press Start 2P", monospace' }}>
        <p>Developed by <a href="https://github.com/TheHackerClown" className="text-red-600">TheHackerClown</a> & <a href="https://github.com/Aditya-Dahiya-007" className="text-red-600">Aditya-Dahiya-007</a></p>
      </div>
    </div>
  );
}