import axios from "axios";
import React, { useEffect, useState } from "react"
import {pub} from './Helper.js'
import {FloatingLabel, Form, Button} from 'react-bootstrap'
import { Link, useParams, withRouter, useHistory } from "react-router-dom";
import {CSSTransition} from 'react-transition-group';
import {connect} from 'react-redux';

function ErrPage(){
  const history=useHistory();
  return(
    <>
      <div className="loginBack">
        <div className="loginCon emailAuthCon">
          <div className="checkDiv" style={{lineHeight:'80px'}}>
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <p className="emailText">잘못된 접근입니다.</p>
          <div className="msgBox">
            이용에 불편을 드려 죄송합니다.
            <br/>
            아래 링크를 통해 다시 시도해주세요.
          </div>
          <Button className="registBtn" onClick={()=>{
            history.push('/')
          }}>메인화면으로 가기</Button>
        </div>
      </div>
    </>
  )
}
export default ErrPage;
