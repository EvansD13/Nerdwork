import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom'



const apiURL = "https://nerdwork-qlxa.onrender.com
"
const siteURL = "https://nerdwork.onrender.com/"
const localURL = "http://localhost:5173/"
const localapi = "http://localhost:3003"


export default function UsernameForm({
  inputUn,
  setInputUn,
  inputPw,
  setInputPw,
  button_Text,
  setButtonText
}) {
  const navigate = useNavigate()
  const [loginStatus, setLoginStatus] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [inputEmail, setinputEmail] = useState("Email")
  const [inputDob, setInputDob] = useState("")
  const [inputAddress, setInputAddress] = useState("Address")

  function handleInputUN(e) {
    setInputUn(e.target.value);
  }
  function handleInputPW(e) {
    setInputPw(e.target.value);
  }
  function handleInputEmail(e) {
    setinputEmail(e.target.value);
  }

  function handleInputAddress(e){
    setInputAddress(e.target.value)
  }
  function handleInputDob(e) {
    const dob = document.getElementById("date-of-birth")
    setInputDob(dob.value);
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    let response; let data;
    
    if (button_Text === "Create Account"){
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: inputUn,
          email: inputEmail,
          password: inputPw,
          address: inputAddress
          
        }),
      }
      response = await fetch(`${apiURL}/auth/register`, options)
      data = await response.json()
      console.log(response)
    }
    else if (button_Text === "Login"){
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inputEmail,
          password: inputPw
        }),
      }
      console.log(options.body)
      response = await fetch(`${apiURL}/auth/login`, options)
      data = await response.json()
      console.log(response)
    }
    
    if (response.status == 200 || response.status == 201){
      localStorage.setItem("token", data.token)
      localStorage.setItem("email", inputEmail)
      navigate('/profile')
    }else{
      setLoginStatus('Email and/or password is invalid')
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  

  function revealPassword() {
    const x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  function pageRender(){
    if (button_Text == "Login"){
      return <br />
    }else if (button_Text == "Create Account"){
      return (
        <>
        <label htmlFor="username" className="input-label">
          <i className="material-icons ikon left" >person</i>
          <input
            className="Input"
            type="text"
            id="username"
            name="username"
            placeholder={inputUn}
            onChange={handleInputUN}
            data-testid="username"
          />
        </label>                
        <br />
        <label htmlFor="address" className="input-label">
          <i className="material-icons ikon left">house</i>
          <input
            className="Input"
            type="text"
            id="address"
            name="address"
            placeholder={inputAddress}
            onChange={handleInputAddress}
            data-testid="address"
          />
        </label>
        <br />

        </>
      )
    }
  }

  useEffect(() => {
    pageRender()
  }, [button_Text])

  return (
      <form id="login" onSubmit={handleSubmit} role="form" data-testid="login-form">
        <label htmlFor="email" className="input-label">
          <i className="material-icons ikon left">mail</i>
          <input
            className="Input"
            type="email"
            id="email"
            name="email"
            placeholder={inputEmail}
            onChange={handleInputEmail}
            data-testid="email"
          />
        </label>
        <br />
        <label htmlFor="password" className="input-label">
  <i className="material-icons ikon left">
    lock
  </i>
  <input
    className="Input"
    type={showPassword ? "text" : "password"}
    id="password"
    name="password"
    placeholder={inputPw}
    onChange={handleInputPW}
    data-testid="password"
  />
  <i
    className={`material-icons ikon right toggle-password ${showPassword ? "visible" : ""}`}
    onClick={togglePasswordVisibility}
    data-testid='toggle-password-button'
  >
    {showPassword ? "visibility" : "visibility_off"}
  </i>
</label>
{pageRender()}
        <button className="login-button" type="submit" data-testid="submit">
        {button_Text}
        </button>
        <p>{loginStatus}</p>
      </form>
  );
}


/*
        <br />
        <label htmlFor="date-of-birth" className="input-label">
          <input
            className="Input"
            type="date"
            id="date-of-birth"
            name="date-of-birth"
            onChange={handleInputDob}
            data-testid="date-of-birth"
          />
        </label>

*/