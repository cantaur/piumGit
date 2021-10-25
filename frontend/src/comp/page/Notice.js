import axios from "axios";
import React, { useEffect, useState } from "react"
import {pub, colors, pages, host, seqColorTrans} from '../Helper.js'
import DatePicker from '../DatePicker.js'
import { Link, useParams, withRouter, useHistory } from "react-router-dom";
import {connect} from 'react-redux';
import {Badge, Button, FloatingLabel, Form, Modal, Nav} from 'react-bootstrap';
import {Menu, MenuItem} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";



function Notice(p){
  const history = useHistory();

  //새로운 알림 목록
  const [unReadList, unReadListCng] = useState();

  //확인한 알림 목록
  const [readList, readListCng] = useState();

  //알림 목록 가져오기
  const noticeListGetFunc = () =>{
    axios.get(host+'/ajax/notice/'+p.myMemberInfo.projmember_seq)
    .then(r=>{
      let unReadList = r.data.filter(rr=>rr.notice_status == '0');
      let readList = r.data.filter(rr=>rr.notice_status == '1');

      console.log(readList)
      console.log(unReadList)
      unReadListCng(unReadList)
      readListCng(readList)
    })
    .catch(e=>{
      console.log(e)
    })
  }
  //알림 문구 arr
  const noticeMsg ={
    '업무배정':{
      'msg':'업무에 배정되었습니다.',
      'type':'task',
      'seq':'task_seq',
    },
    'mention':{
      'msg':'님이 코멘트에 멘션을 하였습니다.',
      'type':'task',
      'seq':'task_seq'
    },
    'addtask':{
      'msg':'님이 새로운 업무를 등록하였습니다.',
      'type':'task',
      'seq':'task_seq'
    },
    'addmile':{
      'msg':'님이 새로운 마일스톤을 등록하였습니다.',
      'type':'mileStoneView',
      'seq':'milestone_seq'
    }
  }


  //멤버정보 가져오기
  const memberInfoGetFunc = (seq) =>{
    let info = {
        name:'',
        data:''
    }
    if(p.memberList){
        p.memberList.map(r=>{
            if(r.projmember_seq == seq){
                if(r.projmember_data){
                    info.data = 'data:image;base64,'+r.projmember_data;
                }else{
                    info.data = pub.img+'defaultProfile.svg'
                }
                if(r.projmember_name){
                    info.name = r.projmember_name
                }else {
                    info.name = 'User#'+r.member_seq
                }
            }
        })
    }

    return info;
  }

  useEffect(()=>{
    if(p.myMemberInfo){
      noticeListGetFunc();
    }
  },[p.myMemberInfo])
  return(
    <>
    <div className="fileListWrap pageContentWrap">
      <div className="pageBtnWrap">
        <p className="pageBtn" onClick={()=>{
          p.dispatch({type:'pagePush', val:'todo'})

          history.push('/project/'+p.prjSeq+'/todo')
        }}>To do List</p>
        <p className="pageBtn on" style={{color:p.prjColor,borderColor:p.prjColor}} onClick={()=>{
          p.dispatch({type:'pagePush', val:'notice'})
          history.push('/project/'+p.prjSeq+'/notice')
        }}>알림</p>
      </div>
      <div className="noticeSection">&#x1F4E3; 새로운 알림</div>
      <div className="fileListViewWrap">
        <div className="fileHeader">
          <p className="w780">알림 내용</p>
          
          <p className="file w200">알림 일자</p>
          <p className="file w200">발신한 사람</p>
        </div>
        {
          unReadList ?
          unReadList.length>0?
            unReadList.map(r=>{return(
                    
              <div className="fileList readList">
                <div className="fileRow">
                    <p className="fileName noticeName">
                        <div className="fileInfo">
                            <div className="tag">
                              <b style={{backgroundColor:seqColorTrans(r[noticeMsg[r.notice_type].seq])}}>{noticeMsg[r.notice_type].type=='task'?'업무':'마일스톤'}</b>
                              <p>{r.notice_title}</p>
                            </div>
                            <span onClick={()=>{
                              p.dispatch({type:'loadingOn'})
                              axios.post(host+'/ajax/noticeChk',{
                                notice_seq:r.notice_seq
                              })
                              .then(rr=>{
                                p.dispatch({type:'pagePush', val:noticeMsg[r.notice_type].type})
                                if(noticeMsg[r.notice_type].type=='task'){
                                  history.push('/project/'+p.prjSeq+'/'+noticeMsg[r.notice_type].type+'/'+r[noticeMsg[r.notice_type].seq])
                                }else {
                                  window.location.href = '/project/'+p.prjSeq+'/'+noticeMsg[r.notice_type].type+'/'+r[noticeMsg[r.notice_type].seq]
                                }
                                if(r.notice_type=='mention'){
                                  p.dispatch({type:'tabReduxCng',val:true});
                                }else {
                                  p.dispatch({type:'tabReduxCng',val:false});
                                }
                              })
                              .catch(e=>{
                                console.log(e);
                                p.dispatch({type:'loadingOff'})
                              })
                            }}>{r.notice_type=='업무배정'?'':' '+memberInfoGetFunc(r.notice_sender).name}{noticeMsg[r.notice_type].msg}</span>
                        </div>
                    </p>

                    <p className="fileDate">{r.notice_date}</p>
                    <div className="uploader">
                      {
                        r.notice_sender == 0?
                        <p className="fileSize none profileImg"><b>없음</b></p>
                        :
                        <div className="profileImg toolTipTopBox w200">
                            <p className="toolTip">{memberInfoGetFunc(r.notice_sender).name}</p>
                            <div>
                                <img src={memberInfoGetFunc(r.notice_sender).data}/>
                            </div>
                        </div>
                      }
                        
                    </div>


                </div>
              </div>
            )
          })
          :<p className={"noFileMsg fileRow"}>새로운 알림이 없습니다.</p>
          :<Box sx={{ width: '100%' }}><LinearProgress /></Box>
        }
      </div>
      {
        readList ?
        readList.length > 0 ?
          <>
            <div className="noticeSection">&#x1F4CC; 확인한 알림</div>
              <div className="fileListViewWrap">
              {
                
                readList.map((r,i)=>{
                  if(i<10){
                    return(
                    
                      <div className="fileList readList">
                        <div className="fileRow">
                            <p className="fileName noticeName">
                                <div className="fileInfo">
                                    <div className="tag">
                                      <b style={{backgroundColor:seqColorTrans(r[noticeMsg[r.notice_type].seq])}}>{noticeMsg[r.notice_type].type=='task'?'업무':'마일스톤'}</b>
                                      <p>{r.notice_title}</p>
                                    </div>
                                    <span onClick={()=>{
                                      p.dispatch({type:'loadingOn'})
                                      axios.post(host+'/ajax/noticeChk',{
                                        notice_seq:r.notice_seq
                                      })
                                      .then(rr=>{
                                        p.dispatch({type:'pagePush', val:noticeMsg[r.notice_type].type})
                                        if(noticeMsg[r.notice_type].type=='task'){
                                          history.push('/project/'+p.prjSeq+'/'+noticeMsg[r.notice_type].type+'/'+r[noticeMsg[r.notice_type].seq])
                                        }else {
                                          window.location.href = '/project/'+p.prjSeq+'/'+noticeMsg[r.notice_type].type+'/'+r[noticeMsg[r.notice_type].seq]
                                        }
                                        if(r.notice_type=='mention'){
                                          p.dispatch({type:'tabReduxCng',val:true});
                                        }else {
                                          p.dispatch({type:'tabReduxCng',val:false});
                                        }
                                      })
                                      .catch(e=>{
                                        console.log(e);
                                        p.dispatch({type:'loadingOff'})
                                      })
                                    }}>{r.notice_type=='업무배정'?'':' '+memberInfoGetFunc(r.notice_sender).name}{noticeMsg[r.notice_type].msg}</span>
                                </div>
                            </p>

                            <p className="fileDate">{r.notice_date}</p>
                            <div className="uploader">
                              {
                                r.notice_sender == 0?
                                <p className="fileSize none profileImg"><b>없음</b></p>
                                :
                                <div className="profileImg toolTipTopBox w200">
                                    <p className="toolTip">{memberInfoGetFunc(r.notice_sender).name}</p>
                                    <div>
                                        <img src={memberInfoGetFunc(r.notice_sender).data}/>
                                    </div>
                                </div>
                              }
                                
                            </div>


                        </div>
                      </div>
                    )
                  }
                  
                })
              }
              </div>
          </>
        :null
        :null
      }
      
    
    </div>
      
    </>  
  )
}



function transReducer(state){
  return {
    datePickerModal : state.datePickerModal,
    myMemberInfo : state.myMemberInfo,
    memberList : state.memberList,
    mileStoneList : state.mileStoneList
  }
}

export default connect(transReducer)(Notice)