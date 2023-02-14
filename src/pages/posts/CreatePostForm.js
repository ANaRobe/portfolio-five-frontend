import React, { useRef, useState } from "react";
import { Row, Form, Button, Col, Container, Image, Alert }  from "react-bootstrap";
import btnStyles from "../../styles/Button.module.css";
import styles from '../../styles/PostForm.module.css';
import Asset from "../../components/Asset";
import cloud from "../../assets/cloud.png";
import { useHistory } from 'react-router-dom';
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";
import appStyles from "../../App.module.css"

/*
Render input fields to create a post.
 */
function CreatePostForm() {
  const history = useHistory();
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    title: "",
    content: "",
    image: "",
    category: "",
  });
  const { title, content, image, category} = data;
  const categoryOptions = {
    'did_you_know': 'Did you know?',
    'tips&how_tos': 'Tips & How Tos',
    'fun_posts': 'Fun Posts',
    'recommendations': 'Recommendations',
    'other': 'Other'
  };
  const imageInput = useRef(null);
  useRedirect("loggedOut");

  /*
  Populate postData strings
  */
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const changeImage = (e) => {
    if (e.target.files.length) {
      URL.revokeObjectURL(image); // Clear browsers's reference to the previous
      setData({
        ...data,
        image: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", imageInput.current.files[0]);
    formData.append("category", category);

    try {
      const { data } = await axiosReq.post("/posts/", formData);
      history.push(`/posts/${data.id}`);
    } catch (error) {
      //console.log(error);
      if (error.response?.status !== 401) {
        setErrors(error.response?.data);
      }
    }
  };

  const textFields = (
    <div>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.title?.map((msg, idx) => (
        <Alert variant="warning" key={idx}>
          {msg}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Category</Form.Label>
        {errors.category?.map((msg, idx) => 
        (
          <Alert variant="warning" key={idx}>
            {msg}
          </Alert>
        ))}
      <Form.Control
        as="select"
        name="category"
        value={category}
        onChange={handleChange}
        aria-label="category"
      >
        {Object.entries(categoryOptions).map(([value, text]) => (
          <option key={value} value={value}>{text}</option>
        ))}
      </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="content"
          value={content}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.content?.map((msg, idx) => (
        <Alert variant="warning" key={idx}>
          {msg}
        </Alert>
      ))}
    </div>
  );
  const imageField = (
    <div>
      <Form.Group className="text-center">
        {image ? (
          <>
            <figure>
              <Image src={image} />
            </figure>
            <div>
              <Form.Label
                className={`${btnStyles.Button} btn`}
                htmlFor="image-upload"
              >
                Change
              </Form.Label>
            </div>
          </>
        ) : (
          <Form.Label
            className="d-flex justify-content-center"
            htmlFor="image-upload"
          >
          <Col>
              <figure className={btnStyles.Button}>
                  <Image src={cloud} height="100"/>Upload image
              </figure>
            <Asset message="Upload image" />        
          </Col>
          </Form.Label>
        )}
        <Form.File
          className="d-none"
          id="image-upload"
          accept="image/*"
          onChange={changeImage}
          ref={imageInput}
        />
      </Form.Group>
      {errors?.image?.map((msg, idx) => (
              <Alert variant="warning" key={idx}>
                {msg}
              </Alert>
            ))}
  </div>
  );
  const formButtons = (
    <Row className={styles.RowSpacing}>
          <Button type="submit" className={btnStyles.Button}>
            S H A R E
          </Button>

          <Button onClick={() => history.goBack()} className={btnStyles.Button}>
            C a n c e l
          </Button>
        </Row>
  );
  return (
    <Container className={appStyles.Content}>
      <Form onSubmit={handleSubmit}>
        <h1 className="text-center">share</h1>
        <h3 className="text-center text-secondary">post</h3>
          <Container>{textFields}</Container>
          <Container>{imageField}</Container>
          <Container>{formButtons}</Container>
      </Form> 
    </Container>
  );
}

export default CreatePostForm; 