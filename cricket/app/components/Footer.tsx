
export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-gray-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">CricPulse</h3>
            <p className="text-sm">
              The ultimate platform for live cricket scores, stats, and AI-powered predictions.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Live Scores</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Schedule</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">News</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Videos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">AI Predictions</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Player Stats</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Fantasy Tips</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm">
          &copy; {new Date().getFullYear()} CricPulse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
