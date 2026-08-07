import path from "path";

const config = {
  plugins: {
    "@tailwindcss/postcss": {
      base: path.resolve(),
    },
  },
};

export default config;
