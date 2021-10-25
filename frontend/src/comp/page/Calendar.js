import axios from "axios";
import React, { useEffect, useState, useCallback } from "react"
import {pub, colors, pages, host, seqColorTrans} from '../Helper.js'
import DatePicker from '../DatePicker.js'
import {FloatingLabel, Form, Button, Alert, Modal} from 'react-bootstrap'
import { useHistory } from "react-router-dom";
import {connect} from 'react-redux';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css';
import "react-datepicker/dist/react-datepicker.css";



function Calendar(p){
  const history = useHistory();

  //캘린더에 표시할 일정 정보
  const [memoList,memoListCng] = useState();

  //캘린더에 표시할 일정 정보 불러오기
  const memoListGetFunc = () => {
    axios.get(host+'/ajax/calList/'+p.projectInfo.project_seq)
    .then(r=>{
      let taskList = r.data[0].taskListProj
      let calendarList = r.data[0].calListProj
      let memoListDummy = [];
      taskList.forEach(r=>{
        if(r.task_startdate && r.task_isdelete=='0'){
          memoListDummy.push(
            {
              title : r.task_title,
              description: r.task_content,
              start : r.task_startdate,
              end:r.task_duedate,
              classNames:'task',
              // editable:false,
              task_seq:r.task_seq,
              projmember_seq:r.projmember_seq,
              color:seqColorTrans(r.task_seq)
            },
          )
        }
      })

      calendarList.forEach(r=>{

        memoListDummy.push(
          {
            title : r.calendar_title,
            memoSeq : r.calendar_seq,
            description: r.calendar_content,
            start : r.calendar_startdate,
            end:r.calendar_enddate,
            backgroundColor:"#273646",

          },
        )
      })
      memoListCng(memoListDummy)
      p.dispatch({type:'loadingOff'})
    })
    .catch(e=>{
      console.log(e)
      p.dispatch({type:'loadingOff'})
    })
  }

  //메모등록 정보
  const [createData, createDataCng] = useState({
    calendar_title:'',
    calendar_content:'',
    calendar_startdate:'',
    calendar_enddate:'',
    projmember_seq:'',
    project_seq:'',
  });

  //메모등록 모달 컨트롤
  const [createModal, createModalCng] = useState(false)

  //메모등록, 수정시 내부 알림창
  const [alert,alertCng] = useState(false);
  const [dateAlert,dateAlertCng] = useState(false);


  //메모 등록, 수정 날짜선택 이중모달 컨트롤
  let dateModalClose =useCallback((e)=>{
    if(!e.target.closest('.DayPicker_1') ){
      p.dispatch({type:'modalOff'})
      setTimeout(()=>{
        window.removeEventListener('click', dateModalClose)
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

  //업무 일정수정_edit(drag)
  const taskQuickEditFunc = (e)=>{
    p.dispatch({type:'loadingOn'})
    axios.post(host+'/ajax/updateTaskDate',{
      task_seq : e.event._def.extendedProps.task_seq,
      task_startdate : e.event.startStr.substring(0,10),
      task_duedate : e.event.endStr.substring(0,10)
    })
    .then(r=>{
      p.dispatch({type:'refreshCng'})
    })
    .catch(e=>{
      console.log(e)
      p.dispatch({type:'loadingOff'})
    })

  }
  //메모 일정수정_edit(drag)
  const memoQuickEditFunc = (e)=>{
    p.dispatch({type:'loadingOn'})

    const start = e.event.startStr.substring(0,10)
    const end = e.event.endStr.substring(0,10)
    const seq = e.event.extendedProps.memoSeq
    const title = e.event._def.title;
    const content = e.event.extendedProps.description

    axios.post(host + '/ajax/updateDate',{
      calendar_seq:seq,
      calendar_startdate:start,
      calendar_enddate:end,
      calendar_title:title,
      calendar_content:content,
      projmember_seq:p.myMemberInfo.projmember_seq,
      project_seq:p.projectInfo.project_seq,
    })
    .then(r=>{
      memoListGetFunc();
    })
    .catch(e=>{
      console.log(e)
      p.dispatch({type:'loadingOff'})
    })
  }

  //메모 수정 모달 컨트롤
  const [editModal,editModalCng] = useState(false)

  //메모 수정 정보
  const [editData, editDataCng] = useState({
    calendar_seq:'',
    calendar_title:'',
    calendar_content:'',
    calendar_startdate:'',
    calendar_enddate:'',
    projmember_seq:'',
    project_seq:'',
  });

  useEffect(()=>{
    p.dispatch({type:'loadingOn'})
    memoListGetFunc();
  },[p.projectInfo, p.pageInfo, p.refresh])

  return(
    <div className="calendarWrap pageContentWrap">
      <div className="pageBtnWrap">
        <p className="pageBtn on" style={{color:p.prjColor,borderColor:p.prjColor}} onClick={()=>{
          p.dispatch({type:'pagePush', val:'calendar'})
          history.push('/project/'+p.prjSeq+'/calendar')
        }}>캘린더</p>
        <p className="pageBtn" onClick={()=>{
          p.dispatch({type:'pagePush', val:'timeLine'})
          history.push('/project/'+p.prjSeq+'/timeLine')
        }}>타임라인</p>
        <p className="pageBtn" onClick={()=>{
          p.dispatch({type:'pagePush', val:'projectChart'})
          history.push('/project/'+p.prjSeq+'/projectChart')
        }}>프로젝트개요</p>
        <p className="pageBtn" onClick={()=>{
          p.dispatch({type:'pagePush', val:'fileList'})
          history.push('/project/'+p.prjSeq+'/fileList')
        }}>파일보관함</p>
      </div>

      <CreateDateModal
        show={createModal}
        onHide={() => {
          createModalCng(false)
          alertCng(false)
          dateAlertCng(false)
          createDataCng({
            calendar_title:'',
            calendar_content:'',
            calendar_startdate:'',
            calendar_enddate:'',
            projmember_seq:'',
            project_seq:'',
          })
        }}
        alert={alert}
        alertCng={alertCng}
        dateAlertCng={dateAlertCng}
        createModalCng={createModalCng}
        prjColor={p.prjColor}
        dispatch={p.dispatch}
        dateModalClose={dateModalClose}
        createData={createData}
        createDataCng={createDataCng}
        memoListGetFunc={memoListGetFunc}
      />
      <EditModal
        show={editModal}
        onHide={() => {
          editModalCng(false)
          alertCng(false)
          dateAlertCng(false)
          editDataCng({
            calendar_seq:'',
            calendar_title:'',
            calendar_content:'',
            calendar_startdate:'',
            calendar_enddate:'',
            projmember_seq:'',
            project_seq:'',
          })
        }}
        alert={alert}
        alertCng={alertCng}
        dateAlertCng={dateAlertCng}
        editModalCng={editModalCng}
        prjColor={p.prjColor}
        dispatch={p.dispatch}
        dateModalClose={dateModalClose}
        editData={editData}
        editDataCng={editDataCng}
        memoListGetFunc={memoListGetFunc}
      />
      <div className="calendarCon">
        <FullCalendar
          plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrapPlugin ]}
          initialView="dayGridMonth"
          dateClick={e=>{
            createModalCng(true);
            createDataCng({
              calendar_title:'',
              calendar_content:'',
              calendar_startdate:e.dayEl.dataset.date,
              calendar_enddate:e.dayEl.dataset.date,
              projmember_seq : p.myMemberInfo.projmember_seq,
              project_seq:p.projectInfo.project_seq
            })
          }}
          weekends={true}
          headerToolbar={{
              start: 'title',
              center: '',
              end: 'today,prev,next'
          }}
          windowResizeDelay={0}
          contentHeight="auto"
          height="auto"
          editable={true}
          selectable={true}
          dayMaxEvents={3}
          locale='ko'
          events={memoList}
          displayEventTime={false}
          eventClick={e=>{
            if(e.event.extendedProps.memoSeq){
              editDataCng({
                ...editData,
                calendar_seq:e.event._def.extendedProps.memoSeq,
                calendar_title:e.event._def.title,
                calendar_content:e.event._def.extendedProps.description,
                calendar_startdate:e.event.startStr.substring(0,10),
                calendar_enddate:e.event.endStr.substring(0,10),
              })
              editModalCng(true)
            }else {
              p.dispatch({type:'loadingOn'})
              axios.get(host+'/ajax/taskView/'+e.event._def.extendedProps.task_seq)
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

            }
          }}
          eventDrop={e=>{
            if(e.event.extendedProps.memoSeq){
              memoQuickEditFunc(e)
            }else {
              taskQuickEditFunc(e)
            }
          }}

        />
      </div>

    </div>
  )
}

function CreateDateModal(p) {
  return (
    <Modal
      {...p}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modalWrap"
      style={{marginTop:'-70px'}}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="modalTitle">
          캘린더 메모 만들기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          p.alert
          ?
          <Alert variant={'danger'} style={{fontSize:'.8rem',marginBottom:'.4rem'}}>메모 제목을 입력해주세요. &#x1F602;</Alert>
          : null
        }
        {
          p.dateAlert
          ?
          <Alert variant={'danger'} style={{fontSize:'.8rem',marginBottom:'.4rem'}}>날짜를 지정해주세요. &#x1F602;</Alert>
          : null
        }

        <Form.Group className="mb-2 piumInput" controlId="floatingInput">
          <FloatingLabel
            controlId="floatingInput"
            label="메모 제목"
          >
            <Form.Control type="text" placeholder="메모 제목" name="project_title" spellCheck="false" onChange={e=>{
              p.createDataCng({
                ...p.createData,
                calendar_title:e.target.value
              })
            }}/>
          </FloatingLabel>
        </Form.Group>


        <Form.Group className=" piumInput" controlId="floatingTextarea">
          <FloatingLabel controlId="floatingTextarea" label="내용">
            <Form.Control type="textarea" placeholder="내용" name="project_content" spellCheck="false" onChange={e=>{
              p.createDataCng({
                ...p.createData,
                calendar_content:e.target.value
              })
            }}/>
          </FloatingLabel>
        </Form.Group>

        <div className="datePickerWrap">
          <DatePicker
            pickerStartDate={p.createData.calendar_startdate}
            pickerEndDate={p.createData.calendar_enddate}
            pickerDateCng={p.createDataCng}
            pickerDate={p.createData}
            pickerStartKey={'calendar_startdate'}
            pickerEndKey={'calendar_enddate'}
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
            {p.createData.calendar_startdate?(p.createData.calendar_startdate + " ~ "):''}

            {p.createData.calendar_enddate?p.createData.calendar_enddate:''}

          </p>
        </div>

      </Modal.Body>
      <Modal.Footer className="modalBtnWrap">
        <Button className="modalBtn" onClick={()=>{
          if(!p.createData.calendar_title){
            p.alertCng(true)
            p.dateAlertCng(false)
          }else if(!p.createData.calendar_startdate){
            p.dateAlertCng(true)
            p.alertCng(false)
          }else {
            let data = {};
            if(p.createData.calendar_enddate){
              data = {
                ...p.createData,
                calendar_enddate : p.createData.calendar_enddate
              }
            } else {
              data = {
                ...p.createData,
                calendar_enddate : p.createData.calendar_startdate
              }
            }

            p.dispatch({type:'loadingOn'})
            axios.post(host+'/ajax/createCal',data)
            .then(r=>{
              p.createModalCng(false)
              p.alertCng(false)
              p.dateAlertCng(false)
              p.createDataCng({
                calendar_title:'',
                calendar_content:'',
                calendar_startdate:'',
                calendar_enddate:'',
                projmember_seq:'',
                project_seq:'',
              })
              p.memoListGetFunc();
            })
            .catch(e=>{
              console.log(e)
              p.dispatch({type:'loadingOff'})
            })
          }
        }}>만들기</Button>



      </Modal.Footer>
    </Modal>
  );
}

function EditModal(p){
  return (
    <Modal
      {...p}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modalWrap"
      style={{marginTop:'-70px'}}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="modalTitle">
          캘린더 메모 수정
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          p.alert
          ?
          <Alert variant={'danger'} style={{fontSize:'.8rem',marginBottom:'.4rem'}}>메모 제목을 입력해주세요. &#x1F602;</Alert>
          : null
        }
        {
          p.dateAlert
          ?
          <Alert variant={'danger'} style={{fontSize:'.8rem',marginBottom:'.4rem'}}>날짜를 지정해주세요. &#x1F602;</Alert>
          : null
        }

        <Form.Group className="mb-2 piumInput" controlId="floatingInput">
          <FloatingLabel
            controlId="floatingInput"
            label="메모 제목"
          >
            <Form.Control type="text" placeholder="메모 제목" value={p.editData.calendar_title} name="project_title" spellCheck="false" onChange={e=>{
              p.editDataCng({
                ...p.editData,
                calendar_title:e.target.value
              })
            }}/>
          </FloatingLabel>
        </Form.Group>


        <Form.Group className=" piumInput" controlId="floatingTextarea">
          <FloatingLabel controlId="floatingTextarea" label="내용">
            <Form.Control type="textarea" placeholder="내용" name="project_content" spellCheck="false" value={p.editData.calendar_content} onChange={e=>{
              p.editDataCng({
                ...p.editData,
                calendar_content:e.target.value
              })
            }}/>
          </FloatingLabel>
        </Form.Group>

        <div className="datePickerWrap">
          <DatePicker
            pickerStartDate={p.editData.calendar_startdate}
            pickerEndDate={p.editData.calendar_enddate}
            pickerDateCng={p.editDataCng}
            pickerDate={p.editData}
            pickerStartKey={'calendar_startdate'}
            pickerEndKey={'calendar_enddate'}
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
            {p.editData.calendar_startdate?(p.editData.calendar_startdate + " ~ "):''}

            {p.editData.calendar_enddate?p.editData.calendar_enddate:''}

          </p>
        </div>

      </Modal.Body>
      <Modal.Footer className="modalBtnWrap del">
        <Button className="modalBtn danger" onClick={()=>{
          p.dispatch({type:'loadingOn'})
          axios.get(host+'/ajax/deleteCal/'+p.editData.calendar_seq)
          .then(r=>{
            p.editModalCng(false)
            p.memoListGetFunc();
            p.dispatch({type:'loadingOff'})
          })
          .catch(e=>{
            console.log(e)
            p.dispatch({type:'loadingOff'})
          })
        }}>
          메모 지우기
        </Button>
        <Button className="modalBtn" onClick={()=>{
          if(!p.editData.calendar_title){
            p.alertCng(true)
            p.dateAlertCng(false)
          }else if(!p.editData.calendar_startdate){
            p.dateAlertCng(true)
            p.alertCng(false)
          }else {
            let data = {};
            if(p.editData.calendar_enddate){
              data = {
                ...p.editData,
                calendar_enddate : p.editData.calendar_enddate
              }
            } else {
              data = {
                ...p.editData,
                calendar_enddate : p.editData.calendar_startdate
              }
            }

            p.dispatch({type:'loadingOn'})
            axios.post(host+'/ajax/updateCal',data)
            .then(r=>{
              p.editModalCng(false)
              p.alertCng(false)
              p.dateAlertCng(false)
              p.editDataCng({
                calendar_seq:'',
                calendar_title:'',
                calendar_content:'',
                calendar_startdate:'',
                calendar_enddate:'',
                projmember_seq:'',
                project_seq:'',
              })
              p.memoListGetFunc();
            })
            .catch(e=>{
              console.log(e)
              p.dispatch({type:'loadingOff'})
            })
          }
        }}>수정하기</Button>



      </Modal.Footer>
    </Modal>
  );
}


function transReducer(state){
  return {
    loading : state.loading,
    datePickerModal : state.datePickerModal,
    projectInfo : state.projectInfo,
    pageInfo : state.pageInfo,
    myMemberInfo : state.myMemberInfo,
    taskModal : state.taskModal,
    taskModalData : state.taskModalData,
    refresh : state.refresh,
  }
}

export default connect(transReducer)(Calendar);
