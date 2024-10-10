import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isLoading } from '../stores/movieSlice';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Mylist from './Mylist';
import MovieDetails from './MovieDetails';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';

import { MdHome } from "react-icons/md";
import { MdPlaylistPlay } from "react-icons/md";
import { MdOutlineInvertColors } from "react-icons/md";

const Navigation = (props) => {
  const { handleLogin, loggedin } = props;
  const [user, setUser] = useState({});

  const [changeColor,setChangeColor] = useState(false)

  const handleColorChange = () => {
    setChangeColor(!changeColor)
  }


  const loading = useSelector((state) => state.movies.loading);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  useEffect(() => {
    if (loggedin) {
      const token = localStorage.getItem('token');
      if (token) {
        axios
          .get('https://api.escuelajs.co/api/v1/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setUser(response.data);
          })
          .catch((err) => {
            console.log('Error:', err.response ? err.response.data : err.message);
          });
      }
    }
  }, [loggedin]);

  useEffect(() => {
    const storedColor = localStorage.getItem('changecolor');
    if (storedColor !== null) {
      setChangeColor(JSON.parse(storedColor)); // Set the initial state based on localStorage
    }
  }, []);

  // Update localStorage whenever changecolor changes
  useEffect(() => {
    localStorage.setItem('changecolor', changeColor);
  }, [changeColor]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d34',
      cancelButtonColor: '#1672fc',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Logged out!',
          text: 'Successfully logged out',
          icon: 'success',
        });
        localStorage.removeItem('token');
        handleLogin();
        navigate('/login');
      }
    });
  };

  return (
    <div>
      <Navbar className="bg-light">
        <Container>
          <Navbar.Brand as={Link} to="/" expand="lg">
            <h1 className={changeColor ? "text-primary" : "text-danger"} style={{ cursor: 'pointer' }}>
              Watchlists
            </h1>
          </Navbar.Brand>
          <Navbar.Collapse>
            <Nav variant="underline" defaultActiveKey="/">
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/"
                  eventKey="/" // Set eventKey for active state
                  active={location.pathname === '/'}
                  className={location.pathname === '/' ? (changeColor ? 'text-primary' : 'text-danger') : ''} // Check if the current path is home
                >
                  <MdHome size={21} /> Home
                </Nav.Link>
              </Nav.Item>
              {loggedin && (
                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to={`/list/${user.id}`}
                    eventKey={`/list/${user.id}`} // Set eventKey for active state
                    active={location.pathname === `/list/${user.id}`}
                    className={
                        location.pathname === `/list/${user.id}`
                          ? (changeColor ? 'text-primary' : 'text-danger') // Correctly set the class name based on changecolor
                          : ''
                      }
                
                  >
                   <MdPlaylistPlay size={22} /> My Watchlist
                  </Nav.Link>
                </Nav.Item>
              )}
              
            </Nav>

          </Navbar.Collapse>

          <MdOutlineInvertColors onClick={handleColorChange} className='m-3' size={20} color={changeColor ? 'rgb(37, 156, 236)' : '#f33f40'} title={changeColor ? 'Switch to red colour' : 'Switch to blue colour'} />
          
          {loggedin ? (
            <NavDropdown title={user.email}>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <NavDropdown title="Login/Signup">
              <NavDropdown.Item as={Link} to="/login">
                Login
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/signup">
                Signup
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </Container>
      </Navbar>

      <Routes>
        <Route
          path="/"
          element={<Home user={user} loggedin={loggedin} isLoading={isLoading} loading={loading} changeColor={changeColor} setChangeColor={setChangeColor} />}
        />
        <Route
          path="/signup"
          element={<Signup handleLogin={handleLogin} navigate={navigate} changeColor={changeColor} />}
          exact={true}
        />
        <Route
          path="/login"
          element={<Login handleLogin={handleLogin} navigate={navigate} changeColor={changeColor} />}
          exact={true}
        />
        <Route
          path="/list/:id"
          element={<Mylist loggedin={loggedin} user={user} isLoading={isLoading} loading={loading} exact={true} changeColor={changeColor} />}
        />
        <Route
          path="/moviedetails/:id"
          element={<MovieDetails user={user} loggedin={loggedin} isLoading={isLoading} loading={loading} changeColor={changeColor} />}
        />
      </Routes>
    </div>
  );
};

export default Navigation;
