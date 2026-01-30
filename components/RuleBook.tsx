
export default function RuleBookButton() {
  return (<button
          className="
            relative px-3 sm:px-6 py-1.5 sm:py-3 font-mono text-xs sm:text-base font-bold
            transition-all duration-150 ease-in-out
            bg-blue-500 text-black border-blue-700
            border-2 sm:border-4
            shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]
            hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]
            hover:translate-x-0.5
            hover:translate-y-0.5
            active:shadow-none
            active:translate-x-1
            active:translate-y-1
          "
        >
          <div className="flex items-center gap-1.5 sm:gap-3">
            <img src="/book-half.svg" alt="Rulebook Icon" className="w-6 h-6" />
            <span className="tracking-wider text-[10px] sm:text-base">
              RuleBook
            </span>
          </div>
        </button>);
}