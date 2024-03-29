import React, {useState} from "react";
import axios from 'axios'
import {connect} from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from 'prop-types';

const Register = ({setAlert, register, isAuthenticated}) => {
  const [formData, setFormData] = useState({
    name:'',
    email:'',
    password:'',
    password2:''
  });
  
  const {name, email, password, password2} = formData;

  const onChange = e => setFormData({...formData,[e.target.name]:e.target.value});

  const onSubmit = async e => {
    e.preventDefault();
    if(password!=password2){
      setAlert('paswords do not match','danger')
    }else{
      register({name, email, password})
    }
  }

  //Redirect if logged in
  if(isAuthenticated){
    return <Navigate to="/dashboard"/>
  }

  return (
    <>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={e=>onSubmit(e)} action="create-profile.html">
        <div className="form-group">
          <input value={name} onChange={e=>onChange(e)} type="text" placeholder="Name" name="name" required />
        </div>
        <div className="form-group">
          <input value={email} type="email" onChange={e=>onChange(e)} placeholder="Email Address" name="email" />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={e=>onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            minLength="6"
            onChange={e=>onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="login">Login</Link>
      </p>
    </>
  );
};


Register.prototype = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}


const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps,{setAlert,register})(Register);
