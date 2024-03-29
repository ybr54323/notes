import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  outDir: "./docs",
  base: "/notes/",
  title: "YBR notes",
  description: "record life and word.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
      {
        text: "工作记录",
        items: [
          {
            text: "2023",
            items: [
              {
                text: "march",
                items: [
                  {
                    text: "第二周",
                    link: "/src/work/2023/march/second",
                  },
                  {
                    text: "第三周",
                    link: "/src/work/2023/march/third",
                  },
                  {
                    text: "关于使用antv/x6绘制er图应用的记录",
                    link: "/src/work/2023/match/er.graph.antv.md"
                  }
                ],
              },
            ],
          },
        ],
      },
      {
        text: "b端组件",
        items: [
          {
            text: "动态增减表单",
            link: "/src/b-components/tableForm",
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
