import axios from "axios";
import React, { useEffect, useState, useLocation } from "react"
import {pub, host} from './Helper.js'
import {FloatingLabel, Form, Button, Alert} from 'react-bootstrap'
import { Link, useParams, withRouter, useHistory } from "react-router-dom";
import {CSSTransition} from 'react-transition-group';
import {connect} from 'react-redux';
import GoogleLogin from 'react-google-login';
import KakaoLogin from 'react-kakao-login';
import NaverLogin from 'react-naver-login';

const { naver } = window;

function Sign(p){
  const googleCid = process.env.REACT_APP_GOOGLE_CID;
  const naverCid = process.env.REACT_APP_NAVER_CID;
  const kakaoCid = process.env.REACT_APP_KAKAO_CID;


  const onFailure = async(r) => {
    //
  }

  const onSuccessGoogle = async(r) => {
    p.dispatch({type:"loadingOn"})
    axios.post(host+'/ajax/google/login', {
      member_email : r.profileObj.email,
      member_pw : r.profileObj.googleId,
      member_platform : "google"
    })
    .then((r)=>{
      p.dispatch({type:"loadingOff"})
      history.push('/project')
    })
    .catch(e=>{
      p.dispatch({type:"loadingOff"})
      console.log(e)
    })
  }

  const onSuccessKakao = async(r) => {
    console.log(r.data)
  }


  


  let [signUpData, signUpDataCng] = useState({'email':'', 'pw':'', 'pwCheck':'','dupEmail':false});

  function emailRegFunc(mail){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
      return true
    }else{
      return false
    }
  }

  function signEmailCheck(){
    if(signUpData['email'] == ''){
      return true;
    }else {
      if(emailRegFunc(signUpData['email'])){
        return true;
      }else {
        return false;
      }
    }
    
  }

  function signPwCheck(){
    if(signUpData['pw'] == '' && signUpData['pwCheck'] == ''){
      return true
    } else {
      if(signUpData['pw'] === signUpData['pwCheck']){
        return true;
      }else {
        return false;
      }
    }
    
  }
  function totalCheck(){
    if(signUpData['pw'] != '' && signUpData['pwCheck'] != '' && signUpData['email'] != '' && signPwCheck() && signPwCheck()){
      return true 
    }else {
      return false
    }
  }


  function signUpAxios(){
    p.dispatch({type:"loadingOn"})
    axios.post(host+'/ajax/regist', {
      member_email : signUpData['email'],
      member_pw : signUpData['pw'],
      member_platform : "pium"
    })
    .then((r)=>{
      p.dispatch({type:"loadingOff"})
      if(r.data == 'fail'){
        let signData = {...signUpData}
        signData['dupEmail'] = true;
        signUpDataCng(signData);
      } else if(r.data == 'success') {
        history.push('/emailSend/'+signUpData['email'])
      }
    })
    .catch((e)=>{
      p.dispatch({type:"loadingOff"})
      
      console.log(e)
    })
  }



  let { type, fail } = useParams();
  const history = useHistory()

  let [naverUrl, naverUrlCng] = useState('');


  //로컬호스트인 경우에만 소셜로그인 노출, 아닐경우 게스트로그인_포트폴리오용
  const [showGuestBtn, showGuestBtnCng] = useState(false);

  useEffect(()=>{
    if(type != 'login' && type != 'signup'){
      history.push('/sign/login')
    }
    
    if(fail != '' && fail != 'fail'){
      history.push('/sign/login')
    }

    axios.get('/ajax/naver')
    .then(r=>{
      naverUrlCng(r.data)
    })
    // if(p.loginUser.email != ''){
    //   history.push('/project')
    // }


    axios.get(host+'/ajax/loginUser')
    .then(r=>{
      if(r.data == 'false'){
        console.log('---로그인한 유저없음---')
        p.dispatch({type:'logout'})
        
      }else {
        if(r.data.email){
          p.dispatch({type:'login', email:r.data.email, seq:r.data.seq})
          console.log('---로그인한 유저---')
          console.log(p.loginUser)
          history.push('/project')
        }else {
          console.log('---로그인한 유저없음---')
          p.dispatch({type:'logout'})
        }
      }
    })
    .catch(e=>{
      console.log(e)
      p.dispatch({type:'logout'})
    })
    if(window.location.href.indexOf('localhost:') != -1){//로컬인경우
      showGuestBtnCng(false)
    }else{//로컬이 아닌경우 (포폴)
      showGuestBtnCng(true)

    }

  },[])
  

  return(
    <>
      
      <div className="loginBack">
        
        <div className="loginCon">
          
          <div className={"logoWrap " + (type=='signup'?"logoTrans":"")}>
            <img src={pub.img+'logo.svg'} className="logo"/>
            <p>회원가입</p>
          </div>
          
          <div className="form">
            {
              fail=='fail' &&
              <Alert variant={'danger'} style={{fontSize:'.8rem'}}>
                로그인 정보가 일치하지 않습니다.
              </Alert>
            }
            {
              type=='login' &&
                <>
                  <form action="/login" method="post">
                    <Form.Group className="mb-2" controlId="formBasicEmail">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="이메일 주소"
                      >
                        <Form.Control type="email" name="username" required placeholder="name@example.com"/>
                      </FloatingLabel>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <FloatingLabel controlId="floatingPassword" label="비밀번호">
                        <Form.Control type="password" name="password" required placeholder="비밀번호"/>
                      </FloatingLabel>
                    </Form.Group>

                    <Button className="loginBtn" type="submit">로그인</Button>

                  </form>
                </>
            }
            {
              type=='signup' &&
              <>
              {
                signUpData['dupEmail'] &&
                <Alert variant={'danger'} style={{fontSize:'.8rem'}}>
                  이미 가입된 이메일입니다.
                </Alert>
              }
                
                <Form.Group className="mb-2" controlId="formBasicEmail">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="이메일 주소"
                  >
                    <Form.Control type="email" placeholder="name@example.com" onChange={(e)=>{
                      let signData = {...signUpData}
                      signData['email'] = e.target.value;
                      signUpDataCng(signData);
                      

                    }}/>
                  </FloatingLabel>
                  <p className={'infoText ' + (signEmailCheck() ? '' : 'on')}>이메일 형식을 확인해주세요.</p>

                </Form.Group>

                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <FloatingLabel controlId="floatingPassword" label="비밀번호">
                    <Form.Control type="password" placeholder="비밀번호" onChange={(e)=>{
                      let signData = {...signUpData};
                      signData['pw'] = e.target.value;
                      signUpDataCng(signData);
                      
                    }}/>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className={type=='signup'?'mb-3':'close'} controlId="formBasicPassword">
                  <FloatingLabel controlId="floatingPassword" label="비밀번호 확인">
                    <Form.Control type="password" placeholder="비밀번호 확인" onChange={(e)=>{
                      let signData = {...signUpData}
                      signData['pwCheck'] = e.target.value;
                      signUpDataCng(signData);
                      
                    }} onKeyPress={(e)=>{
                      if(e.key == 'Enter'){
                        if(totalCheck()){
                          signUpAxios()
                        }
                      }
                    }}/>
                  </FloatingLabel>
                  <p className={'infoText ' + (signPwCheck() ? '' : 'on')}>비밀번호가 일치하지 않습니다.</p>

                </Form.Group>

              </>
            }
            
            
            {
              type=='login' &&
                <>
                  <Link to="/sign/signup" className="registBtn btn btn-primary">회원가입</Link>
                </>
            }
            {
              type=='signup' &&
              <>
                <Button className="loginBtn" disabled={!totalCheck()?'disabled':''} onClick={signUpAxios}>가입하기</Button>
                <Link to="/sign/login" onClick={()=>{
                  signUpDataCng({'email':'', 'pw':'', 'pwCheck':'','dupEmail':false});
                }} className="registBtn btn btn-primary">로그인으로 돌아가기</Link>
              </>
            }
            

            
          </div>
          {
            !showGuestBtn ?
            <div className={'social ' + (type=='signup'?'close':'')}>
              <div className="socialWrap">
              
                <GoogleLogin className="socialBtn"
                  icon={false}
                  buttonText=""
                  clientId={googleCid}
                  onSuccess={onSuccessGoogle}
                  onFailure={onFailure}
                  cookiePolicy={'single_host_origin'}
                >
                  <img src={pub.img+'google.png'}/>
                </GoogleLogin>
                <p className="toolTip" style={{'right':'-13px'}}><div></div>구글로 로그인</p>

              </div>
              

              <div className="socialWrap" >

                <div className="socialBtn" onClick={()=>{
                  window.location.href = naverUrl;
                }}>
                  <div id="naverIdLogin"></div>
                  <img src={pub.img+'naver.png'}/>
                </div>

                
                <p className="toolTip"><div></div>네이버로 로그인</p>

              </div>


              {/* <KakaoLogin className="socialBtn"
                token={kakaoCid}
                render={renderProps => (
                  <div className="socialWrap">
                    <div className="socialBtn" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                      <img src={pub.img+'kakao.png'}/>
                    </div>
                    <p className="toolTip"><div></div>카카오로 로그인</p>
                  </div>
                )}
                onSuccess={onSuccessKakao}
                onFailure={onFailure}
              /> */}
                  
                
                {/*<p onClick={()=>{window.location.href=naverUrl}}>네이버로그인 테스트용</p>*/}
            </div>
            :
            <div className={'guestBtnWrap ' + (type=='signup'?'close':'')}>
              <p className="msg">손님이신가요?<br/><b>게스트 계정으로 서비스를 체험</b>해보세요.</p>
              <form action="/login" method="post">
                <input type="hidden" value="guest@pium.com" name="username"/>
                <input type="hidden" value="1234" name="password"/>
                
                <button className="guestBtn" type="submit">
                  <i class="fas fa-user"></i> 게스트로 로그인
                </button>
              </form>
            </div>
            
          }
          <p className="info">Copyright © pium 2021.</p>
        </div>
        
      </div>
    </>
  )
}
function transReducer(state){
  return {
    loading : state.loading,
    loginUser : state.loginUser
  }
}

export default connect(transReducer)(Sign);