import axios from "axios";
import React, { useEffect, useState } from "react"
import {pub, host} from './Helper.js'
import {FloatingLabel, Form, Button} from 'react-bootstrap'
import { Link, useParams, withRouter, useHistory } from "react-router-dom";
import {CSSTransition} from 'react-transition-group';
import {connect} from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';



function EmailAuth(p){

  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }


  
  const history = useHistory()
  const email = getParameterByName('email')
  const authKey = getParameterByName('authKey')

  const [emailLoading, emailLoadingCng] = useState(false)
  useEffect(()=>{
    if(!authKey){
      history.push('/err')
    }else {
      if(!email){
        history.push('/err')
      } else {
        emailLoadingCng(false);
        axios.post(host+'/ajax/signUpConfirm', {
          'member_email' : email,
          'authKey' : authKey,
        })
        .then((r)=>{
          console.log(r.data)
          console.log(email+', '+authKey)

          emailLoadingCng(true)
        })
        .catch((e)=>{
          console.log(e)
          console.log(email+', '+authKey)

          // history.push('/err')
        })
      }
    }

  },[])
  

  return(
    <>
      <div className="loginBack">
        <div className="loginCon emailAuthCon">
          {
            emailLoading &&
            <div className={'checkDiv'}>
              <i class={'fas fa-check'}></i>
            </div>
          }
          
          
          {
            emailLoading &&
            <>
              <p className="emailText">{email}</p>
              <div className="msgBox">
                계정의 인증이 완료되었습니다.
                <br/>
                가입한 정보로 로그인 해주세요.
              </div>
              <Button className="registBtn" onClick={()=>{
                history.push('/sign/login')
              }}>로그인 하러가기</Button>
            </>
            
          }
          {
            !emailLoading &&
            <>
            <div className={"iconArea"} style={{marginBottom:'2rem'}}>
                <CircularProgress />
            </div>
            <div className="msgBox">
              인증 처리 중입니다.
            </div>
            </>
            
          }
          
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

export default connect(transReducer)(EmailAuth);