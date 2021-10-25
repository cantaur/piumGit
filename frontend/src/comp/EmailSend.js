import axios from "axios";
import React, { useEffect, useState } from "react"
import {pub} from './Helper.js'
import {FloatingLabel, Form, Button} from 'react-bootstrap'
import { Link, useParams, withRouter, useHistory } from "react-router-dom";
import {CSSTransition} from 'react-transition-group';
import {connect} from 'react-redux';



function EmailSend(p){
  
  const history = useHistory()
  const {email} = useParams()
  useEffect(()=>{
    if(!email){
      history.push('/err')
    }
  },[])
  

  return(
    <>
      <div className="loginBack">
        <div className="loginCon emailAuthCon">
          <div className="checkDiv">
            <i class="far fa-paper-plane" style={{marginLeft:'-3px'}}></i>
          </div>
          <p className="emailText">{email}</p>
          <div className="msgBox">
            이메일을 발송하였습니다.
            <br/>
            메일을 확인하여 인증을 완료해주세요.
          </div>
          <Button className="registBtn" onClick={()=>{
            history.push('/sign/login')
          }}>로그인 하러가기</Button>
        </div>
      </div>
    </>
  )
}
function transReducer(state){
  return {
    loading : state.loading
  }
}

export default connect(transReducer)(EmailSend);