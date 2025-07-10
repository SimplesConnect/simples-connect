return (
  <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-br from-simples-cloud via-simples-silver to-simples-light px-4 py-6">
    <div className="text-center max-w-md mx-auto">
      <div className="w-24 h-24 bg-gradient-to-r from-simples-ocean to-simples-sky rounded-full flex items-center justify-center mx-auto mb-6">
        <Heart className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-simples-midnight mb-4">
        Discover is waiting for love 💘
      </h1>
      <p className="text-lg text-simples-storm mb-6">
        You're early — and that’s a beautiful thing. As more amazing members join, you’ll soon be able to browse, match, and meet your dia.
      </p>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-simples-ocean" />
          <span className="text-sm font-medium text-simples-midnight">Coming Soon</span>
        </div>
        <ul className="text-left space-y-2 text-sm text-simples-storm">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-simples-ocean rounded-full"></div>
            Beautiful profile cards you can swipe through
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-simples-ocean rounded-full"></div>
            Real-time matches and messaging
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-simples-ocean rounded-full"></div>
            Smart filtering for serious connections
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-simples-ocean rounded-full"></div>
            Love stories unfolding across the diaspora 🌍
          </li>
        </ul>
      </div>
      <button
        onClick={() => navigate('/dashboard')}
        className="mt-6 bg-gradient-to-r from-simples-ocean to-simples-sky text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
      >
        Back to Dashboard
      </button>
    </div>
  </div>
);
