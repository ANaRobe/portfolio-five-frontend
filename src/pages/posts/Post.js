import React from 'react'
import { Badge, Card, Media, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link, useHistory } from "react-router-dom";
import { axiosRes } from '../../api/axiosDefaults';
import { DropdownMenu } from "../../components/DropdownMenu";
import Avatar from "../../components/Avatar";
import styles from "../../styles/Post.module.css";
/*
 Display single post content
 */
const Post = (props) => {
    const {
        id,
        owner,
        profile_id,
        profile_image,
        last_edit,
        comments_count,
        likes_count,
        like_id,
        title,
        content,
        image,
        category,
        postPage,
        setPosts,
        
    } = props;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner 
    const history = useHistory();
    const handleEdit = () => {
      history.push(`/posts/${id}/edit`);
    };
  
    const handleDelete = async () => {
      try {
        await axiosRes.delete(`/posts/${id}/`);
        history.goBack();
      } catch (error) {
        //console.log(error);
      }
    };
/*
   Return like count from API.
   Increment count by 1.
*/
const handleLike = async () => {
    try {
      const { data } = await axiosRes.post('/likes/', { post: id });
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : post;
        }),
      }));
    } catch (err) {
      //console.log(err);
    }
  };

  /*
    Return like count from API.
    Decrement count by 1.
   */
  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count - 1, like_id: null }
            : post;
        }),
      }));
    } catch (err) {
      //console.log(err);
    }
  };

    return (
    <Card className={styles.Post}>
        <Card.Body >
            <Media className="align-items-center justify-content-between">
                <Link to={`/profiles/${profile_id}`}>
                <Avatar src={profile_image} />
                    <strong>{owner}</strong>
                </Link>
                <div className="d-flex align-items-center">
                  <span className="text-secondary">{last_edit}</span>
                    {is_owner && postPage && (
                      <DropdownMenu
                        handleEdit={handleEdit}
                        handleDelete={handleDelete} 
                      />
                    )}
              </div>
            </Media>
        </Card.Body>
        <Link to={`/posts/${id}`}><Card.Img src={image} alt={title} /></Link>
        <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        {content && <Card.Text>{content}</Card.Text>}     
        <Badge variant="secondary">{category}</Badge>
        <Card.Text className="text-center">
            {is_owner ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>You can't like your own post!</Tooltip>}
              >
                <i className="far fa-heart" />
              </OverlayTrigger>
            ) : like_id ? (
              <span onClick={handleUnlike}>
                <i className="fas fa-heart" />
              </span>
            ) : currentUser ? (
              <span onClick={handleLike}>
                <i className="far fa-heart" />
              </span>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Log in to like posts!</Tooltip>}
              >
                <i className="far fa-heart" />
              </OverlayTrigger>
            )}
            {likes_count}
            <Link to={`/posts/${id}`}>
              <i className="far fa-comments" />
            </Link>
            {comments_count}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Post;