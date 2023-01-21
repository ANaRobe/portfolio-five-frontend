import React, { useEffect, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import Asset from '../../components/Asset';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Post from './Post';
import NoResults from "../../assets/no_results.png";

/*
    Display all posts.
 */
function PostsPage({ message, filter = '' }) {
  const [posts, setPosts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  const [query, setQuery] = useState('');

  const currentUser = useCurrentUser();

/*
    Fetch posts from API.
*/
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/?${filter}search=${query}`); //    get search results
        setPosts(data);
        setHasLoaded(true);
      } catch (error) {
        // console.log(error);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchPosts();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  return (
        <Form
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            placeholder="search posts"
            aria-label="search posts"
          />
           {hasLoaded ? (
          <>
            {posts.results.length ? (
              posts.results.map((post) => (
                <Post key={post.id} {...post} setPosts={setPosts} />
              ))
            ) : (
              <Container>
                <Asset src={NoResults} />
              </Container>
            )}
          </>
        ) : (
            <Asset spin />
        )}
        </Form>
 
  );
}
export default PostsPage;

 
