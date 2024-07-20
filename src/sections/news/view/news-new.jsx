import React, { useEffect, useRef, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CircularProgress, Container, Stack, TextField } from '@mui/material';
import styled from 'styled-components';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { storage } from 'src/firebase';
import { toast } from 'react-toastify';
import { addNewNews } from 'src/firebase/news';
import { useNavigate } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const AlignStyle = Quill.import('attributors/style/align');
Quill.register(AlignStyle, true);

const Form = styled.form`
    & .image-holder {
      width: 320px;
      height: 180px;
      position: relative;
      margin: 0 auto;
      padding: 3px;
      border: 2px solid gray;
      display: flex;
      align-items: center;
      justify-content: center;
  
      & > .news-img {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
  
      & > label {
        cursor: pointer;
        position: absolute;
        inset: 0;
        z-index: 2;
      }
    }
`

export default function NewsNew() {
    const [working, setWorking] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [pdfFile, setPdfFile] = useState(null); // State for storing the PDF file
    const [content, setContent] = useState('');

    const navigate = useNavigate();


    const handlePdfChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file); // Update state with selected PDF file
        } else {
            alert('Invalid file type. Please select a PDF.');
        }
    };



    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        let pdfUrl = '';


        if (pdfFile) {
            const storageRef = ref(storage, `pdfs/${Date.now()}-${pdfFile.name}`);

            try {
                setWorking(true); // If you have a loading state
                const snapshot = await uploadBytes(storageRef, pdfFile);
                pdfUrl = await getDownloadURL(snapshot.ref);
            } catch (error) {
                toast.error('Error in uploading PDF'); // Handle upload error
            } finally {
                setWorking(false); // Reset loading state
            }
        }

        const title = formData.get('title');
        const author = formData.get('author');
        const publish_date = new Date(formData.get('publish_date'));

        await addNewNews({ title, author, publish_date, pdf_url: pdfUrl, image_url: imageUrl, content, pdf_title: pdfFile ? pdfFile.name : 'Attachment.pdf' });

        navigate(-1);

        // Process your form data...
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const storageRef = ref(storage, `profile-images/${Date.now() + file.name}`);

            setUploading(true);
            uploadBytes(storageRef, file)
                .then(() => {
                    getDownloadURL(storageRef).then((url) => {
                        setImageUrl(url);
                    });
                })
                .catch((error) => {
                    toast.error(error.message);
                })
                .finally(() => {
                    setUploading(false);
                });
        } else {
            alert('Invalid file type or no image selected.');
        }
    };

    console.log(content);

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Compose News</Typography>
            </Stack>

            <Card sx={{
                minWidth: 275,
                borderRadius: '20px',
                padding: 2 // Round corners
            }}>
                <CardContent>
                    <Form autoComplete="off" onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <div className="image-holder">
                                Select Image
                                <label htmlFor="news-image"></label>
                                {imageUrl && <img src={imageUrl} alt="" className="news-img" />}
                            </div>
                            {uploading && <CircularProgress />}

                            <input
                                type="file"
                                id="news-image"
                                name="imageUrl"
                                style={{ display: 'none' }}
                                accept="image/*" // Specify that only image files are allowed
                                onChange={handleImageChange}
                            />
                            <TextField
                                required
                                id="title"
                                name="title"
                                label="Title"
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                required
                                id="author"
                                name="author"
                                label="Author"
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                required
                                name="publish_date"
                                id="publish-date"
                                label="Publish Date"
                                type="date"
                                defaultValue=""
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                            />
                            <ReactQuill theme='snow' value={content} onChange={setContent} modules={{
                                toolbar: [
                                    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    [{ 'align': [] }], // align options
                                    ['link', 'image'], // link and image
                                    ['clean'] // remove formatting button
                                ]
                            }} />

                            <input
                                type="file"
                                id="pdf-upload"
                                name="pdfFile"
                                style={{ display: 'none' }} // Hide the default file input styling
                                accept="application/pdf" // Accept only PDF files
                                onChange={handlePdfChange}
                            />
                            <label htmlFor="pdf-upload">
                                <Button variant="outlined" component="span">
                                    Upload PDF {pdfFile && ` : ${pdfFile.name}`}
                                </Button>
                            </label>


                            <Button type='submit' variant="contained" color="primary" disabled={working}>
                                {working ? <CircularProgress color="info" size={22} /> : 'Submit'}
                            </Button>
                        </Stack>
                    </Form>
                </CardContent>
            </Card>
        </Container>
    )
}
