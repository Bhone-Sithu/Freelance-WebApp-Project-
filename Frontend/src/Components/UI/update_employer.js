import * as React from 'react';
import { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import InsertDriveFile from '@mui/icons-material/InsertDriveFile';
import axios from "axios"
import { employer_register, employers_get, employer_update } from '../Function/employer_function';

let countryList = require('../../country.js')


const theme = createTheme();

export default function Update_Employer() {
    const navigate = useNavigate();
    const { id } = useParams()
    let country_array = countryList.map((country) => {
        return <MenuItem value={country}>{country}</MenuItem>
    })
    const [first_time, setFirstTime] = React.useState(true);
    const [status, setStatus] = React.useState(0);
    const [reload, setReload] = React.useState(false);
    const [file, setFile] = React.useState();
    const [preview, setPreview] = React.useState("");
    const [is_preview, setIsPreview] = React.useState(false);
    const [employer, setEmployer] = React.useState({
        email: " ",
        password: " ",
        phone: " ",
        name: " ",
        country: " ",
        company_name: " ",
        company_size: " ",
        company_address: " ",
        company_industry: "Web and Mobile Software",
        profile_photo: " ",
    });
    const [country, setCountry] = React.useState(0);
    const [error, setError] = React.useState({
        email: "",
        password: "",
        phone: "",
        name: "",
        country: "",
        company_name: "",
        company_size: "",
        company_address: "",
        company_industry: "",
        profile_photo: "",
    });

    const validation = async (data) => {
        let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        let temp = {
            email: "",
            password: "",
            phone: "",
            name: "",
            country: "",
            company_name: "",
            company_size: "",
            company_address: "",
            company_industry: "",
            profile_photo: "",
        }
        let error_free = true
        let res = await axios.post(process.env.REACT_APP_HOST + "api/employers/email_duplicate", { email: data.get("email"), id })
        if (res.data.is_duplicate) { temp.email = "Email is already taken"; error_free = false }
        if (!data.get("email").match(pattern)) { temp.email = "Invalid Email"; error_free = false }
        if (data.get("password").trim() === "") { temp.password = "Password is Required!"; error_free = false }
        if (data.get("phone").trim() === "") { temp.phone = "Phone is Required!"; error_free = false }
        if (data.get("name").trim() === "") { temp.name = "name is Required!"; error_free = false }
        if (data.get("company_name").trim() === "") { temp.company_name = "company_name is Required!"; error_free = false }
        if (data.get("company_size").trim() === "") { temp.company_size = "company_size is Required!"; error_free = false }
        if (data.get("company_address").trim() === "") { temp.company_address = "company_address is Required!"; error_free = false }
        if (data.get("country").trim() === "") { temp.country = "country is Required!"; error_free = false }
        if (data.get("company_industry").trim() === "") { temp.company_industry = "company_industry is Required!"; error_free = false }
        setError(temp)
        return error_free;
    }
    const handleChange = async (event) => {
        let temp = employer
        let key = event.target.name
        let value = event.target.value
        console.log(event.target)
        temp[key] = value

        setEmployer(temp)
        setReload(!reload)

    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        data.append("file", file);
        data.append("profile_photo", employer.profile_photo)
        let validate_result = await validation(data)

        if (validate_result) {
            console.log(validate_result)
            const status_code = await employer_update(data, id);
            setStatus(status_code);
            navigate('../employer_list')
        }


    };
    useEffect(() => {
        if (file) {
            const file_reader = new FileReader();
            file_reader.onload = () => {
                setPreview(file_reader.result)
            };
            file_reader.readAsDataURL(file);
            setIsPreview(file.name.match(/\.(jpeg|jpg|png)$/));
        }
        if (first_time) {
            console.log("hi")
            axios.get(process.env.REACT_APP_HOST + `api/employers/get/${id}`)
                .then((response) => {
                    setEmployer(response.data);

                })
                .catch((error) => {
                    console.log(error);
                })
            setFirstTime(false);
        }


    }, [reload])
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Employer Update Form
                    </Typography>
                    {is_preview ?
                        <IconButton size="large" variant="contained" component="label">
                            <img src={preview} width={200} height={200} style={{ borderRadius: "50%" }} />
                            <EditIcon sx={{ position: 'absolute', color: "white", backgroundColor: "#8f78ff", borderRadius: 15, fontSize: 40, p: 0.5, bottom: 0, left: 20, top: "70%" }} />
                            <input type="file" onChange={(e) => {
                                setFile(e.target.files[0]);
                                setReload(!reload)
                            }} hidden />
                        </IconButton>
                        :
                        <IconButton size="large" variant="contained" component="label">
                            <img src={process.env.REACT_APP_HOST + "images/" + employer.profile_photo} width={200} height={200} style={{ borderRadius: "50%" }} />
                            <EditIcon sx={{ position: 'absolute', color: "white", backgroundColor: "#8f78ff", borderRadius: 15, fontSize: 40, p: 0.5, bottom: 0, left: 20, top: "70%" }} />
                            <input type="file" onChange={(e) => {
                                setFile(e.target.files[0]);
                                setReload(!reload)
                            }} hidden />
                        </IconButton>
                    }


                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            {status === 201 ? <Grid item xs={12}>
                                <Alert severity="success">Updated Successfully</Alert>
                            </Grid> : null}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    sx={{ backgroundColor: "white" }}
                                    onChange={handleChange}
                                    value={employer.email}
                                    variant="outlined"
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    error={error.email === "" ? false : true}
                                    helperText={error.email}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    sx={{ backgroundColor: "white" }}
                                    onChange={handleChange}
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    error={error.password === "" ? false : true}
                                    helperText={error.password}
                                    value={employer.password}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    sx={{ backgroundColor: "white" }}
                                    onChange={handleChange}
                                    value={employer.phone}
                                    fullWidth
                                    id="phone"
                                    label="Phone Number"
                                    name="phone"
                                    error={error.phone === "" ? false : true}
                                    helperText={error.phone}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    sx={{ backgroundColor: "white" }}
                                    onChange={handleChange}
                                    value={employer.name}
                                    fullWidth
                                    id="name"
                                    label="User Name"
                                    name="name"
                                    error={error.name === "" ? false : true}
                                    helperText={error.name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>

                                <FormControl fullWidth error={error.country === "" ? false : true}>
                                    <InputLabel id="country">Country</InputLabel>
                                    <Select
                                        sx={{ backgroundColor: "white" }}
                                        labelId="country"
                                        id="country"
                                        label="Country"
                                        name="country"
                                        value={employer.country}
                                        onChange={handleChange}
                                    >
                                        {country_array}

                                    </Select>
                                    <FormHelperText>{error.country}</FormHelperText>
                                </FormControl>

                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    sx={{ backgroundColor: "white" }}
                                    value={employer.company_name}
                                    fullWidth
                                    id="company_name"
                                    label="Company Name"
                                    onChange={handleChange}
                                    name="company_name"
                                    error={error.company_name === "" ? false : true}
                                    helperText={error.company_name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    sx={{ backgroundColor: "white" }}
                                    value={employer.company_size}
                                    fullWidth
                                    id="company_size"
                                    label="Company Size"
                                    onChange={handleChange}
                                    name="company_size"
                                    error={error.company_size === "" ? false : true}
                                    helperText={error.company_size}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={error.company_industry === "" ? false : true}>
                                    <InputLabel id="industry">Company Industry</InputLabel>
                                    <Select
                                        sx={{ backgroundColor: "white" }}
                                        labelId="industry"
                                        id="company_industry"
                                        label="Company Industry"
                                        name="company_industry"
                                        value={employer.company_industry}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={"Web and Mobile Software"}>Web and Mobile Software</MenuItem>
                                        <MenuItem value={"Business"}>Business</MenuItem>
                                        <MenuItem value={"Entertainment"}>Entertainment</MenuItem>
                                    </Select>
                                    <FormHelperText>{error.company_industry}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    sx={{ backgroundColor: "white" }}
                                    value={employer.company_address}
                                    fullWidth
                                    multiline
                                    id="company_address"
                                    label="Company Address"
                                    name="company_address"
                                    onChange={handleChange}
                                    error={error.company_address === "" ? false : true}
                                    helperText={error.company_address}
                                />
                            </Grid>


                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, backgroundColor: "#8f78ff" }}
                        >
                            Update
                        </Button>

                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
