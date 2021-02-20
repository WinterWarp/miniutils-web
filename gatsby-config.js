module.exports = {
  siteMetadata: {
    title: "MiniJects",
    siteUrl: "https://nullandvoid.tk"
  },
  plugins: [
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
    {
      resolve: 'gatsby-plugin-html-attributes',
      options: {
        lang: 'en'
      }
    },
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "G-FZB86NR18G",
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "MiniUtils",
        short_name: "MiniUtils",
        background_color: '#2E3440',
        theme_color: '#88C0D0',
        display: 'minimal-ui',
        icon: "src/images/logo.png",
        icon_options: {
          purpose: "any maskable"
        }
      },
    },
    "gatsby-plugin-offline",
  ],
};
