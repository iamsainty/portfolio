import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const BlogContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: grid;
  grid-gap: 20px;
`;

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`;

const Label = styled.label`
  font-size: 1.2rem;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  ${(props) => props.active && `
    background-color: #007bff;
    color: #fff;
  `}
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 1rem;
`;

const NewBlog = () => {
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: '',
    shortDescription: '',
    content: EditorState.createEmpty(),
    blogUrl: '',
    tags: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [editorMode, setEditorMode] = useState('text'); // or 'html'

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog({ ...blog, [name]: value });
  };

  const handleContentChange = (contentState) => {
    setBlog({ ...blog, content: contentState });
  };

  const handleModeToggle = () => {
    setEditorMode(editorMode === 'text' ? 'html' : 'text');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (!blog.title.trim()) {
      setErrorMsg('Title cannot be empty');
      return;
    }
    if (!blog.shortDescription.trim()) {
      setErrorMsg('Short description cannot be empty');
      return;
    }
    if (!blog.blogUrl.trim()) {
      setErrorMsg('Blog URL cannot be empty');
      return;
    }
    // Convert content to HTML if in HTML mode
    let contentHTML = '';
    if (editorMode === 'html') {
      contentHTML = draftToHtml(convertToRaw(blog.content.getCurrentContent()));
      console.log('Content HTML:', contentHTML);
    } else {
      // Otherwise, get plain text from the editor state
      const contentPlainText = blog.content.getCurrentContent().getPlainText();
      console.log('Content Plain Text:', contentPlainText);
    }
    // Connect with backend and add the blog
    console.log('Blog added:', blog);
    // Reset form fields
    setBlog({
      title: '',
      shortDescription: '',
      content: EditorState.createEmpty(),
      blogUrl: '',
      tags: '',
    });
    setErrorMsg('');
  };

  return (
    <BlogContainer>
      <Title>Add a New Blog</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Title:</Label>
          <Input
            type="text"
            name="title"
            value={blog.title}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Short Description:</Label>
          <Input
            type="text"
            name="shortDescription"
            value={blog.shortDescription}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Content:</Label>
          {editorMode === 'html' ? (
            <Editor
              editorState={blog.content}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={handleContentChange}
            />
          ) : (
            <textarea
              value={blog.content.getCurrentContent().getPlainText()}
              onChange={(e) => handleContentChange(EditorState.createWithContent(htmlToDraft(e.target.value)))}
              rows={10}
            />
          )}
        </FormGroup>
        <FormGroup>
          <Label>Blog URL:</Label>
          <Input
            type="url"
            name="blogUrl"
            value={blog.blogUrl}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Tags:</Label>
          <Input
            type="text"
            name="tags"
            value={blog.tags}
            onChange={handleChange}
          />
          <small>Separate tags with commas (e.g., technology, programming)</small>
        </FormGroup>
        {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
        <ButtonContainer>
          <Button active={editorMode === 'text'} type="button" onClick={handleModeToggle}>
            Switch to Text
          </Button>
          <Button active={editorMode === 'html'} type="button" onClick={handleModeToggle}>
            Switch to HTML
          </Button>
          <Button type="submit">Submit</Button>
        </ButtonContainer>
      </Form>
    </BlogContainer>
  );
};

export default NewBlog;
