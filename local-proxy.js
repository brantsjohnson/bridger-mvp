const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3001;

// Serve static files from the public directory
app.use(express.static('public'));

// Proxy routes to different apps
app.use('/auth', createProxyMiddleware({
  target: 'http://localhost:8081',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': ''
  }
}));

app.use('/core', createProxyMiddleware({
  target: 'http://localhost:8080',
  changeOrigin: true,
  pathRewrite: {
    '^/core': ''
  }
}));

app.use('/quiz', createProxyMiddleware({
  target: 'http://localhost:8084',
  changeOrigin: true,
  pathRewrite: {
    '^/quiz': ''
  }
}));

// Default route to main app
app.use('/', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true
}));

app.listen(PORT, () => {
  console.log(`🚀 Local proxy server running at http://localhost:${PORT}`);
  console.log(`📱 Auth app: http://localhost:${PORT}/auth`);
  console.log(`💻 Core app: http://localhost:${PORT}/core`);
  console.log(`🧠 Quiz app: http://localhost:${PORT}/quiz`);
  console.log(`🏠 Main app: http://localhost:${PORT}/`);
}); 