import axios from "axios";
import React, { useEffect, useRef, useState, useCallback } from "react"
import DatePicker from '../../DatePicker.js'

import {pub, host, colors, pages, seqColorTrans} from '../../Helper.js'
import {FloatingLabel, Form, Button, Dropdown, Alert, Modal} from 'react-bootstrap'
import { Link, useParams, withRouter, useHistory } from "react-router-dom";
import {connect} from 'react-redux';
import { FileIcon, defaultStyles } from "react-file-icon";
import { Box } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';


function TaskModal(p){

  const taskColor = seqColorTrans(p.taskModalData.task_seq)

  //테스크 정보 새로고침
  const taskRefresh = () =>{
    axios.get(host+'/ajax/taskView/'+p.taskModalData.task_seq)
    .then(r=>{
      p.dispatch(
        {
          type:'taskModalDataCng',
          val:{
            "task_seq":r.data[0].task.task_seq,
            "task_title":r.data[0].task.task_title,
            "task_content":r.data[0].task.task_content,
            "task_status":r.data[0].task.task_status,
            "task_isdelete":r.data[0].task.task_isdelete,
            "task_startdate":r.data[0].task.task_startdate?r.data[0].task.task_startdate.substring(0,10):'',
            "task_duedate":r.data[0].task.task_duedate?r.data[0].task.task_duedate.substring(0,10):'',
            "projmember_seq":r.data[0].task.projmember_seq,
            "milestone_seq":r.data[0].task.milestone_seq,
            "label_seq":r.data[0].task.label_seq==0?null:r.data[0].task.label_seq,
            "label_title":r.data[0].task?r.data[0].task.label_title:null,
            "priority_code":r.data[0].task.priority_code,
            "taskMembers":r.data[0].taskMembers,
            "task_date":r.data[0].task.task_date.substring(0,10),
          }
        }
      )
      p.dispatch({type:'loadingOff'})
      p.dispatch({type:'refreshCng'})
    })
    .catch(e=>{
      console.log(e)
      p.dispatch({type:'loadingOff'})
    })
  }
  // 업무 제목
  let [titleData, titleDataCng] = useState();
  // 업무 내용
  let [contentData, contentDataCng] = useState();
  // 업무 일정
  let [dateData, dateDataCng]= useState({
    task_startdate:'',
    task_duedate:''
  });
  // 업무 라벨
  let [labelData,labelDataCng]= useState();

  //업무 진행여부
  let [statusData, statusDataCng] =useState();
  // 업무 작성자정보
  let [writerData, writerDataCng] = useState({
    projmember_name : '',
    projmember_email : '',
    projmember_data : '',
  });

  // 배정된 멤버 삭제 확인용
  let [deleteMemberName, deleteMemberNameCng] =useState();
  let [deleteMemberSeq, deleteMemberSeqCng] =useState();

  let [deleteMemberAlert, deleteMemberAlertCng] = useState(false)

  const alertClose =()=> {
    deleteMemberAlertCng(false)
    setTimeout(()=>{
      deleteMemberNameCng();
      deleteMemberSeqCng();
    },500)
    
  };


  //  업무 삭제 확인용
  let [deleteTaskAlert, deleteTaskAlertCng] = useState(false)
  const taskAlertClose = () => deleteTaskAlertCng(false);

  // 데이트픽커 이중모달 컨트롤
  const dateModalClose =useCallback((e)=>{
    if(!e.target.closest('.DayPicker_1') && !e.target.closest('.datePickerEmptyDate') ){
      p.dispatch({type:'modalOff'})
      setTimeout(()=>{
        window.removeEventListener('click', dateModalClose)
      })
    }
  },[])

  // 업무 일정 업데이트
  const taskDateUpdate = () =>{
    axios.post(host+'/ajax/updateTaskDate',{
      task_seq : p.taskModalData.task_seq,
      task_startdate : dateData.task_startdate,
      task_duedate : dateData.task_duedate,
    })
    .then(r=>{
      p.dispatch({type:'refreshCng'})
    })
    .catch(e=>{
      console.log(e)
      p.dispatch({type:'loadingOff'})
    })
  }

  // 업무일정 비우기
  const taskDateNull = () =>{
    axios.post(host+'/ajax/updateTaskDate',{
      task_seq : p.taskModalData.task_seq,
      task_startdate : null,
      task_duedate : null,
    })
    .then(r=>{
      p.dispatch({type:'refreshCng'})
      dateDataCng({
        task_startdate:'',
        task_duedate:''
      })
      taskRefresh()
      p.dispatch({type:'modalOff'})
    })
    .catch(e=>{
      console.log(e)
      p.dispatch({type:'loadingOff'})
    })

  }


  // 탭 상태관리
  let [tabState, tabStateCng] = useState(0);


  //제목 수정모드
  let [editTitle, editTitleCng] = useState(false);
  const titleEditInput = useRef();

  //제목 미입력시
  let [titleAlert,titleAlertCng] = useState(false);

  // 상세보기_업무내용 수정모드
  let [editContent, editContentCng] = useState(false);
  const conArea = useRef();

  // 상세보기_배정된 멤버 추가 모달
  let [appendMemberModal, appendMemberModalCng] = useState(false);

  const appendMemberModalClose =useCallback((e)=>{
    if(!e.target.closest('.chargeBtn')){
      appendMemberModalCng(false)
      setTimeout(()=>{
        window.removeEventListener('click', appendMemberModalClose)
      })
    }
  },[])

  // 상세보기_라벨 수정모드
  let [editLabel, editLabelCng] = useState(false);
  const labelInput = useRef();


  //코멘트

  //코멘트 멤버배정
  const [commentMember, commentMemberCng] = useState([]);
  const [commentMemberModal, commentMemberModalCng] = useState(false);

  const commentMemberModalClose =useCallback((e)=>{
    if(!e.target.closest('.chargeBtn')){
      commentMemberModalCng(false)
      setTimeout(()=>{
        window.removeEventListener('click', commentMemberModalClose)
      })
    }
  },[])

  //코멘트 파일
  const [commentFile, commentFileCng] = useState();

  //코멘트 내용
  const [commentText, commentTextCng] = useState();
  const commentTextInput = useRef();
  //코멘트 내용 비었는지
  const [commentTextEmpty, commentTextEmptyCng] = useState(false);
  // 코멘트 목록 wrap (스크롤 컨트롤용)
  const commentWrap = useRef();
  //코멘트 목록
  const [commentList, commentListCng] = useState();

  //코멘트 목록 불러오기
  const commentListGetFunc = () =>{
    commentMemberCng([]);
    commentFileCng(undefined);
    commentTextCng();
    commentTextEmptyCng(false);

    commentListCng();

    axios.get(host+'/ajax/taskComment/'+p.taskModalData.task_seq)
    .then(r=>{
      commentListCng(r.data)
    })
    .catch(e=>{
      console.log(e)
    })
  }

  //코멘트 삭제 확인용
  let [deleteCommentAlert, deleteCommentAlertCng] = useState(false)
  const commentAlertClose = () => {
    deleteCommentAlertCng(false)
    deleteCommentSeqCng();
  };

  //코멘트 삭제용 state
  let [deleteCommentSeq, deleteCommentSeqCng] = useState(); 


  //파일

  //파일 목록
  const [fileList, fileListCng] = useState([]);

  //파일 목록 불러오기
  const fileListGetFunc = () =>{
    fileListCng();
    axios.get(host+'/ajax/taskFileList/'+p.taskModalData.task_seq)
    .then(r=>{
      fileListCng(r.data)
    })
    .catch(e=>{
      console.log(e)
    })
  }

  //파일 용량 변환 함수
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  //파일 확장자 뽑는 함수
  const fileGetTypeFunc = (name) =>{
    let _fileLen = name.length;
    let _lastDot = name.lastIndexOf('.');
    let _fileExt = name.substring(_lastDot, _fileLen).toLowerCase();
    

    return _fileExt.substr(1)
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
    titleDataCng(p.taskModalData.task_title)
    contentDataCng(p.taskModalData.task_content)
    dateDataCng({
      task_startdate:p.taskModalData.task_startdate,
      task_duedate:p.taskModalData.task_duedate
    })
    labelDataCng(p.taskModalData.label_title)
    statusDataCng(p.taskModalData.task_status)
    if(p.memberList){
      p.memberList.forEach(r=>{
        if(r.projmember_seq == p.taskModalData.projmember_seq){
          writerDataCng(r)
        }
      })
    }
    editTitleCng(false)
    editContentCng(false)
    editLabelCng(false)
    if(p.tabRedux){
      tabStateCng(1)
    }else {
      tabStateCng(0)
    }
    if(p.taskModalData){
      commentListGetFunc();

    }
  },[p.taskModalData])

  useEffect(()=>{
    if(tabState==1){
      commentListGetFunc();
      commentTextInput.current.focus();
    } else if(tabState == 2){
      fileListGetFunc();
    }
    
  },[tabState])


  return(
    <>
      <Modal show={deleteMemberAlert} onHide={alertClose} className="modalWrap deleteMemberModal">
        <Modal.Header style={{borderBottom:0}}>
          <Modal.Title className="modalTitle" >정말 {deleteMemberName}님을 업무배정에서 제외할까요?</Modal.Title>
        </Modal.Header>
        <Modal.Footer style={{borderTop:0}}>
          <Button variant="secondary" onClick={alertClose} style={{fontSize:'.8rem'}}>
            취소
          </Button>
          <Button variant="danger" style={{fontSize:'.8rem'}} onClick={()=>{
            p.dispatch({type:'loadingOn'})
            axios.post('/ajax/deleteProjMember',{
              taskSeq:p.taskModalData.task_seq,
              projmemberSeq:deleteMemberSeq
            })
            .then(r=>{
              taskRefresh();
              alertClose()
            })
            .catch(e=>{
              console.log(e)
              p.dispatch({type:'loadingOff'})

            })
          }}>
            제외
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={deleteTaskAlert} onHide={taskAlertClose} className="modalWrap deleteMemberModal">
        <Modal.Header style={{borderBottom:0}}>
          <Modal.Title className="modalTitle" >정말 업무를 삭제할까요?</Modal.Title>
        </Modal.Header>
        <Modal.Footer style={{borderTop:0}}>
          <Button variant="secondary" onClick={taskAlertClose} style={{fontSize:'.8rem'}}>
            취소
          </Button>
          <Button variant="danger" style={{fontSize:'.8rem'}} onClick={e=>{
            p.dispatch({type:'loadingOn'})
            axios.post(host+'/ajax/deleteTask',{
              taskSeq:p.taskModalData.task_seq,
            })
            .then(r=>{
              p.dispatch({type:'loadingOff'})
              p.dispatch({type:'refreshCng'})
              taskAlertClose()
              p.dispatch({type:'taskModalCng',val:false})
            })
            .catch(e=>{
              p.dispatch({type:'loadingOff'})
              console.log(e)
            })
          }}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={deleteCommentAlert} onHide={commentAlertClose} className="modalWrap deleteMemberModal">
        <Modal.Header style={{borderBottom:0}}>
          <Modal.Title className="modalTitle">삭제한 코멘트는 모든 멤버에게 보이지 않으며, 복구할 수 없습니다.<br/> 정말 코멘트를 삭제할까요?</Modal.Title>
        </Modal.Header>
        <Modal.Footer style={{borderTop:0}}>
          <Button variant="secondary" onClick={commentAlertClose} style={{fontSize:'.8rem'}}>
            취소
          </Button>
          <Button variant="danger" style={{fontSize:'.8rem'}} onClick={e=>{
            p.dispatch({type:'loadingOn'})
            axios.post(host+'/ajax/taskCmtdelete',{
              comment_seq:deleteCommentSeq,
            })
            .then(r=>{
              p.dispatch({type:'loadingOff'})
              commentListGetFunc();
              commentAlertClose();
            })
            .catch(e=>{
              p.dispatch({type:'loadingOff'})
              console.log(e)
            })
          }}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>
      <div className={"taskModalWrap " + (p.taskModal?'on':'')}>

        <div className="head">
          <div className="titleWrap">
            <input className={"title " + (editTitle?'on ':'') + (titleAlert?'msg ':'')}
              disabled={editTitle?false:true}
              value={titleData}
              ref={titleEditInput}
              onChange={e=>{
                titleDataCng(e.target.value)
              }}
              onKeyPress={e=>{
                if(e.key === 'Enter'){
                  p.dispatch({type:'loadingOn'})
                  axios.post(host+'/ajax/updateTaskTitle',{
                    taskSeq:p.taskModalData.task_seq,
                    taskTitle:titleData,
                  })
                  .then(r=>{
                    p.dispatch({type:'refreshCng'})
                    p.dispatch({type:'loadingOff'})
                    editTitleCng(false)
                  })
                  .catch(e=>{
                    console.log(e)
                    p.dispatch({type:'loadingOff'})
                  })
                }
              }}
             onKeyDown={e=>{
             if(e.key === 'Escape'){
                 editTitleCng(false)
                 taskRefresh()
               }
             }}
            />
            {
              editTitle
              ?
                <p className="submitBtn labelEditBtn" onClick={()=>{
                  p.dispatch({type:'loadingOn'})
                  axios.post(host+'/ajax/updateTaskTitle',{
                    taskSeq:p.taskModalData.task_seq,
                    taskTitle:titleData,
                  })
                      .then(r=>{
                        p.dispatch({type:'refreshCng'})
                        p.dispatch({type:'loadingOff'})
                        editTitleCng(false)
                      })
                      .catch(e=>{
                        console.log(e)
                        p.dispatch({type:'loadingOff'})
                      })
                }}>수정완료</p>
              :
                <i class="fas fa-pen editBtn labelEditBtn" onClick={()=>{
                  editTitleCng(true)
                  setTimeout(()=>{
                    titleEditInput.current.focus();
                  })
                }}></i>

            }

          </div>

          <div className="info">
            <div className="profile">
              <div className="img">
                <img src={
                  writerData.projmember_data
                  ?
                  'data:image;base64,'+writerData.projmember_data
                  :
                    pub.img+'defaultProfile.svg'
                }/>
              </div>

              <div className="text">
                <p className="name">{writerData.projmember_name?writerData.projmember_name:'User#'+writerData.projmember_seq}</p>
                <p className="email">{writerData.member_email}</p>
              </div>
            </div>
            <p className="date">{p.taskModalData.task_date}</p>

          </div>
        </div>

        <div className="tabNav">
          <p className={"navBtn "+(tabState==0?'on':'')}
              style={{
                color:(tabState==0?taskColor:''),
                borderColor:(tabState==0?taskColor:''),
                fontWeight:(tabState==0?'bold':''),
              }}
              onClick={()=>{tabStateCng(0)}}>
            상세보기
          </p>
          <p className={"navBtn "+(tabState==1?'on':'')}
              style={{
                color:(tabState==1?taskColor:''),
                borderColor:(tabState==1?taskColor:''),
                fontWeight:(tabState==1?'bold':''),
              }}
              onClick={()=>{tabStateCng(1)}}>
            코멘트
          </p>
          <p className={"navBtn "+(tabState==2?'on':'')}
              style={{
                color:(tabState==2?taskColor:''),
                borderColor:(tabState==2?taskColor:''),
                fontWeight:(tabState==2?'bold':''),
              }}
              onClick={()=>{tabStateCng(2)}}>
            파일
          </p>
        </div>

        <div className="taskCon">
          {
            tabState == 0 &&
            <>
              <div className={"contentWrap " + (editContent?'on':'')}>
                <div className="conBtn editBtn toolTipTopBox" onClick={()=>{
                  editContentCng(true)
                  conArea.current.focus();
                }}
                >
                  <p className="toolTip" style={{marginLeft:'-24px'}}>내용수정</p>

                  <i class="fas fa-pen"></i>
                </div>
                <div className="conBtn submitBtn toolTipTopBox"
                      onClick={()=>{
                        editContentCng(false)
                        p.dispatch({type:'loadingOn'})
                        axios.post(host+'/ajax/updateTaskCont',{
                          taskSeq:p.taskModalData.task_seq,
                          taskContent:contentData,
                        })
                        .then(r=>{
                          p.dispatch({type:'loadingOff'})
                          editContentCng(false)
                        })
                        .catch(e=>{
                          p.dispatch({type:'loadingOff'})
                          console.log(e)
                        })
                      }}
                >
                  수정완료
                </div>
                <textarea className="conArea" ref={conArea}
                  readOnly={editContent?false:true}
                  placeholder="업무내용이 없습니다."
                  value={contentData}
                  onChange={e=>{
                    contentDataCng(e.target.value)
                  }}
                  onKeyDown={e=>{
                    if(e.key === 'Escape'){
                      editContentCng(false)
                      taskRefresh()
                    }
                  }}
                ></textarea>
              </div>
              <p className="menuTitle">속성변경</p>
              <div className="statusRow">
                <p className="label">마일스톤</p>

                <Form.Select size="sm" className="mileSelect" onChange={e=>{
                  p.dispatch({type:"loadingOn"})
                  axios.post(host+'/ajax/changeMile',{
                    taskSeq:p.taskModalData.task_seq,
                    mileSeq:e.target.value,
                  })
                  .then(r=>{
                    p.dispatch({type:'loadingOff'})
                    taskRefresh();
                  })
                  .catch(e=>{
                    console.log(e)
                    p.dispatch({type:'loadingOff'})
                  })
                }
                }>
                  <option value="0" selected={p.taskModalData.milestone_seq == "0"?true:false}>마일스톤 없음</option>
                  {
                    p.mileStoneList &&
                      p.mileStoneList.map((r, i) =>{
                        return(
                          <option value={r.milestone_seq}
                                  selected={r.milestone_seq==p.taskModalData.milestone_seq?true:false}

                          >{r.milestone_title}</option>

                        )
                      })
                  }
                </Form.Select>
              </div>

              <div className="statusRow">
                <p className="label">업무일정</p>
                <div className="dateWrap datePickerWrap">
                  {
                    !dateData.task_startdate &&
                    <p className="date">일정없음</p>
                  }
                  {
                    dateData.task_startdate &&
                    <p className="date">
                    {dateData.task_startdate?dateData.task_startdate + ' ':''}
                    ~
                    {dateData.task_duedate?' '+dateData.task_duedate:''}
                  </p>
                  }

                  <div className="dateBtn" onClick={
                    ()=>{
                      p.dispatch({type:'modalOn'})
                      setTimeout(()=>{
                        window.addEventListener('click', dateModalClose)
                      })
                    }
                  }>
                    <i className="far fa-calendar-check"></i>
                    일정선택
                  </div>
                  <DatePicker
                    pickerStartDate={dateData.task_startdate}
                    pickerEndDate={dateData.task_duedate}
                    pickerDateCng={dateDataCng}
                    pickerDate={dateData}
                    pickerStartKey={'task_startdate'}
                    pickerEndKey={'task_duedate'}
                    dateModalClose={dateModalClose}
                    completeKey={true}
                    dateUpdate={taskDateUpdate}
                    dateEmpty={taskDateNull}
                  />
                </div>
              </div>

              <div className="statusRow">
                <p className="label">배정된 멤버</p>
                <div className="memberOuter">
                  <div className="memberWrap">
                    {
                      p.taskModalData.taskMembers &&
                      p.taskModalData.taskMembers.length > 0 && p.memberList
                      ?
                        p.taskModalData.taskMembers.map(r=>{
                          let name = '';
                          let data = '';
                          p.memberList.map(m=>{
                            if(m.projmember_seq==r.projmember_seq) {
                              name = m.projmember_name;
                              data = m.projmember_data;
                            }
                          })

                          return(
                            <div className="profileImg toolTipTopBox" onClick={()=>{
                              deleteMemberAlertCng(true)
                              if(name){
                                deleteMemberNameCng(name)
                              }else {
                                deleteMemberNameCng('User#'+r.projmember_seq)
                              }
                              deleteMemberSeqCng(r.projmember_seq)
                            }}>
                              <p className="toolTip">{name?name:'User#'+r.projmember_seq}</p>
                              <div>
                                <img src={
                                  data
                                  ?
                                  'data:image;base64,'+data
                                  :
                                    pub.img+'defaultProfile.svg'
                                }/>
                              </div>
                            </div>
                          )
                        })
                      :
                        <p className="msg">멤버 없음</p>
                    }


                  </div>
                  <div className="chargeBtn"
                        onClick={()=>{
                          setTimeout(()=>{
                            appendMemberModalCng(true)
                            window.addEventListener('click', appendMemberModalClose)
                          })

                        }}
                  >
                    <i class="fas fa-plus-square"></i>
                    <div className={"chrgeWrap "+(appendMemberModal?'on':'')}>
                      {
                        p.memberList &&
                        p.memberList.map(r=>{
                          return(
                            <div className="member" onClick={()=>{
                              let findArr = p.taskModalData.taskMembers.find(rr=> rr.projmember_seq == r.projmember_seq)
                              if(findArr==undefined){
                                p.dispatch({type:'loadingOn'})
                                axios.post(host+'/ajax/addMember',{
                                  taskSeq:p.taskModalData.task_seq,
                                  projmemberSeq:r.projmember_seq
                                })
                                .then(r=>{
                                  taskRefresh();
                                  p.dispatch({type:'loadingOff'})
                                })
                                .catch(e=>{
                                  p.dispatch({type:'loadingOff'})
                                })
                              }
                              
                              
                            }}>
                              <div className="profile">
                                <img src={
                                  r.projmember_data
                                  ?
                                  'data:image;base64,'+r.projmember_data
                                  :
                                    pub.img+'defaultProfile.svg'
                                }/>
                              </div>
                              <div className="info">
                                <p className="name">{r.projmember_name?r.projmember_name:'User#'+r.member_seq}</p>
                                <p className="email">{r.member_email}</p>
                              </div>
                            </div>
                          )
                        })
                      }


                    </div>
                  </div>
                </div>

              </div>
              <div className="statusRow">
                <p className="label">라벨</p>
                <div className="labelEditWrap">

                  {
                    editLabel
                    ?
                      <>
                        <input type="text" className="labelInput" ref={labelInput} value={labelData} onChange={e=>{
                          labelDataCng(e.target.value)
                        }}
                        onKeyPress={e=>{
                          if(e.key == "Enter"){
                            p.dispatch({type:'loadingOn'})
                            axios.post(host+'/ajax/addLabel',{
                              taskSeq:p.taskModalData.task_seq,
                              label:labelData,
                            })
                            .then(r=>{
                              editLabelCng(false)
                              taskRefresh()
                            })
                            .catch(e=>{
                              console.log(e)
                              p.dispatch({type:'loadingOff'})
                            })
                          }
                        }}
                        onKeyDown={e=>{
                          if(e.key === 'Escape'){
                            editLabelCng(false)
                            taskRefresh()
                          }
                        }}
                        />
                        <p className="submitBtn labelEditBtn" onClick={()=>{
                          p.dispatch({type:'loadingOn'})
                          axios.post(host+'/ajax/addLabel',{
                            taskSeq:p.taskModalData.task_seq,
                            label:labelData,
                          })
                          .then(r=>{
                            editLabelCng(false)
                            taskRefresh()
                          })
                          .catch(e=>{
                            console.log(e)
                            p.dispatch({type:'loadingOff'})
                          })

                        }}>수정완료</p>
                      </>
                    :
                      <>
                        {
                          p.taskModalData.label_seq
                          ?
                            <p className="labelText" style={{
                              backgroundColor:seqColorTrans(p.taskModalData.label_seq)
                            }}>{p.taskModalData.label_title}</p>
                          :
                            <p className="labelText noLabel">라벨 없음</p>
                        }
                        <i class="editBtn labelEditBtn fas fa-pen toolTipTopBox" onClick={()=>{
                          editLabelCng(true)
                          setTimeout(()=>{
                            labelInput.current.focus()
                          })
                        }}>
                          <p className="toolTip" style={{marginLeft:'-24px'}}>라벨수정</p>
                        </i>
                      </>
                  }
                </div>
              </div>
              <div className="statusRow">
                <p className="label">중요도</p>
                <Form.Select size="sm" onChange={e=>{
                  p.dispatch({type:"loadingOn"})
                  axios.post(host+'/ajax/updatePriority',{
                    taskSeq:p.taskModalData.task_seq,
                    priorityCode:e.target.value,
                  })
                  .then(r=>{
                    p.dispatch({type:'loadingOff'})
                    taskRefresh()
                  })
                  .catch(e=>{
                    console.log(e)
                    p.dispatch({type:'loadingOff'})
                  })
                }}>
                  <option value="" selected={p.taskModalData.priority_code?false:true}>중요도 없음</option>
                  <option value="10" selected={p.taskModalData.priority_code == "10"?true:false}>긴급</option>
                  <option value="20" selected={p.taskModalData.priority_code == "20"?true:false}>높음</option>
                  <option value="30" selected={p.taskModalData.priority_code == "30"?true:false}>보통</option>
                  <option value="40" selected={p.taskModalData.priority_code == "40"?true:false}>낮음</option>
                  <option value="50" selected={p.taskModalData.priority_code == "50"?true:false}>무시</option>
                </Form.Select>
              </div>
              <div className="statusRow">
                <p className="label">진행여부</p>
                <Form.Check inline label="진행중" type="radio" name="endRadio" id="endRadio1" checked={statusData == "0"?true:false} onClick={()=>{
                  p.dispatch({type:'loadingOn'})
                  axios.post(host+'/ajax/openTask',{
                    taskSeq:p.taskModalData.task_seq
                  })
                  .then(r=>{
                    taskRefresh()
                  })
                }}/>
                <Form.Check inline label="종료" type="radio" name="endRadio" id="endRadio2" checked={statusData == "1"?true:false} onClick={()=>{
                  p.dispatch({type:'loadingOn'})
                  axios.post(host+'/ajax/closeTask',{
                    taskSeq:p.taskModalData.task_seq
                  })
                  .then(r=>{
                    taskRefresh()
                  })
                }}/>
                <Button type="button" className="taskDeleteBtn" onClick={()=>{
                  deleteTaskAlertCng(true)
                }}>업무 삭제하기</Button>
              </div>
            </>
          }

          {
            tabState == 1 &&
            <>
              <div className="commentWrap">
                <div className="commentList" ref={commentWrap}>
                  {
                    commentList
                    ?
                      commentList.length > 0
                      ? 
                        commentList.map((r,i)=>{
                          const writer = memberInfoGetFunc(r.comment.projmember_seq)
                          const membersArr = r.comment.members?r.comment.members.split(','):''
                          if(r.comment.comment_isdelete == '0'){
                            return(
                              <div className="comment">
                                <i class="fas fa-trash-alt deleteBtn toolTipTopBox" 
                                    onClick={()=>{
                                      deleteCommentSeqCng(r.comment.comment_seq);
                                      deleteCommentAlertCng(true);
                                    }}
                                >
                                  <p className="toolTip" style={{marginLeft:'-32px',top:'-10px'}}>코멘트 삭제</p>
                                </i>
                                <div className="data">
                                  <div className="textWrap">
                                    <div className="writer">
                                      <p>{writer.name}</p>
                                      <p>{r.comment.comment_date}</p>
                                    </div>
                                    <div className="text">{r.comment.comment_content}</div>
                                  </div>
                                  <div className="fileMemberWrap">
                                    <div className="member">
                                      {
                                        r.comment.members
                                        ? 
                                          membersArr.map(r=>{
                                            return(
                                              <p className="person">{'@'+memberInfoGetFunc(r).name}</p>
                                            )
                                          })
                                        :<p className="person">멤버없음</p>
                                      }
                                    </div>
                                    {
                                      r.file && 
                                      
                                      <div className="file" onClick={()=>{
                                        window.location.href = host+'/downloadFile/'+r.file.file_savename
                                        
                                      }}>
                                        <FileIcon extension={fileGetTypeFunc(r.file.file_savename)} {...defaultStyles[fileGetTypeFunc(r.file.file_savename)]} />
                                        <p className="fileInfo">{r.file.file_savename}</p>
                                      </div>
                                    }
                                    
                                  </div>
  
                                </div>
  
                              </div>
                            )
                          }
                          
                        })
                      :<p className="noneComment">코멘트가 없습니다.</p>
                    :<Box sx={{ width: '100%' }}><LinearProgress /></Box>

                  }
                  
                </div>


                <div className="commentForm">
                  <div className="dataWrap">
                    <div className="file">
                      <input type="file" id="commentFileInput" accept=".jpg, .jpeg, .png, .svg, .zip, .hwp, .docx, .ppt, .pptx, .xlsx, .txt, .pdf" onChange={e=>{
                        commentFileCng(e.target.files[0])
                      }}/>
                      <label htmlFor="commentFileInput" className="commentBtn" style={{color:seqColorTrans(p.taskModalData.task_seq)}}>
                        <i class="fas fa-file-upload"></i>파일
                      </label>
                      <div className="name toolTipTopBox" onClick={()=>{
                        commentFileCng(undefined);
                      }}>
                        <div className="toolTip" style={{marginLeft:'-32px'}}>파일 삭제</div>
                        <p>{commentFile?commentFile.name:''}</p>
                      </div>
                    </div>
                    <div className="member">
                      <div className="commentBtn chargeBtn" style={{color:seqColorTrans(p.taskModalData.task_seq)}} onClick={()=>{
                        setTimeout(()=>{
                          commentMemberModalCng(true)
                          window.addEventListener('click', commentMemberModalClose)
                        })
                      }}>
                        <i class="fas fa-users"></i>멤버
                        <div className={"chrgeWrap "+(commentMemberModal?'on':'')}>
                          {
                            p.memberList &&
                            p.memberList.map(r=>{
                              return(
                                <div className="member" onClick={()=>{
                                  let check = commentMember.find(rr=>rr==r.projmember_seq)

                                  if(check==undefined){
                                    commentMemberCng([
                                      ...commentMember,
                                      r.projmember_seq
                                    ])
                                  }
                                  
                                }}>
                                  <div className="profile">
                                    <img src={
                                      r.projmember_data
                                      ?
                                      'data:image;base64,'+r.projmember_data
                                      :
                                        pub.img+'defaultProfile.svg'
                                    }/>
                                  </div>
                                  <div className="info">
                                    <p className="name">{r.projmember_name?r.projmember_name:'User#'+r.member_seq}</p>
                                    <p className="email">{r.member_email}</p>
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>

                      <div className="commentMemberWrap">
                          {
                            commentMember &&
                            commentMember.map((r,i)=>{
                              let member = p.memberList.find(rr=>rr.projmember_seq == r)
                              let name = member.projmember_name?member.projmember_name:'User#'+member.projmember_seq
                              
                              return(
                                <p className="commentMemberList toolTipTopBox" onClick={()=>{
                                  let listDummy = [...commentMember]
                                  listDummy.splice(i,1)
                                  setTimeout(()=>{
                                    commentMemberCng(listDummy)
                                  })
                                }}>@{name}</p>
                              )
                            })
                          }
                      </div>
                    </div>
                  </div>
                  <textarea ref={commentTextInput} placeholder="코멘트 내용을 입력해주세요." className={"commentTextInput " + (commentTextEmpty?'on':'')} spellCheck={false} onChange={e=>{
                    commentTextCng(e.target.value)
                    commentTextEmptyCng(false)
                  }}></textarea>

                  <div className="sendBtn toolTipTopBox" style={{color:seqColorTrans(p.taskModalData.task_seq)}} onClick={()=>{
                    if(!commentText){
                      commentTextEmptyCng(true)
                      commentTextInput.current.focus();
                    }else {
                      p.dispatch({type:'loadingOn'})
                      if(commentFile){
                        const formData = new FormData();
                        formData.append('file', commentFile)
                        formData.append('project_seq', p.projectInfo.project_seq)
                        formData.append('task_seq', p.taskModalData.task_seq)
                        formData.append('projmember_seq', p.myMemberInfo.projmember_seq)
  
                        axios({
                          method:'post',
                          url:host+'/ajax/uploadFile',
                          data:formData,
                          headers: {"Content-Type": "multipart/form-data"}
                        })
                        .then(r=>{
                          let membersString = commentMember != ''?commentMember.join(','):'none';
                          commentTextInput.current.value = "";
                          axios.post(host+'/ajax/taskComment',{
                            comment_content:commentText,
                            members : membersString,
                            projmember_seq:p.myMemberInfo.projmember_seq,
                            task_seq:p.taskModalData.task_seq,
                            isFile:true,
                          })
                          .then(r=>{
                            commentListGetFunc();
                            p.dispatch({type:'loadingOff'})
                          })
                          .catch(e=>{
                            console.log(e)
                            p.dispatch({type:'loadingOff'})
                          })
                        })
                        .catch(e=>{
                          console.log(e)
                          p.dispatch({type:'loadingOff'})

                        })
                      }else {
                        let membersString = commentMember != ''?commentMember.join(','):'none';
                        commentTextInput.current.value = "";
                        axios.post(host+'/ajax/taskComment',{
                          comment_content:commentText,
                          members : membersString,
                          projmember_seq:p.myMemberInfo.projmember_seq,
                          task_seq:p.taskModalData.task_seq,
                          isFile:false,
                        })
                        .then(r=>{
                          commentListGetFunc();
                          p.dispatch({type:'loadingOff'})
                        })
                        .catch(e=>{
                          console.log(e)
                          p.dispatch({type:'loadingOff'})
                        })
                      }
                    }
                    
                  }}>
                    <p className="toolTip" style={{marginLeft:'-34px'}}>코멘트 등록</p>
                    <i class="fas fa-paper-plane"></i>
                  </div>
                  
                  
                </div>
              </div>
              
            </>
          }
          {
            tabState == 2 &&
            <>
            <div className="fileWrap">
              {
                fileList
                ?
                  fileList.length > 0
                  ?
                    fileList.map(r=>{
                      const writer = memberInfoGetFunc(r.projmember_seq)
                      return(
                        <div className="fileCon">
                          <div className="fileIcon">
                            <FileIcon extension={fileGetTypeFunc(r.file_savename)} {...defaultStyles[fileGetTypeFunc(r.file_savename)]} />
                          </div>
                          <div className="fileInfo">
                            <p className="name">{r.file_savename}</p>
                            <div className="info">
                              <p className="writer">{writer.name + ', ' + r.file_uploaddate}</p>
                              <p className="byte">{formatBytes(r.file_size)}</p>

                            </div>
                          </div>

                          <div className="downBtn toolTipTopBox" onClick={()=>{
                            window.location.href = host+'/downloadFile/'+r.file_savename
                          }}>
                            <p className="toolTip" style={{marginLeft:'-24px'}}>다운로드</p>
                            <i class="fas fa-download" style={{color:seqColorTrans(p.taskModalData.task_seq)}}></i>

                          </div>
                        </div>
                      )
                    })
                    
                  :<p className="noneFile">파일이 없습니다.</p>
                :<Box sx={{ width: '100%' }}><LinearProgress /></Box>
              }
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
    datePickerModal : state.datePickerModal,
    taskModal : state.taskModal,
    taskModalData : state.taskModalData,
    mileStoneList : state.mileStoneList,
    projectInfo : state.projectInfo,
    memberList : state.memberList,
    refresh : state.refresh,
    myMemberInfo : state.myMemberInfo,
    tabRedux:state.tabRedux,
  }
}

export default connect(transReducer)(TaskModal);
