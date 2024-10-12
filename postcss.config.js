module.exports = ({ mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [
      require("tailwindcss"),
      require("postcss-preset-env")({
        stage: 1,
      }),
      require("autoprefixer"),
      ...(isProduction
        ? [
            require("@fullhuman/postcss-purgecss")({
              content: ["./src/**/*.html", "./src/**/*.js"],
              defaultExtractor: (content) =>
                content.match(/[\w-/:]+(?<!:)/g) || [],
            }),
            require("cssnano")({
              preset: "default",
            }),
          ]
        : []),
    ],
  };
};
