const express = require('express');
const axios = require('axios');
const app = express();
const _ = require('lodash');
const port = process.env.PORT ||3000 ;
const cors=require('cors')
const blogMiddleware = require('./middleware/auth')

app.use(cors())
app.get("/",(req,res)=>{
  res.json({"Blog":"Running"})
})
app.get('/api/blog-stats', blogMiddleware,(req,res)=>{
  if (req.blogData && req.blogAnalytics) {
      res.json(req.blogAnalytics)
  }else {
    res.status(500).json({ error: 'Failed to retrieve blog statistics' });
  }
});

// http://localhost:3000/api/blog-search?query=privacy
app.get('/api/blog-search', blogMiddleware, (req, res) => {
  const { query } = req.query;
  // res.json(query)

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }
  if (req.blogData) {
  const searchResults = _.filter(req.blogData, (blog) =>
    blog.title.toLowerCase().includes(query.toLowerCase())
  );

  res.json({ results: searchResults });
}else {
  res.status(500).json({ error: 'Failed to retrieve blog data for search' });
}
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
