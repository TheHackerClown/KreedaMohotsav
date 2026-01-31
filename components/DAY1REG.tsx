
export default function Day1Button() {
  return (<a href="https://forms.gle/tJSbnLNzx8WVAA8e8"
              className="
            relative px-3 sm:px-6 py-1.5 sm:py-3 font-mono text-xs sm:text-base font-bold
            transition-all duration-150 ease-in-out
            bg-amber-400 text-black border-yellow-700
            border-2 sm:border-4
            shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]
            hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]
            hover:translate-x-0.5
            hover:translate-y-0.5
            active:shadow-none
            active:translate-x-1
            active:translate-y-1
          "
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center gap-1.5 sm:gap-3">
            <img src="/dice-1.svg" alt="Day 1 Icon" className="w-6 h-6 bg-white rounded" />
            <span className="tracking-wider text-[10px] sm:text-base">
              Day 1 Registration Link
            </span>
          </div>
        </a>);
}