import React from 'react';
import Header from '../components/Header.js'
import LoginForm from '../components/LoginForm.js'

function Login() {
  return (
      <>
      <Header title={`Identification`} />
      <main>
        <div className="container">
          <LoginForm loginType={`login`}/>
        </div>
      </main>
      </>
  );
}

export default Login;
