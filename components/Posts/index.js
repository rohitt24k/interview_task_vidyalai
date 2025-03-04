import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import { useWindowWidth } from '../context/windowWidthProvider';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(10);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { isSmallerDevice } = useWindowWidth();

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const { data: newPosts } = await axios.get('/api/v1/posts', {
          params: { start, limit: isSmallerDevice ? 5 : limit },
        });
        console.log('newPosts', newPosts);
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setIsLoading(false);
        if (newPosts.length < limit) {
          setHasMorePosts(false);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPost();
  }, [start]);

  useEffect(() => {
    if (isSmallerDevice) {
      setLimit(5);
    } else {
      setLimit(10);
    }
  }, [isSmallerDevice]);

  const handleClick = () => {
    setIsLoading(true);
    setStart(prevStart => posts.length);
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </PostListContainer>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {hasMorePosts && (
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        )}
      </div>
    </Container>
  );
}
