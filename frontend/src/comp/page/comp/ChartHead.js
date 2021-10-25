import axios from "axios";
import React, { useEffect, useRef, useState } from "react"
import DatePicker from '../../DatePicker.js'

import {pub, host, colors, pages, seqColorTrans} from '../../Helper.js'
import {FloatingLabel, Form, Button, Dropdown, Alert, Modal} from 'react-bootstrap'
import { Link, useParams, withRouter, useHistory, useLocation } from "react-router-dom";
import {connect} from 'react-redux';
import moment from "moment";
import "moment/locale/ko";




function ChartHead(p){
  const location = useState();


  //경과일 구하기
  const afterDateGetFunc = date =>{
    let now = moment(new Date())
    if(now.isAfter(date)){
      return now.diff(moment(date), 'days')+'일'
    } else {
      return '0일'
    }
  }

  //남은시간 구하기
  const remainDateGetFunc = date =>{
    let now = moment(new Date())
    if(moment(date).isAfter(now)){
      return moment(date).diff(moment(now), 'days')+'일'
    } else {
      return '0일'
    }
  }

  //업무 state
  const [taskCnt, taskCntCng] = useState({all:0, progress:0, done:0});

  //업무 갯수 가져오기
  const taskCntGetFunc = () =>{
    taskCntCng({all:0, progress:0, done:0})
    axios.get(host + '/ajax/countTaskStatus/' + p.projectInfo.project_seq)
    .then(r=>{
      taskCntCng({all:r.data[0]+r.data[1] ,progress:r.data[0], done:r.data[1]})

    })
    .catch(e=>{
      taskCntCng({all:0, progress:0, done:0})
    })
  }

  //업무 퍼센테이지 구하기
  const taskPerGetFunc = (all, part) =>{
    const allNum = Number(all);
    const partNum = Number(part);

    if(allNum >= partNum && allNum != 0 && partNum != 0){
      return Math.round((partNum/allNum)*100)+'%'
    } else {
      return '0%';
    }
  }

  useEffect(()=>{
    taskCntGetFunc()
  },[])

  return(
    <>
      <div className="chartInfo">
        <div className="title">
          <p className="icon" style={{backgroundColor:seqColorTrans(p.projectInfo.project_seq)}}>p</p>
          <p className="text">pium</p> 
        </div>
        <div className="infoWrap">
          <div className="col" style={{backgroundColor:seqColorTrans(p.projectInfo.project_seq)+10}}>
            <p className="key">시작일</p>
            <div className="date">
              <p>{p.projectInfo.project_startdate}</p>
            </div>
          </div>

          <div className="col" style={{backgroundColor:seqColorTrans(p.projectInfo.project_seq)+10}}>
            <p className="key">종료일</p>
            <div className="date">
              <p>{p.projectInfo.project_duedate}</p>
            </div>
          </div>

          <div className="col" style={{backgroundColor:seqColorTrans(p.projectInfo.project_seq)+10}}>
            <p className="key">경과일</p>
            <p className="row">{afterDateGetFunc(p.projectInfo.project_startdate)}</p>
          </div>
          <div className="col" style={{backgroundColor:seqColorTrans(p.projectInfo.project_seq)+10}}>
            <p className="key">남은 시간</p>
            <p className="row">{remainDateGetFunc(p.projectInfo.project_duedate)}</p>
          </div>
        </div>
      </div>
      {
        !p.progressHide&&
        <div className="chartBar">
          <div className="barTop">
            <p className="title">프로젝트 개요</p>
            <p className="info">총 {taskCnt.all}개의 업무 중 {taskCnt.done}개 완료</p>
          </div>
          <div className="barWrap">
            <div className="bar" style={{backgroundColor:seqColorTrans(p.projectInfo.project_seq),width:taskPerGetFunc(taskCnt.all, taskCnt.done)}}>
              <p>{taskPerGetFunc(taskCnt.all, taskCnt.done)}</p>
            </div>
          </div>
        </div>
      }
      

    </>
    
    
  )
}


function transReducer(state){
  return {
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

export default connect(transReducer)(ChartHead);