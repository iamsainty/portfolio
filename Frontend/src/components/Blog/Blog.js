import React, { useContext, useState, useEffect } from 'react';
import Introduction from '../Introduction';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaTag } from 'react-icons/fa';
import { RiBarChartFill } from 'react-icons/ri';
import Loading from '../Loading';
import BlogContext from '../context/blogs/blogContext';
import defaultblogcover from '../../media/Default/DefaultBlog.png';

const BlogContainer = styled.div`
  margin-top: 50px;
`;

const BlogCard = styled.div`
  width: 100%;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  padding: 2vh 3vh;
  transition: transform 0.3s ease-in-out;
  border-radius: 10px;
  border: none;

  &:hover {
    transform: scale(1.03);
  }

  img {
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
    margin-bottom: 2vh;
  }

  .card-body {
    color: #191919;
  }

  h2 {
    font-size: 2.5vh; // Increased font size for better readability
    font-weight: bold;
    margin-bottom: 1.5vh;
  }

  .tags-container {
    display: flex;
    align-items: center;
    margin-top: 1vh;
  }

  .tags-icon {
    margin-right: 1vh;
    font-size: 1.8vh; // Increased icon size for better visibility
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75vh;
    font-size: 1.5vh;
  }

  .tag {
    margin: 0.5vh;
    padding: 0.75vh 1.5vh;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
    text-decoration: none;
    color: black;
  }

  p {
    font-size: 1.6vh;
    margin-bottom: 1.5vh;
  }
`;

const GridContainer = styled.div`
  display: grid;
  gap: 30px; // Increased gap for better spacing
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 30px auto;
  padding: 10px 30px;
  font-size: 2vh;
  cursor: pointer;
  border-radius: 5px;
`;

function Blog(props) {
  const { blogs, loading, fetchBlogs, totalBlog } = useContext(BlogContext);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreBlogs = () => {
    if (blogs.length < totalBlog) {
      setIsLoading(true);
      setTimeout(() => {
        setPage((prevPage) => prevPage + 1);
        setIsLoading(false);
      }, 750);
    }
  };

  useEffect(() => {
    document.title = `${props.title}`;
    // eslint-disable-next-line
  }, [props.title]);


  useEffect(() => {
    fetchBlogs(page);
    // eslint-disable-next-line
  }, [page]);

  // const host = 'http://localhost:5002';
  const host = 'https://hey-sainty-backend.vercel.app';


  return (
    <BlogContainer className='container'>
      <Introduction array={blogs.map((blog) => blog.title)} heading={"Read Blogs"} />
      <div style={{ height: '20vh', width: '100%' }}></div>
      {loading && page === 1 ? (
        <div><Loading /></div>
      ) : blogs.length === 0 ? (
        <p style={{ fontSize: '3vh', fontWeight: 'bold', textAlign: 'center' }}>No blogs to display</p>
      ) : (
        <>
          <GridContainer>
            {blogs.map((blog) => (
              <div key={blog._id}>
                <Link to={`/blog/${blog.permalink}`} style={{ textDecoration: 'none' }}>
                  <BlogCard>
                    <img
                      src={`${host}/media/blogcovers/${blog.coverimage}`}
                      alt={`${blog.title} Preview`}
                      onError={(e) => { e.target.onerror = null; e.target.src = defaultblogcover; }}
                    />
                    <div className="card-body">
                      <h2>{blog.title}</h2>
                      <div className="tags-container">
                        <FaTag className="tags-icon" />
                        <div className="tags">
                          {blog.tag.map((tag) => (
                            <Link to={`/blog/tag/${tag}`} key={tag} className="tag">{tag}</Link>
                          ))}
                        </div>
                      </div>
                      <p>{blog.summary ? blog.summary.slice(0, 130) : ""}...</p>
                      <p>Author: {blog.author}</p>
                      <p>
                        {blog.dateCreated === blog.lastUpdated ? (
                          `Published on: ${new Date(blog.dateCreated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                        ) : (
                          `Last updated on: ${new Date(blog.lastUpdated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                        )}
                      </p>
                      <p style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <RiBarChartFill style={{ marginRight: '1vh' }} />
                        {blog.views} views
                      </p>
                    </div>
                  </BlogCard>
                </Link>
              </div>
            ))}
          </GridContainer>
          {isLoading ? (
            <Loading /> // Assuming `Loading` is your loading component
          ) : blogs.length < totalBlog ? (
            <LoadMoreButton className='btn btn-outline-dark' onClick={loadMoreBlogs} disabled={isLoading}>
              Load More Blogs
            </LoadMoreButton>
          ) : (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>No more blogs to load</p>
          )}
        </>
      )}
      <br /><br />
    </BlogContainer>
  );
}

export default Blog;
