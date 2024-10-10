import { useState } from "react"
import axios from 'axios'
import { Link } from "react-router-dom"

import { Container,Form, Button, Row, Col } from "react-bootstrap"
import Swal from "sweetalert2"

const Login = (props) => {

    const {handleLogin,navigate,changeColor} = props

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('changeme')
    const [errors,setErrors] = useState("")

    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    const handleSubmit = (e) => {

        e.preventDefault()
        const data = {
            email:email,
            password: password
        }

        axios.post('https://api.escuelajs.co/api/v1/auth/login',data)
        .then((response) => {
            localStorage.setItem("token", response.data.access_token)
            handleLogin()
            navigate("/")
            window.location.reload();
            console.log(response.data)
            Swal.fire({
                position: "top-center",
                icon: "success",
                title: "Succesfully logged in",
                showConfirmButton: false,
                timer: 1500
              });
        })
        .catch((err) => {
            if(err.response.status === 404 ){
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong! please try again later",
                  });
            }else{
                setErrors(err.response ? 'Please enter a valid email' : err.message);
            }
            navigate("/login")
        })
    }

    return(
        <div>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6} lg={4}>
                    <div className={changeColor ? "text-center text-white bg-primary p-3 rounded" : "text-center text-white bg-danger p-3 rounded"}>
                        <h2>Log in!</h2>
                    </div>
                    <div className="bg-light p-4 mt-2 rounded shadow-sm">
                    {errors && <p className="text-danger">{errors}</p>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="email">Email id</Form.Label>
                                <Form.Control type="text" id="email" name="email" value={email} onChange={handleChange} />
                                <Form.Control type="hidden" value={password} />
                            </Form.Group>
                            <Button variant={changeColor? "primary text-white" : "danger text-white"} type="submit" className="w-100">Login</Button>
                        </Form>
                        <p className="mt-3 text-center">
                            Dont have an account? <Link to="/signup" className={changeColor ? "text-primary" : "text-danger"}>Signup!</Link>
                        </p>
                    </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Login