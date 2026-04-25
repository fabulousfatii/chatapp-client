import { UserPlus, LogIn } from "lucide-react";
import {useNavigate} from "react-router-dom"

 function Home() {
  const navigate = useNavigate()
  return (
    
    <div className="min-h-screen bg-[#0f1117] text-white font-sans overflow-hidden relative flex flex-col">


      {/* ── Ambient blobs ── */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-violet-500 opacity-15 blur-[80px] bottom-[12%] -right-[6%]" />
      <div className="absolute w-[200px] h-[200px] rounded-full bg-cyan-400 opacity-10 blur-[80px] top-[55%] left-[45%]" />

      {/* ── Hero ── */}
      <main className="flex flex-col items-center justify-center flex-1 pt-20 px-6 pb-10 relative z-10">

        {/* Badge */}
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Real-time · End-to-end encrypted
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-center tracking-tight leading-[1.1] max-w-2xl">
          Welcome to{" "}
          <span className="bg-linear-to-br from-indigo-400 to-emerald-300 bg-clip-text text-transparent">
            Chat Connect
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-gray-400 text-center text-lg max-w-md leading-relaxed font-light">
          Connect, collaborate, and communicate seamlessly — wherever you are.
        </p>

        {/* ── Buttons ── */}
        <div className="flex gap-4 mt-11 flex-wrap justify-center">
          <button onClick={()=> navigate("/signup")} className="flex items-center gap-2.5 bg-linear-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-[0_0_24px_rgba(99,102,241,0.35)] hover:shadow-[0_0_36px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 transition-all duration-200">
            <UserPlus size={18} />
            Sign Up
          </button>

          <button onClick={()=> navigate("login")} className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:-translate-y-0.5 transition-all duration-200">
            <LogIn size={18} />
            Sign In
          </button>
        </div>

        {/* Trust strip */}
        <div className="flex items-center gap-4 mt-16">
          <div className="flex">
            {[
              { initials: "JK", color: "bg-indigo-500" },
              { initials: "AR", color: "bg-violet-500" },
              { initials: "SM", color: "bg-cyan-500" },
              { initials: "+",  color: "bg-pink-500"   },
            ].map((av, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full border-2 border-[#0f1117] flex items-center justify-center text-xs font-bold text-white ${av.color} ${i !== 0 ? "-ml-2.5" : ""}`}
              >
                {av.initials}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 leading-snug">
            Join <span className="text-white font-semibold">12,000+</span> users already chatting
            <br />No credit card required
          </p>
        </div>
      </main>
    </div>
  
  );
}

export default Home;