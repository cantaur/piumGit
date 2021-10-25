import axios from "axios";
import React, { useEffect, useState, useCallback, useRef } from "react"
import {pub, colors, pages, seqColorTrans,host} from '../Helper.js'
import StoneList from "./comp/StoneList.js";
import DatePicker from '../DatePicker.js'
import {FloatingLabel, Form, Button, Dropdown, Alert, Modal} from 'react-bootstrap'
import { Link, useParams, withRouter, useHistory, useLocation } from "react-router-dom";
import {connect} from 'react-redux';
import NonePage from "../NonePage.js";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';




function MileStone(p){

  const history = useHistory();
  const location = useLocation();

  //마일스톤 만들기 모달 상태
  const [createModal, createModalCng] = useState(false)

  //마일스톤 만들기 제목 인풋
  const titleInput = useRef();


  //마일스톤 만들기 정보
  const [mileStoneInfo, mileStoneInfoCng] = useState({
    milestone_title:'',
    milestone_content:'',
    milestone_startdate:'',
    milestone_duedate:'',
    project_seq:p.prjSeq,
  });

  //마일스톤 생성시 상태 업데이트
  const mileStoneInfoChange = e =>{
    const {value, name} = e.target;
    mileStoneInfoCng({
      ...mileStoneInfo,
      [name]: value
    })
  }

  //날짜선택 이중모달 컨트롤
  let dateModalClose =useCallback((e)=>{
    if(!e.target.closest('.DayPicker_1') ){
      p.dispatch({type:'modalOff'})
      setTimeout(()=>{
        window.removeEventListener('click', dateModalClose)
      })
    }
  },[])

  //마일스톤 생성_제목 알림 상태
  let [alert, alertCng] = useState(false);


  //마일스톤 목록
  let [list, listCng] = useState();

  //배열에서 완료된 마일스톤 갯수 찾기
  const completeMileStoneCnt = (list) =>{
    let cnt = 0;
    list.map((r, i)=>{
      if(r.milestone_status ==1 && r.milestone_isdelete == 0){
        cnt++;
      }
    })
    return cnt;
  }

  //배열에서 진행중인 마일스톤 갯수 찾기
  const ingMileStoneCnt = (list) =>{
    let cnt = 0;
    list.map((r,i)=>{
      if(r.milestone_status == 0 && r.milestone_isdelete == 0){
        cnt++;
      }
    })
    return cnt;
  }


  useEffect(()=>{
    p.dispatch({type:'mileStoneListCng', val:''})
    axios.get(host+'/ajax/'+p.projectInfo.project_seq+'/milestonelist')
    .then(r=>{
      p.dispatch({type:'mileStoneListCng', val:r.data})
    })
    .catch(e=>{
      console.log(e)
    })
  },[])
  
  useEffect(()=>{
    listCng();
    if(p.mileStoneList){
      listCng(p.mileStoneList)
    }
  },[p.mileStoneList])
  

  return(
    <div className="pageContentWrap mileStoneWrap">
      
      <div className="header">
        <p className="title">&#x1F6A9; 마일스톤</p>
        {
          p.isMaster 
          ? 
            p.projectInfo.project_status != "1"
            ?
            <>
              <div className="toolTipTopBox">
                <p className="createBtn" style={{backgroundColor:p.prjColor}} onClick={()=>{
                  createModalCng(true)
                  setTimeout(()=>{
                    titleInput.current.focus();
                  })
                }}>+ 마일스톤 만들기</p>
              </div>
              <MileStoneCreateModal
                show={createModal}
                onHide={() => {
                  createModalCng(false);
                  p.dispatch({type:'modalOff'})
                  window.removeEventListener('click', dateModalClose)
                  mileStoneInfoCng({
                    milestone_title:'',
                    milestone_content:'',
                    milestone_startdate:'',
                    milestone_duedate:'',
                    project_seq:p.prjSeq,
                  })
                  alertCng(false)
                }}
                dispatch={p.dispatch}
                mileStoneInfo={mileStoneInfo}
                mileStoneInfoCng={mileStoneInfoCng}
                mileStoneInfoChange={mileStoneInfoChange}
                dateModalClose={dateModalClose}
                alert={alert}
                alertCng={alertCng}
                listCng={listCng}
                prjSeq={p.prjSeq}
                titleInput={titleInput}
              />

            </>
            :null
          :null
        }
        
      </div>

      
      <div className="stoneListWrap">
        {
          list
          ?
            list.map((row, i)=>{
              if(row.milestone_status==0 && row.milestone_isdelete == 0){
                return(
                  <StoneList 
                    prjSeq={p.prjSeq}
                    milestone_seq={row.milestone_seq}
                    milestone_title={row.milestone_title}
                    milestone_content={row.milestone_content}
                    color={seqColorTrans(row.milestone_seq)} 
                    completeTaskCnt={row.closedTask}
                    taskCnt={row.countTask}
                    milestone_startdate={row.milestone_startdate}
                    milestone_duedate={row.milestone_duedate}
                    mileStoneInfo={mileStoneInfo}
                    mileStoneInfoCng={mileStoneInfoCng}
                  />
                )
              }
            })
          :null
        }
        {
          list
          ?
            ingMileStoneCnt(list) == 0
            ?<div className="noMileStoneMsg">진행중인 마일스톤이 없습니다. &#x1F602;</div>
            :null
          : <Box sx={{ width: '100%' }}><LinearProgress /></Box>
        }
      </div>
      <div className="stoneListWrap">
        {
          list
          ?
            completeMileStoneCnt(list) > 0
            ?
            <p className="completeHead">&#x231B; 완료된 마일스톤</p>
            :null
          :null
        }
        {
          list
          ?
            completeMileStoneCnt(list) > 0
            ? 
              list.map((row, i)=>{
                if(row.milestone_status==1 && row.milestone_isdelete == 0){
                return(
                    <StoneList 
                      prjSeq={p.prjSeq}
                      milestone_seq={row.milestone_seq}
                      milestone_title={row.milestone_title}
                      milestone_content={row.milestone_content}
                      color={"#555555"} 
                      completeTaskCnt={row.closedTask}
                      taskCnt={row.countTask}
                      milestone_startdate={row.milestone_startdate}
                      milestone_duedate={row.milestone_duedate}
                      milestone_status={row.milestone_status}
                      mileStoneInfo={mileStoneInfo}
                      mileStoneInfoCng={mileStoneInfoCng}
                      isComplete={true}
                    />
                  )
                }
              })
            :null
          :null
        }
      </div>
      

    </div>
  )
}

function MileStoneCreateModal(p) {

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
          마일스톤 만들기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          p.alert
          ?
          <Alert variant={'danger'} style={{fontSize:'.8rem',marginBottom:'.4rem'}}>마일스톤 제목을 입력해주세요. &#x1F602;</Alert>
          : null
        }
        
        <Form.Group className="mb-2 piumInput" controlId="floatingInput">
          <FloatingLabel
            controlId="floatingInput"
            label="마일스톤 제목"
          >
            <Form.Control type="text" placeholder="마일스톤 제목" name="milestone_title" spellCheck="false" onChange={p.mileStoneInfoChange} ref={p.titleInput}/>
          </FloatingLabel>
        </Form.Group>
        

        <Form.Group className=" piumInput" controlId="floatingTextarea">
          <FloatingLabel controlId="floatingTextarea" label="설명">
            <Form.Control type="textarea" placeholder="설명" name="milestone_content" spellcheck="false" onChange={p.mileStoneInfoChange}/>
          </FloatingLabel>
        </Form.Group>

        <div className="datePickerWrap">
          <DatePicker
            pickerDateCng={p.mileStoneInfoCng}
            pickerDate={p.mileStoneInfo}
            pickerStartKey={'milestone_startdate'}
            pickerEndKey={'milestone_duedate'}
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
            {p.mileStoneInfo.milestone_startdate?(p.mileStoneInfo.milestone_startdate + " ~ "):''}
            {p.mileStoneInfo.milestone_duedate?p.mileStoneInfo.milestone_duedate:''}
          </p>
        </div>
        
      </Modal.Body>
      <Modal.Footer className="modalBtnWrap">
        <Button className="modalBtn" onClick={()=>{
          
          if(p.mileStoneInfo.milestone_title != ''){
            p.dispatch({type:'loadingOn'})
            axios.post(host+'/ajax/createMileStone', p.mileStoneInfo)
            .then(r=>{
              p.onHide();

              //목록새로고침
              axios.get(host+'/ajax/'+p.prjSeq+'/milestonelist')
              .then(r=>{
                p.listCng(r.data);
                p.dispatch({type:'loadingOff'})
              })
              .catch(e=>{
                console.log(e)
                p.dispatch({type:'loadingOff'})
              })
            })
            .catch(e=>{
              console.log(e)
              p.onHide();
              p.dispatch({type:'loadingOff'})
            })
          } else {
            p.alertCng(true)
          }
          // console.log('aa')
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
    mileStoneList : state.mileStoneList
  }
}

export default connect(transReducer)(MileStone);