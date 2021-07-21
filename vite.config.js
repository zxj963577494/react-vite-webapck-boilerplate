import reactRefresh from '@vitejs/plugin-react-refresh';
import { viteMockServe } from 'vite-plugin-mock';

export default ({ command }) => {
  return {
    root: 'src',
    plugins: [
      reactRefresh(),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: process.env.mock === 'true' && command === 'serve',
      }),
    ],
    server: {
      proxy:
        process.env.noproxy === 'true'
          ? false
          : {
              '/api': {
                target: 'http://jsonplaceholder.typicode.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
              },
            },
    },
  };
};
