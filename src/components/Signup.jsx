import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";

const Signup = (props) => {
  const { handleLogin,navigate,changeColor } = props;

  const [name, setName] = useState("User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("changeme");
  const [avatar, setAvatar] = useState("https://picsum.photos/800");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: name,
      email: email,
      password: password,
      avatar: avatar,
    };

    axios.post("https://api.escuelajs.co/api/v1/users/", data)
    .then((response) => {
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "User Created",
        showConfirmButton: false,
        timer: 1500
      });
        navigate("/login");
        console.log(response.data);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! please try again later",
        });
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <div className={changeColor? "text-center bg-primary text-white p-3 rounded" : "text-center bg-danger text-white p-3 rounded"}>
            <h2>Sign Up!</h2>
          </div>
          <div className="bg-light p-4 mt-2 rounded shadow-sm">
            <Form onSubmit={handleSubmit}>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="email">Email id</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button variant={changeColor ? "primary text-white" : "danger text-white"} type="submit" className="w-100">
                Sign Up
              </Button>
            </Form>
            <p className="mt-3 text-center">
              Already have an account?{" "}
              <Link to="/login" className={changeColor ? "text-primary" :"text-danger"}>
                Login!
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
