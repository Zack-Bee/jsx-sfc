import React, { useState } from 'react';
import logo from './logo.svg';
import sfc from 'jsx-sfc';
import { styles } from './utils';

const App = sfc(
  {
    template: ({ data }) => (
      <div className={data.classes.App}>
        <header className={data.classes.AppHeader}>
          <img src={logo} className={data.classes.AppLogo} alt="logo" />
          <p>Hello Vite + React!</p>
          <p>
            <button className={data.classes.AppButton} onClick={data.onClick}>
              count is: {data.count}
            </button>
          </p>
          <p>
            Edit <code>App.tsx</code> and save to test HMR updates.
          </p>
          <p>
            <a className={data.classes.AppLink} href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
              Learn React
            </a>
            {' | '}
            <a
              className={data.classes.AppLink}
              href="https://vitejs.dev/guide/features.html"
              target="_blank"
              rel="noopener noreferrer">
              Vite Docs
            </a>
          </p>
        </header>
      </div>
    ),

    Component: ({ useStyles }) => {
      const [count, setCount] = useState(0);
      const classes = useStyles();

      return {
        count,
        setCount,
        classes,
        onClick: () => setCount(count => count + 1)
      };
    }
  },

  styles({
    App: {
      textAlign: 'center'
    },
    AppLogo: {
      height: '40vmin',
      pointerEvents: 'none',
      animation: '$App-logo-spin infinite 20s linear'
    },
    '@keyframes App-logo-spin': {
      from: {
        transform: 'rotate(0deg)'
      },
      to: {
        transform: 'rotate(360deg)'
      }
    },
    AppHeader: {
      backgroundColor: '#282c34',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'calc(10px + 2vmin)',
      color: 'white'
    },
    AppLink: {
      color: '#61dafb'
    },
    AppButton: {
      fontSize: 'calc(10px + 2vmin)'
    }
  })
);

export default App;