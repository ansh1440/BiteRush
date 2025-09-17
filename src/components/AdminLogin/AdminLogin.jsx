import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminLogin = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:8080/api/login', {
          email: credentials.email,
          password: credentials.password
        });
        if (response.status === 200) {
          localStorage.setItem('adminToken', response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Admin login successful!');
          onLogin();
        }
      } else {
        const response = await axios.post('http://localhost:8080/api/register', credentials);
        if (response.status === 201) {
          toast.success('Registration successful! Please login.');
          setIsLogin(true);
          setCredentials({name: '', email: '', password: ''});
        }
      }
    } catch (error) {
      toast.error(isLogin ? 'Login failed. Please check credentials.' : 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <div className="card" style={{width: '400px'}}>
        <div className="card-body">
          <h4 className="card-title text-center mb-4">
            {isLogin ? 'Admin Login' : 'Admin Register'}
          </h4>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={credentials.name}
                  onChange={(e) => setCredentials({...credentials, name: e.target.value})}
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              {isLogin ? 'Login' : 'Register'}
            </button>
            <div className="text-center mt-3">
              <button 
                type="button" 
                className="btn btn-link"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Need to register?' : 'Already have account?'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;