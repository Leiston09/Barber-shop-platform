import { generateClasses } from "@formkit/themes";

const config = {
  config: {
    classes: generateClasses({
      global: {
        wrapper: "space-y-2 mb-3",
        message:
          "bg-red-500 text-white text-center text-sm font-bold uppercase p-2 my-2",
        label: "block mb-1 font-bold text-lg text-white",
        input:
          "w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all",
      },
      // 👇 ESTO ES LO QUE TE FALTABA PARA EL BOTÓN
      submit: {
        input:
          "w-full bg-blue-700 hover:bg-purple-700 text-black font-bold py-3 rounded-lg transition-colors shadow-md mt-5 cursor-pointer",
      },
    }),
  },
};

export default config;
