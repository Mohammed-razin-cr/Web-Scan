import { Global, css } from '@emotion/react';

const GlobalStyles = () => (
  <Global
    styles={css`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

      *, *::before, *::after {
        box-sizing: border-box;
      }

      body,
      div,
      a,
      p,
      span,
      ul,
      li,
      small,
      h1, h2, h3, h4,
      button,
      input,
      section {
        font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: #d1e8e2;
        letter-spacing: 0;
      }

      code, pre, kbd, samp {
        font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
      }

      a {
        text-decoration: none;
        color: #4ce1d3;
        transition: color 0.2s ease;
      }
      a:hover {
        color: #8eedd8;
      }

      #fancy-background p span {
        color: transparent;
      }

      /* Custom scrollbar inside results */
      .card-body::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }
      .card-body::-webkit-scrollbar-track {
        background: transparent;
      }
      .card-body::-webkit-scrollbar-thumb {
        background: rgba(76, 225, 211, 0.25);
        border-radius: 2px;
      }
    `}
  />
);

export default GlobalStyles;
