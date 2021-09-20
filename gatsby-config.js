module.exports = {
  siteMetadata: {
    title: "WCBI Simple WebApp",
    siteUrl: "https://wcbi-simple-webapp.pages.dev",
    author: "Clay Harmon",
  },
  plugins: [
    "gatsby-plugin-typescript",
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-webfonts",
      options: {
        fonts: {
          google2: [
            {
              family: "Quicksand",
              axes: "wght@300;500;700",
              subsets: ["latin", "latin-ext"],
              fontDisplay: "swap",
            },
          ],
        },
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "WCBI Simple WebApp",
        short_name: "WCBI WebApp",
        icon: "src/images/icon.png",
        icon_options: {
          purpose: "any maskable",
        },
        start_url: "/",
        lang: "en",
        background_color: "#2149a5",
        theme_color: "#ffffff",
        display: "standalone",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images`,
      },
    },
  ],
};
