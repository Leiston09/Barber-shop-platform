import { generateClasses } from "@formkit/themes";

const config = {
  config: {
    classes: generateClasses({
      global: {
        wrapper: "space-y-2 mb-4",
        message:
          "bg-red-500/10 border border-red-500/30 text-red-400 text-center text-xs uppercase tracking-wide p-2.5 rounded-lg my-2",
        label:
          "block mb-2 text-[10px] uppercase tracking-[0.25em] text-white/40 font-medium",
        input:
          "w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#ffb700]/60 focus:bg-black/60 transition-all duration-300",
      },
      submit: {
        input:
          "w-full bg-[#ffb700] hover:bg-[#e6a500] text-black font-barber text-xs font-medium uppercase tracking-[0.2em] py-4 rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-[#ffb700]/10 hover:shadow-[#ffb700]/20 hover:scale-[1.01] active:scale-[0.99] mt-5 disabled:opacity-40 disabled:cursor-not-allowed",
      },
    }),
  },
};

export default config;