const axios = require('axios');
const _ = require('lodash');

const blogMiddleware = async (req, res, next) => {
    try {
      const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
        headers: {
          'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
        },
      });
        const blogData = response.data.blogs;
        //res.json(blogData);
        const totalBlogs = blogData.length;
        const longestTitleBlog = _.maxBy(blogData, (blog) => blog.title.length);
        const privacyBlogs = _.filter(blogData, (blog) =>_.includes(blog.title.toLowerCase(), 'privacy'));
        const uniqueBlogTitles = _.uniqBy(blogData, 'title');


    
    const analyticsResults = {
      totalBlogs,
      longestTitleBlog,
      privacyBlogs: privacyBlogs.length,
      uniqueBlogTitles,
    };
    //console.log(analyticsResults)
    req.blogData = blogData;
    req.blogAnalytics=analyticsResults;
    next();

    } catch (error) {
      console.error('Error fetching blog data:', error);
      res.status(500).json({ error: 'Failed to fetch blog data' });
    }
  };
module.exports= blogMiddleware;
