import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useEffect, useState, useLayoutEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import { apply_project } from '../Components/Function/project_function'
import { Link as RouterLink } from "react-router-dom"
import Link from '@mui/material/Link';
function FeaturedPost() {
    const { id } = useParams();
    const [project, setProject] = useState({ candidate: [] });
    const [status, setStatus] = useState(0);
    const [freelancer, setFreelancer] = useState({skillset:[],language:[]});
    const project_id = localStorage.getItem("project_id");

    // let freelancers = []
    useEffect(() => {
        const get_projects = async () => {
            await axios.get(process.env.REACT_APP_HOST + `api/freelancers/get/${id}`)
                .then((response) => {
                    setFreelancer(response.data);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        get_projects();
        console.log("hi")
    },[])
    const accept = async (freelancer_id) => {
        const res = await axios.put(`${process.env.REACT_APP_HOST}api/projects/accept/${project_id}`, { freelancer_id });
        console.log(status);
        setStatus(res.status);
    }
    return (
        <Container component="main" maxWidth="lg">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card sx={{ display: 'flex' }}>
                            <CardContent sx={{ flex: 1 }}>
                                <Typography component="h1" variant="h2">
                                    {freelancer.name}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    email: {freelancer.email}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    phone number: {freelancer.phone}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Skillset : {freelancer.skillset.join(" , ")}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Languages : {freelancer.language.join(" , ")}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    country : {freelancer.country}
                                </Typography>
                            </CardContent>

                        </Card>
                    </Grid>
                    {status == 200 ?
                        <Grid item xs={12} sx={{ mt: 3, mb: 2 }}>
                            <Alert severity="success"> You have successfully accepted {freelancer.name} for this project.</Alert>
                        </Grid> : 
                        localStorage.getItem("project_id") ?
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                onClick={() => accept(freelancer._id)}
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Accept
                            </Button>
                        </Grid> :
                        <Grid item xs={12}>
                            <Button
                                onClick={() => accept(freelancer.id)}
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Invite
                            </Button>
                        </Grid>
                    }

                </Grid>
            </Box>

        </Container>

    );
}


export default FeaturedPost;