import React from 'react';
import Header from '../components/Header.js'
import LoginForm from '../components/LoginForm.js'

function Registration() {

  // -----------------------
  // RENDER
  // -----------------------
  
  return (
      <>
      <Header title={`Inscription`} />
      <main>
        <div className="container">
          <LoginForm loginType={`registration`}/>
        </div>
      </main>
      </>
  );
}
export default Registration;
