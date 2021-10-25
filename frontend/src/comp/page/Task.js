import axios from "axios";
import React, {useCallback, useEffect, useRef, useState} from "react"
import {pub, colors, pages,seqColorTrans, host} from '../Helper.js'
import DatePicker from '../DatePicker.js'
import {FloatingLabel, Form, Button, Dropdown, Alert, Modal} from 'react-bootstrap'
import { Link, useParams, withRouter, useHistory, useLocation } from "react-router-dom";
import {connect} from 'react-redux';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';


function Task(p){
  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  // 상세보기_배정된 멤버 추가 모달
  let [appendMemberModal, appendMemberModalCng] = useState(false);

  const appendMemberModalClose =useCallback((e)=>{
    if(!e.target.closest('.chrgeWrap') && !e.target.closest('.chargeBtn')){
      appendMemberModalCng(false)
      setTimeout(()=>{
        window.removeEventListener('click', appendMemberModalClose)
      })
    }
  },[])

  //업무 이중모달 컨트롤
  const taskModalClose = useCallback((e)=>{
    if(!e.target.closest('.taskModalWrap')  && !e.target.closest('.labelEditBtn') && !e.target.closest('.deleteMemberModal')){
      p.dispatch({type:'taskModalCng', val:false})
      setTimeout(()=>{
        window.removeEventListener('click', taskModalClose)
      })
      p.dispatch({type:'tabRedux', val:false})
    }
  },[])

  //업무 만들기 모달 상태
  const [createModal, createModalCng] = useState(false)

  //업무 만들기 제목 인풋
  const titleInput = useRef();

  //업무 만들기 정보
  const [taskInfo, taskInfoCng] = useState({
    task_title:'',
    task_content:'',
    task_startdate:'',
    task_duedate:'',
    milestone_seq:'0',
    projmember_seq:'',
    project_seq:p.prjSeq,
  });

  //업무 만들기_멤버배정
  const [chargeMember, chargeMemberCng] = useState([]);

  //업무 생성_제목 알림 상태
  let [alert, alertCng] = useState(false);

  //날짜선택 이중모달 컨트롤
  let dateModalClose =useCallback((e)=>{
    if(!e.target.closest('.DayPicker_1') ){
      p.dispatch({type:'modalOff'})
      setTimeout(()=>{
        window.removeEventListener('click', dateModalClose)
      })
    }
  },[])

  //업무 생성시 상태 업데이트
  const taskInfoChange = e =>{
    const {value, name} = e.target;
    taskInfoCng({
      ...taskInfo,
      [name]: value
    })
  }

  //업무 목록
  let [list, listCng] = useState();

  //업무 중요도 배열
  const typeArr = {
    '10':'긴급',
    '20':'높음',
    '30':'보통',
    '40':'낮음',
    '50':'무시',
  }

  // 업무 필터
  const [taskFilter, taskFilterCng] = useState({
    myTaskFilter:'전체',
    mileFilter:'전체',
    priFilter:'전체',
    statusFilter:'전체',
  })

  // 필터 변경 핸들러
  const taskFilterChange = e =>{
    taskFilterCng({
      ...taskFilter,
      [e.target.name]:e.target.value
    })
  }

  //task 리스트
  const [taskList, taskListCng] = useState();

  //task 필터_내업무
  const taskMyFilterFunc = list =>{
    let result = false;
    list.taskMembers.map(r=>{
      if(r.projmember_seq == p.myMemberInfo.projmember_seq){
        result = true
      }
    })
    return result;
  }

  //task 리스트 불러오기
  const taskListGetFunc = () =>{
      
    taskListCng();
    let listDummy = [];

    axios.get(host+'/ajax/'+p.prjSeq+'/tasklist')
    .then(r=>{
      if(taskFilter.myTaskFilter != '전체'){
        listDummy = r.data.filter(rr => taskMyFilterFunc(rr));
      } else {
        listDummy = r.data;
      }

      if(taskFilter.mileFilter != '전체'){
        listDummy = listDummy.filter(rr => Number(rr.task.milestone_seq) == Number(taskFilter.mileFilter));
      } else {
        listDummy = listDummy;
      }

      if(taskFilter.priFilter != '전체'){
        listDummy = listDummy.filter(rr => Number(rr.task.priority_code) == Number(taskFilter.priFilter));
      } else {
        listDummy = listDummy;
      }
      if(taskFilter.statusFilter != '전체'){
        if(taskFilter.statusFilter == '진행중'){
          listDummy = listDummy.filter(rr => Number(rr.task.task_status) == 0);
        }else if(taskFilter.statusFilter == '종료'){
          listDummy = listDummy.filter(rr => Number(rr.task.task_status) == 1);
        }
      } else {
        listDummy = listDummy;
      }
      taskListCng(listDummy)
      p.dispatch({type:'loadingOff'})

    })
    .catch(e=>{
      console.log(e)
      p.dispatch({type:'loadingOff'})
    })
    
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
    taskFilterCng({
      myTaskFilter:'전체',
      mileFilter:'전체',
      priFilter:'전체',
      statusFilter:'전체',
    })
  },[p.myMemberInfo])


  useEffect(()=>{
    if(p.myMemberInfo){
      p.dispatch({type:'loadingOn'})
      taskListGetFunc();
    }
  },[taskFilter])

  useEffect(()=>{
    if(p.myMemberInfo){
      taskListGetFunc();
    }
  },[p.refresh])

  useEffect(()=>{
    if(params.pageSeq){
      axios.get(host+'/ajax/taskView/'+params.pageSeq)
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

        p.dispatch({type:'taskModalCng',val:true})

        setTimeout(()=>{
          window.addEventListener('click', taskModalClose)
        })
        p.dispatch({type:'loadingOff'})
      })
      .catch(e=>{
        history.push('/404')
        p.dispatch({type:'loadingOff'})

      })
    }else {
      p.dispatch({type:'taskModalCng',val:false})
    }
  },[location])

  return(
    <div className="pageContentWrap taskWrap">
      <div className="header">
        <p className="title">&#x1F4BC; 업무</p>
        {
          p.projectInfo.project_status != "1"
          ?
          <>
            <div className="toolTipTopBox">
              <p className="createBtn" style={{backgroundColor:p.prjColor}} onClick={()=>{
                taskInfoCng({
                  ...taskInfo,
                  projmember_seq:p.myMemberInfo.projmember_seq
                })
                createModalCng(true)
                setTimeout(()=>{
                  titleInput.current.focus();
                })
              }}>+ 업무 만들기</p>
            </div>
            <TaskCreateModal
                show={createModal}
                onHide={() => {
                  createModalCng(false);
                  p.dispatch({type:'modalOff'})
                  window.removeEventListener('click', dateModalClose)
                  taskInfoCng({
                    task_title:'',
                    task_content:'',
                    task_startdate:'',
                    task_duedate:'',
                    milestone_seq:'0',
                    projmember_seq:'',
                    project_seq:p.prjSeq,
                  })
                  chargeMemberCng([])
                  alertCng(false)
                }}
                dispatch={p.dispatch}
                taskInfo={taskInfo}
                taskInfoCng={taskInfoCng}
                taskInfoChange={taskInfoChange}
                dateModalClose={dateModalClose}
                alert={alert}
                alertCng={alertCng}
                listCng={listCng}
                prjSeq={p.prjSeq}
                titleInput={titleInput}
                mileStoneList={p.mileStoneList}
                appendMemberModalClose={appendMemberModalClose}
                appendMemberModal={appendMemberModal}
                appendMemberModalCng={appendMemberModalCng}
                memberList={p.memberList}
                chargeMember={chargeMember}
                chargeMemberCng={chargeMemberCng}
            />
          </>
          :null
        }
      </div>
      <div className="taskConWrap">
        <div className="taskFilter">
          {/* <p className="title"><i class="fas fa-filter"></i>업무 필터</p> */}

          <Form.Check
            type="radio"
            name="myTaskFilter"
            label="전체 업무"
            value="전체"
            id="myTaskFilter1"
            checked={taskFilter.myTaskFilter=='전체'?true:false}
            onChange={taskFilterChange}
          />

          <Form.Check
            type="radio"
            name="myTaskFilter"
            label="내 업무"
            value="내업무"
            ㅊ
            id="myTaskFilter2"
            onChange={taskFilterChange}
          />
          <hr/>
          <p className="title">마일스톤</p>
          <Form.Check
            type="radio"
            name="mileFilter"
            value="전체"
            label="전체"
            id={"mileFilter0"}
            checked={taskFilter.mileFilter=='전체'?true:false}
            onChange={taskFilterChange}
          />
          {
            p.mileStoneList&&
              p.mileStoneList.length >0
              ?
                p.mileStoneList.map((r,i)=>{
                  return(
                    <Form.Check
                      type="radio"
                      name="mileFilter"
                      value={r.milestone_seq}
                      label={r.milestone_title}
                      id={"mileFilter"+(i+1)}
                      checked={taskFilter.mileFilter==r.milestone_seq?true:false}
                      onChange={taskFilterChange}
                    />
                  )
                })
              : null
          }
          <hr/>
          <p className="title">중요도</p>
          <Form.Check
            type="radio"
            name="priFilter"
            value="전체"
            label="전체"
            id={"priFilter0"}
            checked={taskFilter.priFilter=='전체'?true:false}
            onChange={taskFilterChange}
          />
          {
            Object.keys(typeArr).map((key, i)=>{
              return(
                <Form.Check
                  type="radio"
                  name="priFilter"
                  value={key}
                  label={typeArr[key]}
                  id={"priFilter"+(i+1)}
                  checked={taskFilter.priFilter==key?true:false}
                  onChange={taskFilterChange}
                />
              )

            })

          }

        </div>
        <div className="taskListWrap">
          <div className="taskHeader">
            <div className="filter">

              <p style={
                taskFilter.statusFilter == '전체'?
                {backgroundColor:p.prjColor,color:'#fff'}
                :{color:p.prjColor}
                } onClick={()=>{
                  taskFilterCng({
                    ...taskFilter,
                    statusFilter:'전체'
                  })
                }}>전체</p>
              <p style={
                taskFilter.statusFilter == '진행중'?
                {backgroundColor:p.prjColor,color:'#fff'}
                :{color:p.prjColor}
              } onClick={()=>{
                taskFilterCng({
                  ...taskFilter,
                  statusFilter:'진행중'
                })
              }}>진행중</p>
              <p style={
                taskFilter.statusFilter == '종료'?
                {backgroundColor:p.prjColor,color:'#fff'}
                :{color:p.prjColor}
              } onClick={()=>{
                taskFilterCng({
                  ...taskFilter,
                  statusFilter:'종료'
                })
              }}>종료</p>
            </div>
            <div className="sort">
              <p className="sortBtn w120">담당자</p>
              <p className="sortBtn w80">중요도</p>
              <p className="sortBtn w120">라벨</p>
              <p className="sortBtn w80">작성자</p>
            </div>
          </div>
          <div className="taskList">

            {
              taskList
              ?
                taskList.length>0
                ?
                  taskList.map(r=>{
                    let writerInfo = memberInfoGetFunc(r.task.projmember_seq)
                    if(r.task.task_isdelete == '0'){
                      return(
                        <div className="taskRow">
                          <p className="title" onClick={()=>{
                            p.dispatch({type:'loadingOn'})
                            axios.get(host+'/ajax/taskView/'+r.task.task_seq)
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

                              p.dispatch({type:'taskModalCng',val:true})

                              setTimeout(()=>{
                                window.addEventListener('click', taskModalClose)
                              })
                              p.dispatch({type:'loadingOff'})
                            })
                            .catch(e=>{
                              console.log(e)
                              p.dispatch({type:'loadingOff'})

                            })
                          }}>{r.task.task_title}</p>
                          <div className="infoWrap">
                            {/* 담당자 */}
                            <div className="profileWrap w120">
                              {
                                r.taskMembers
                                ?
                                  r.taskMembers.length > 0
                                  ?
                                    r.taskMembers.map(rr=>{
                                      let chargeInfo = memberInfoGetFunc(rr.projmember_seq)
                                      return(
                                        <div className="profileImg toolTipTopBox">
                                          <p className="toolTip">{chargeInfo.name}</p>
                                          <div>
                                            <img src={chargeInfo.data}/>
                                          </div>
                                        </div>
                                      )
                                    })
                                  : <p className="noMember">없음</p>
                                : <p className="noMember">없음</p>
                              }
                              

                            </div>
                            {/* 중요도 */}
                            <p className={"type w80 " + (r.task.priority_code?typeArr[r.task.priority_code]:'없음')}>{r.task.priority_code?typeArr[r.task.priority_code]:'없음'}</p>
                            {/* 라벨 */}
                            <div className="label w120">
                              {
                                r.task.label_seq
                                ?
                                  <b style={{backgroundColor:seqColorTrans(r.task.label_seq)}}>
                                    {r.task.label_title}
                                  </b>
                                :
                                <b style={{backgroundColor:'#ccc',color:'#555'}}>
                                  없음
                                </b>
                              }


                            </div>
                            {/* 작성자 */}
                            <div className="profileImg writer toolTipTopBox">
                              <p className="toolTip">{writerInfo.name}</p>
                              <div>
                                <img src={writerInfo.data}/>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }

                  })
                :<div className="noTaskMsg">업무가 없습니다.</div>
              :<Box sx={{ width: '100%' }}><LinearProgress /></Box>
            }
          </div>
        </div>

      </div>


    </div>
  )
}

function TaskCreateModal(p) {

  return (
      <Modal
          {...p}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="modalWrap taskCreateModalWrap"
          style={{marginTop:'-70px'}}
          
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter" className="modalTitle">
            업무 만들기
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            p.alert
                ?
                <Alert variant={'danger'} style={{fontSize:'.8rem',marginBottom:'.4rem'}}>업무 제목을 입력해주세요. &#x1F602;</Alert>
                : null
          }

          <Form.Group className="mb-2 piumInput" controlId="floatingInput">
            <FloatingLabel
                controlId="floatingInput"
                label="업무 제목"
            >
              <Form.Control type="text" placeholder="업무 제목" name="task_title" spellCheck="false" onChange={p.taskInfoChange} ref={p.titleInput}/>
            </FloatingLabel>
          </Form.Group>


          <textarea className="taskConInput form-control" name="task_content" placeholder="설명" onChange={p.taskInfoChange} spellCheck={false}></textarea>

          <p className="subTitle">마일스톤</p>
          <Form.Select name="milestone_seq" onChange={p.taskInfoChange}>
            <option value="0" selected={true}>마일스톤 없음</option>
            {
              p.mileStoneList&&
                p.mileStoneList.length >0
                ?
                p.mileStoneList.map((r,i)=>{
                  return(
                    <option value={r.milestone_seq}>{r.milestone_title}</option>
                  )
                })
                : null
            }
            
          </Form.Select>
          
          <div className="datePickerWrap">
            <DatePicker
                pickerDateCng={p.taskInfoCng}
                pickerDate={p.taskInfo}
                pickerStartKey={'task_startdate'}
                pickerEndKey={'task_duedate'}
                dateModalClose={p.dateModalClose}
            />
            <p className="dateBtn" onClick={
              ()=>{
                p.dispatch({type:'modalOn'})
                setTimeout(()=>{
                  window.addEventListener('click', p.dateModalClose)
                })
              }
            }>
              <i class="far fa-calendar-check"></i> 일정선택
            </p>
            <p className="dateInfo">
              {p.taskInfo.task_startdate?(p.taskInfo.task_startdate + " ~ "):''}
              {p.taskInfo.task_duedate?p.taskInfo.task_duedate:''}
            </p>
          </div>

          <div className="chargeWrap">
            <div className={"chrgeWrap "+(p.appendMemberModal?'on':'')}>
              {
                p.memberList &&
                p.memberList.map(r=>{
                  return(
                    <div className="member" onClick={()=>{
                      let check = p.chargeMember.find(rr=>rr==r.projmember_seq)

                      if(check==undefined){
                        p.chargeMemberCng([
                          ...p.chargeMember,
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
            <div className="chargeBtn" onClick={()=>{
              setTimeout(()=>{
                p.appendMemberModalCng(true)
                window.addEventListener('click', p.appendMemberModalClose)
              })

            }}>
              <i class="fas fa-users"></i>멤버배정
            </div>
            
            <div className="chargeList">
            {
              p.chargeMember && p.memberList 
                ?
                  p.chargeMember.map((r,i)=>{
                    let memberList = [...p.memberList]
                    
                    let rr = memberList.filter(rr => rr.projmember_seq == r)

                    return(
                      <div className="profileImg toolTipTopBox" onClick={()=>{
                        let dummy = [...p.chargeMember]
                        dummy.map((r,i)=>{
                          if(r == rr[0].projmember_seq){
                            dummy.splice(i,1)
                            p.chargeMemberCng(dummy)
                          }
                        })
                      }}>
                        <p className="toolTip">{rr[0].projmember_name?rr[0].projmember_name:'User#'+rr[0].projmember_seq}</p>
                        <div>
                          <img src={rr[0].projmember_data?'data:image;base64,'+rr[0].projmember_data:pub.img+'defaultProfile.svg'}/>
                        </div>
                      </div>
                    )
                  })
                : null
            }
              
              
              
            </div>
          </div>


        </Modal.Body>
        <Modal.Footer className="modalBtnWrap">
          <Button className="modalBtn" onClick={()=>{

            if(p.taskInfo.task_title != ''){
              let taskData = {};

              if(p.taskInfo.task_startdate && !p.taskInfo.task_duedate){
                taskData = {
                  ...p.taskInfo,
                  task_duedate:p.taskInfo.task_startdate
                }
              } else {
                taskData = {...p.taskInfo}
              }
              p.dispatch({type:'loadingOn'})
              axios.post(host+'/ajax/createTask', {
                taskInfo : taskData,
                memberInfo : p.chargeMember
              })
              .then(r=>{
                p.onHide();
                p.dispatch({type:'refreshCng'})
                p.dispatch({type:'loadingOff'})

              })
              .catch(e=>{
                console.log(e)
                p.onHide();
                p.dispatch({type:'loadingOff'})
              })
            } else {
              p.alertCng(true)
            }
          }}>만들기</Button>



        </Modal.Footer>
      </Modal>
  );
}


function transReducer(state){
  return {
    datePickerModal : state.datePickerModal,
    isMaster:state.isMaster,
    projectInfo:state.projectInfo,
    memberList:state.memberList,
    myMemberInfo:state.myMemberInfo,
    mileStoneList : state.mileStoneList,
    refresh:state.refresh,
    pageInfo:state.pageInfo
  }
}

export default connect(transReducer)(Task);
