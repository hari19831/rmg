import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './login.css';
import { axios } from "../config/axios/axios";
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import configJson from "../config/axios/config.json";
const ENV_MODE = configJson.Application.mode;
const ENV_APP = configJson.Application.application;
export const CommonConstants = {
    API_URL: configJson["CommonConstants"][ENV_APP][ENV_MODE]["API_URL"],
    basePath: configJson["CommonConstants"][ENV_APP][ENV_MODE]["Base_path"],
    sharedkey: configJson["CommonConstants"][ENV_APP][ENV_MODE]["sharedkey"]
};

class login extends Component {
   constructor() {
      super();

      this.state = {
         username: '',
         password: ''
      }

   }
   handleChange = (event) => {
      this.setState({
         [event.target.name]: event.target.value
      })
   }

   handleSubmit = (event) => {
      const { username, password } = this.state
      let userInfor = {
         username: username,
         password: password
      }
      event.preventDefault();
      axios.post(`${CommonConstants.API_URL}/login`, userInfor, { headers: { apikey: CommonConstants.sharedkey.key } })
         .then(response => {
            if (response.data.is_success) {
               localStorage.setItem('sharedkey', CommonConstants.sharedkey.key);
               this.props.history.push("/dashboard");
            } else if (response.data.is_success == false) {
               Swal.fire(
                  'invalid username or password',
                  'Please check your username or password',
                  'error'
               )
            }
         })
         .catch(error => {
            console.error('error', error);
            if (error.response && error.response.data && error.response.data.message) {
               toast.error(`Problem ${error.response.data.message}`);
            }
         });
   }
   render() {
      const { username, password } = this.state
      return (
         <div id="loginPage">
            <h2> RabbitMQ Admin Panel</h2>
            <div className="container" id="container">
               <div className="form-container sign-in-container">
                  <form onSubmit={this.handleSubmit} id="login">
                     <h1>Sign in</h1>
                     <input name="username" type="text" placeholder="Username" value={username} onChange={this.handleChange} />
                     <input name="password" type="password" placeholder="Password" value={password} onChange={this.handleChange} />
                     <button  >Sign In</button>
                  </form>
               </div>
               <div className="overlay-container">
                  <div className="overlay">

                  </div>
               </div>
            </div>
            <footer>
               <p>
                  Copy rights@integra software service private limited
      </p>
            </footer>
            <ToastContainer position="top-right" />
         </div>
      );
   }
}

export default withRouter(login);