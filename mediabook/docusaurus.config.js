const lightCodeTheme = require("prism-react-renderer/themes/github")
const darkCodeTheme = require("prism-react-renderer/themes/dracula")

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Make School Tutorials",
  tagline: "A collection of tech related tutorials.",
  url: "https://makeschool.fail/",
  baseUrl: "/",
  onBrokenMarkdownLinks: "warn",
  organizationName: "Pondorasti",
  projectName: "Mediabook",
  themeConfig: {
    colorMode: {
      // "light" | "dark"
      defaultMode: "dark",

      // Should we use the prefers-color-scheme media-query,
      // using user system preferences, instead of the hardcoded defaultMode
      respectPrefersColorScheme: true,

      // Dark/light switch icon options
      switchConfig: {
        // Icon for the switch while in dark mode
        darkIcon: "  ",
        darkIconStyle: {
          marginTop: "1px",
        },
        lightIcon: "  ",
        lightIconStyle: {
          marginTop: "1px",
        },
      },
    },
    navbar: {
      title: "Make School Archives",
      logo: {
        alt: "Make School Archives",
        src: "assets/blank.png",
        href: "https://makeschool.fail/",
        target: "_self",
      },
      items: [
        {
          to: "https://makeschool.fail/courses",
          target: "_self",
          label: "Courses",
          position: "right",
        },
        {
          to: "https://makeschool.fail/tutorials",
          target: "_self",
          label: "Tutorials",
          position: "right",
          activeBaseRegex: "tutorials$", // intentionally broken
        },
        {
          href: "https://github.com/Pondorasti/makeschool/",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
    fathomAnalytics: {
      siteId: "XGMHRMOT",
      customDomain: "mediabook.makeschool.fail",
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarCollapsible: false,
          sidebarPath: require.resolve("./sidebars.js"),
          path: "tutorials",
          routeBasePath: "/tutorials",
          editUrl: "https://github.com/Pondorasti/makeschool/tree/main/mediabook/",
          admonitions: {
            customTypes: {
              icons: "emoji",
              solution: {
                emoji: "????",
                svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"/></svg>',
              },
            },
          },
        },
        theme: {
          customCss: [require.resolve("./src/css/custom.css")],
        },
      },
    ],
  ],
  plugins: [require.resolve("docusaurus-plugin-fathom")],
}
