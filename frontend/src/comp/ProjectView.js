import axios from "axios";
import React, { useEffect, useState } from "react"
import {pub, colors, pages, seqColorTrans,host} from './Helper.js'
import DatePicker from './DatePicker.js'
import HeadSide from './HeadSide.js'
import Todo from './page/Todo.js'
import Notice from './page/Notice.js'
import Calendar from './page/Calendar.js'
import ProjectChart from './page/ProjectChart.js'
import FileList from './page/FileList.js'
import MileStone from './page/MileStone.js'
import MileStoneView from './page/MileStoneView.js'
import Task from './page/Task.js'
import TaskModal from './page/comp/TaskModal.js'

import {FloatingLabel, Form, Button, Dropdown, Alert, Modal} from 'react-bootstrap'
import { Link, useParams, withRouter, useHistory, useLocation } from "react-router-dom";
import {CSSTransition} from 'react-transition-group';
import {connect} from 'react-redux';
import TimeLine from "./page/TimeLine";



function ProjectView(p){
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const page = params.page;
  const prjSeq = params.seq;
  const prjColor = seqColorTrans(prjSeq);



  //프로필변경 모달 상태
  const [profileSetModal, profileSetModalCng] = useState(false);

  const profileSetModalClose = () => {
    profileSetModalCng(false)
  };
  const profileSetModalOpen = () => {
    profileSetModalCng(true)
  };

  //프로필 변경인지 변경알림인지
  const [profileMsg, profileMsgCng] = useState(false);

  //프로필 변경 정보
  const [profileSetInfo,profileSetInfoCng] = useState({img:'',name:''});

  //프로필 변경 이미지 미리보기용
  const [profileImgPreview,profileImgPreviewCng] =useState();

  //File 객체 base64로 변환
  const toBase64 = file => {
    let reader = new FileReader()
    reader.onload = e=> {
      profileImgPreviewCng(e.target.result);
    };

    reader.readAsDataURL(file);
  };


  //페이지 최초 접속시
  useEffect(()=>{

    const isPage = pages.find(e=> e === page)
    if(isPage == undefined){
      history.push('/404')
    } else {
      p.dispatch({type:"pagePush", val:isPage})
    }

    // 프로젝트 리스트 가져옴
    if(window.location.href.indexOf(':3000') != -1){ // 프론트용 샘플
      axios.get(host+'/ajax/myprojectTest/4')
      .then(r=>{
        p.dispatch({type:'projectListCng', val:r.data})
      })
      .catch(e=>{
        console.log(e)
      })
    }else{
      axios.get(host+'/ajax/loginUser')
      .then(r=>{
        if(r.data == 'false'){
          console.log('---로그인한 유저없음---')
          p.dispatch({type:'logout'})
          history.push('/sign/login')
        }else {
          if(r.data.email){
            p.dispatch({type:'login', email:r.data.email, seq:r.data.seq})
            console.log('---로그인한 유저---')
            console.log(p.loginUser)
          }else {
            console.log('---로그인한 유저없음---')
            p.dispatch({type:'logout'})
            history.push('/sign/login')
          }
        }
      })
      .catch(e=>{
        console.log(e)
        p.dispatch({type:'logout'})
      })
      
      axios.get(host+'/ajax/myproject')
      .then(r=>{
        p.dispatch({type:'projectListCng', val:r.data})
      })
      .catch(e=>{
        console.log(e)
      })
    }



    //멤버정보 가져옴
    axios.get(host+'/ajax/allProjMembers/'+prjSeq)
    .then(r=>{
      p.dispatch({type:'memberListCng', val:r.data})
    })
    .catch(e=>{
      console.log(e)
    })

    //마일스톤 목록 가져옴
    axios.get(host+'/ajax/'+prjSeq+'/milestonelist')
    .then(r=>{
      p.dispatch({type:'mileStoneListCng', val:r.data})
    })
    .catch(e=>{
      console.log(e)
    })

  },[location])

  // 프로젝트 리스트를 가져온 후
  useEffect(()=>{
    //프론트용
    if(window.location.href.indexOf(':3000') != -1){
      p.dispatch({type:'login', email:'guest@pium.com', seq:4})
    }

    //현재 프로젝트 정보 갱신
    if(p.projectList){
      let thisProject = p.projectList.find(r=>r.project_seq == prjSeq)
      if(thisProject == undefined){
        history.push('/err')

      }else {
        p.dispatch({type:'projectInfoCng', val:thisProject})

      }

    }
    // console.log('p.projectList')

  },[p.projectList])

  //현재 프로젝트 정보 갱신한 후
  useEffect(()=>{
    //현재 프로젝트의 내 멤버 정보
    if(p.memberList){
      p.memberList.map((r,i)=>{
        //실제
        if(r.member_seq == p.loginUser.seq){
          if(r.projmember_type == 0){
            p.dispatch({type:'isMasterCng', val:true})
          }
          p.dispatch({type:'myMemberInfoCng', val:r})
        }
      })
    }
    // console.log('p.memberList')


  },[p.memberList])

// console.log(p.myMemberInfo.projmember_data)
// console.log(p.myMemberInfo.projmember_name)
  useEffect(()=>{
    //프로필 수정용 데이터 입력
    if(p.myMemberInfo){
      profileSetInfoCng({
        ...profileSetInfo,
        name:p.myMemberInfo.projmember_name,
      })
      //프로필이름과 이미지가 둘다 없으면
      if(p.myMemberInfo.projmember_data == null && p.myMemberInfo.projmember_name == null){
        profileMsgCng(true)
        profileSetModalCng(true)
      }
      //프로필이름과 이미지가 둘다 공백이면
      else if(p.myMemberInfo.projmember_data === '' && p.myMemberInfo.projmember_name === ''){
          profileMsgCng(true)
          profileSetModalCng(true)
      }
    }
    // console.log('p.myMemberInfo')

  },[p.myMemberInfo])

  //내 멤버정보 새로고침 용
  useEffect(()=>{
    //멤버정보 가져옴
    axios.get(host+'/ajax/allProjMembers/'+prjSeq)
    .then(r=>{
      p.dispatch({type:'memberListCng', val:r.data})
    })
    .catch(e=>{
      console.log(e)
    })
  },[p.refreshMyInfo])

  return(
    <>
    {
      p.projectInfo ?
      <div className="viewOutWrap">
        <HeadSide
          prjColor={prjColor}
          prjSeq={prjSeq}
          profileMsgCng={profileMsgCng}
          profileSetModalCng={profileSetModalCng}
        />
        <div className="viewInnerWrap">
          {
            p.pageInfo == 'todo' &&
            <Todo prjColor={prjColor} prjSeq={prjSeq} />
          }
          {
            p.pageInfo == 'notice' &&
            <Notice prjColor={prjColor} prjSeq={prjSeq} />
          }
          {
            p.pageInfo == 'calendar' &&
            <>
              <Calendar prjColor={prjColor} prjSeq={prjSeq}/>
              <TaskModal/>
            </>
          }
          {
            p.pageInfo == 'timeLine' &&
            <>
              <TimeLine prjColor={prjColor} prjSeq={prjSeq}/>
              <TaskModal/>
            </>
          }
          {
            p.pageInfo == 'projectChart' &&
            <>
              <ProjectChart prjColor={prjColor} prjSeq={prjSeq}/>
            </>
          }
          {
            p.pageInfo == 'fileList' &&
            <FileList prjColor={prjColor} prjSeq={prjSeq}/>
          }
          {
            p.pageInfo == 'mileStone' &&
            <MileStone prjColor={prjColor} prjSeq={prjSeq} />
          }
          {
            p.pageInfo == 'mileStoneView' &&
            <>
              <MileStoneView prjColor={prjColor} prjSeq={prjSeq} />
              <TaskModal/>
            </>
          }
          {
            p.pageInfo == 'task' &&
            <>
              <Task prjColor={prjColor} prjSeq={prjSeq}/>
              <TaskModal/>
            </>
          }
        </div>
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={profileSetModal}
          onHide={profileSetModalClose}
          className={'profileSetModalWrap '+(profileMsg?'':'on')}
        >
          <div className="profileSetModalCon">
            <div className="msg">
              <b className="prjIcon" style={{backgroundColor:prjColor}}>
                {p.projectInfo.project_title.trim().substring(0,1)}
              </b>
              프로젝트에서 사용할<br/>
              <b>프로필 정보</b>를 완성해주세요. &#x1F603;
            </div>
            <img className="welcomeImg" src={pub.img+'profileSetting.svg'}/>
            <div className="btnWrap">
              <button className="submitBtn" onClick={()=>{
                profileMsgCng(false)
              }}>설정하기<i class="fas fa-long-arrow-alt-right"></i></button>

            </div>
          </div>


          <div className="profileSetModalCon">
            <input type="file" id="profileImg" accept=".jpg, .jpeg, .png" style={{display:'none'}} onChange={(e)=>{
              let file = e.target.files[0]
              profileSetInfoCng({
                ...profileSetInfo,
                img:file,
              })
              toBase64(file);

            }}/>
            <p className="profileSetTitle">
              프로필 설정
            </p>
            <label htmlFor="profileImg" className="imgBtn">
              {
                p.myMemberInfo //여기는 나중에 없애셈..
                ?
                  profileImgPreview
                  ?
                    <img src={profileImgPreview}/>
                  :
                    p.myMemberInfo.projmember_data
                    ? <img src={'data:image;base64,'+p.myMemberInfo.projmember_data}/>
                    : <img src={pub.img+'defaultProfile.svg'}/>
                :null
              }
              <div className="imgBtnBack">
                <i class="fas fa-pen"></i>
              </div>
            </label>
            <Form.Group className=" piumInput" controlId="floatingTextarea">
              <FloatingLabel controlId="floatingTextarea" label="닉네임">
                <Form.Control type="textarea" placeholder="닉네임" name="project_content" value={profileSetInfo.name} spellCheck="false" onChange={(e)=>{

                  profileSetInfoCng({
                    ...profileSetInfo,
                    name:e.target.value,
                  })
                }}
                onKeyPress={(e)=>{
                  if(e.key == 'Enter'){
                    p.dispatch({type:'loadingOn'})
                    e.preventDefault();
                    const formData = new FormData();
                    formData.append('projmember_name', profileSetInfo.name)
                    formData.append('projmember_image', profileSetInfo.img)
                    formData.append('project_seq', prjSeq)

                    axios({
                      method:'post',
                      url:host+'/ajax/updateProfile',
                      data:formData,
                      headers: {"Content-Type": "multipart/form-data"}
                    })
                    .then(r=>{
                      profileSetModalClose()
                      p.dispatch({type:'refreshMyInfoCng'})
                      p.dispatch({type:'loadingOff'})
                    })
                    .catch(e=>{
                      console.log(e)
                      p.dispatch({type:'loadingOff'})

                    })
                  }
                }}/>
              </FloatingLabel>
            </Form.Group>
            <div className="btnWrap">
              <button className="submitBtn" style={{backgroundColor:prjColor}} onClick={(e)=>{
                p.dispatch({type:'loadingOn'})
                e.preventDefault();
                const formData = new FormData();
                formData.append('projmember_name', profileSetInfo.name)
                formData.append('projmember_image', profileSetInfo.img)
                formData.append('project_seq', prjSeq)

                axios({
                  method:'post',
                  url:host+'/ajax/updateProfile',
                  data:formData,
                  headers: {"Content-Type": "multipart/form-data"}
                })
                .then(r=>{
                  profileSetModalClose()
                  console.log(1)
                  p.dispatch({type:'refreshMyInfoCng'})
                  p.dispatch({type:'loadingOff'})
                })
                .catch(e=>{
                  console.log(e)
                  p.dispatch({type:'loadingOff'})

                })
              }}>적용<i class="fas fa-check"></i></button>

            </div>
          </div>


        </Modal>
      </div>
      :null
    }

    </>
  )
}


function transReducer(state){
  return {
    loginUser:state.loginUser,
    pageInfo : state.pageInfo,
    projectList:state.projectList,
    projectInfo:state.projectInfo,
    memberList:state.memberList,
    myMemberInfo:state.myMemberInfo,
    isMaster:state.isMaster,
    isProfileEmpty:state.isProfileEmpty,
    mileStoneList : state.mileStoneList,
    refreshMyInfo : state.refreshMyInfo,
  }
}

export default connect(transReducer)(ProjectView);
