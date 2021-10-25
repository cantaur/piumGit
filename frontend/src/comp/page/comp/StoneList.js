import axios from "axios";
import React, { useEffect, useRef, useState } from "react"
import DatePicker from '../../DatePicker.js'

import {pub, host, colors, pages, seqColorTrans} from '../../Helper.js'
import {FloatingLabel, Form, Button, Dropdown, Alert, Modal, InputGroup} from 'react-bootstrap'
import { Link, useParams, withRouter, useHistory } from "react-router-dom";
import {connect} from 'react-redux';



function StoneList(p){
  const history = useHistory();

  const titModify = useRef();
  const subModifyRef = useRef();

  
  //제목 수정 상태
  const [titleModify, titleModifyCng] = useState(false);

  //설명 수정 상태
  const [subModify, subModifyCng] = useState(false);

  // 제목 설명 더미
  const [infoDummy, infoDummyCng] =useState();


  const [alertModal, alertModalCng] = useState(false)
  const alertClose =()=> alertModalCng(false);
  const alertOpen =()=> alertModalCng(true);

  useEffect(()=>{
    infoDummyCng(p.mileStoneInfo)
  },[])
  return(
    <>
    {  
      p.isView && p.isMaster
      ?
        p.mileStoneInfo.milestone_status == 1
        ?
        <div className="stoneListbtnWrap">
          <i class="far fa-play-circle toolTipTopBox" onClick={()=>{
            p.dispatch({type:'loadingOn'})
            axios.post(host+'/ajax/openMileStone',{
              milestone_seq:p.mileStoneInfo.milestone_seq
            })
            .then(e=>{
              axios.get(host+'/ajax/milestone/'+p.mileStoneInfo.milestone_seq)
              .then(r=>{
                
                p.mileStoneInfoCng(r.data)
                
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
          }}> 활성화 하기
          </i>
          <i class="far fa-trash-alt toolTipTopBox delete" onClick={alertOpen}> 삭제
          </i>
        </div>
        :
        <div className="stoneListbtnWrap">
          <i class="far fa-stop-circle toolTipTopBox" onClick={()=>{
            p.dispatch({type:'loadingOn'})
            axios.post(host+'/ajax/closeMileStone',{
              milestone_seq:p.mileStoneInfo.milestone_seq
            })
            .then(e=>{
              axios.get(host+'/ajax/milestone/'+p.mileStoneInfo.milestone_seq)
              .then(r=>{
                // console.log(r.data)
                
                p.mileStoneInfoCng(r.data)
                
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
          }}> 완료 처리
          </i>
        </div>
      
      :null
      
    }
    <Modal show={alertModal} onHide={alertClose} className="modalWrap">
      <Modal.Header style={{borderBottom:0}}>
        <Modal.Title className="modalTitle" >정말 마일스톤을 삭제할까요? &#x1f625;</Modal.Title>
      </Modal.Header>
      <Modal.Footer style={{borderTop:0}}>
        <Button variant="secondary" onClick={alertClose} style={{fontSize:'.8rem'}}>
          취소
        </Button>
        <Button variant="danger" onClick={()=>{
          p.dispatch({type:'loadingOn'})
          axios.post(host+'/ajax/deleteMileStone',{
            milestone_seq:p.mileStoneInfo.milestone_seq
          })
          .then(e=>{
            history.push('/project/'+p.prjSeq+'/mileStone')
            p.dispatch({type:'pagePush', val:'mileStone'})

            p.dispatch({type:'loadingOff'})

          })
          .catch(e=>{
            console.log(e)
            p.dispatch({type:'loadingOff'})
          })
        }} style={{fontSize:'.8rem'}}>
          삭제
        </Button>
      </Modal.Footer>
    </Modal>
    {
      p.mileStoneInfo
      ?
        <div className={"stoneList " + (p.isView?'view ':'') + (p.isComplete?'completed ':'')} style={{backgroundColor:p.color+'20'}}>
        
        <p className="titleWrap">
          <p className={"title " + (p.isView?'view':'')}  onClick={()=>{
            if(!p.isView){
              history.push("/project/"+p.prjSeq+"/mileStoneView/"+p.milestone_seq)
              p.dispatch({type:'pagePush', val:'mileStoneView'})
            }
          }}>
            <p class="tit">
              {
                titleModify
                ? 
                  <input type="text" className="titModify" ref={titModify} value={infoDummy.milestone_title} placeholder="마일스톤 제목을 입력하세요." spellcheck="false" 
                  onChange={(e)=>{
                    infoDummyCng({
                      ...infoDummy,
                      milestone_title:e.target.value
                    })
                  }}
                  onKeyPress={e=>{
                    if(e.key === "Enter"){
                      if(infoDummy.milestone_title){
                        p.mileStoneUpdate(infoDummy)
                        titleModifyCng(false)
                      }
                    }
                  }
                  }/>
                :p.milestone_title
              }
            </p>
            {
              p.isView && p.isMaster
              ?
                titleModify
                ?
                <>
                  <i class="fas fa-check updateBtn" onClick={()=>{
                    if(infoDummy.milestone_title){
                      p.mileStoneUpdate(infoDummy)
                      titleModifyCng(false)
                    }
                  }}></i>
                  <i class="fas fa-times updateBtn" onClick={()=>{
                    infoDummyCng({
                      milestone_title:p.mileStoneInfo.milestone_title
                    })
                    titleModifyCng(false)
                  }}></i>
                </>
                :
                <i class="fas fa-pen updateBtn" onClick={()=>{
                  titleModifyCng(true)
                  setTimeout(()=>{
                    titModify.current.focus();
                  })
                }}></i>
              :null
              
            }
          </p>
          <p className="subWrap">
            <p className="sub">
              {
                subModify
                ? <input type="text" className="subModify" ref={subModifyRef} value={infoDummy.milestone_content} placeholder="마일스톤 설명을 입력하세요." spellcheck="false" 
                onChange={(e)=>{
                  infoDummyCng({
                    ...infoDummy,
                    milestone_content:e.target.value
                  })
                }}
                onKeyPress={e=>{
                  if(e.key === "Enter"){
                    p.mileStoneUpdate(infoDummy)
                    subModifyCng(false)
                  }
                }}/>
                :
                  p.milestone_content
                  ?
                  p.milestone_content
                  : '마일스톤 설명이 없습니다.'
              }
            </p>
            {
              p.isView && p.isMaster
              ?
                subModify
                ?
                <>
                  <i class="fas fa-check updateBtn" onClick={()=>{
                    subModifyCng(false)
                    p.mileStoneUpdate(infoDummy)
                  }}></i>
                  <i class="fas fa-times updateBtn" onClick={()=>{
                    infoDummyCng({
                      milestone_content:p.mileStoneInfo.milestone_content
                    })
                    subModifyCng(false)
                  }}></i>
                </>
                :
                <i class="fas fa-pen updateBtn" onClick={()=>{
                  subModifyCng(true)
                  setTimeout(()=>{
                    subModifyRef.current.focus();

                  })
                }}></i>
              : null
            }
          </p>
        </p>
        
        <div className="infoWrap">
          {
            p.isView && p.isMaster
            ?
              p.milestone_startdate
              ? <div className="date on" onClick={()=>{
                  p.dispatch({type:'modalOn'})
                  setTimeout(()=>{
                    window.addEventListener('click', p.dateModalClose)
                  })
                }}>
                  <i class="far fa-clock"></i>
                  {p.mileStoneInfo.milestone_startdate} ~ {p.mileStoneInfo.milestone_duedate}
                  <div className="datePickerWrap">
                    {
                      p.taskModal == false &&
                      <DatePicker
                        pickerDateCng={p.mileStoneInfoCng}
                        pickerDate={p.mileStoneInfo}
                        pickerStartKey={'milestone_startdate'}
                        pickerEndKey={'milestone_duedate'}
                        completeKey={true}
                        dateModalClose={p.dateModalClose}
                        dateUpdate={p.mileStoneUpdate}
                        dateEmpty={p.mileStoneDateNull}
                      />
                    }
                    
                  </div>
                </div>
              : <div className="date on" onClick={()=>{
                  p.dispatch({type:'modalOn'})
                  setTimeout(()=>{
                    window.addEventListener('click', p.dateModalClose)
                  })
                }}>
                  <i class="far fa-clock"></i>
                  마일스톤 일정 추가하기
                  <div className="datePickerWrap">
                    {
                      p.taskModal == false &&
                      <DatePicker
                        pickerDateCng={p.mileStoneInfoCng}
                        pickerDate={p.mileStoneInfo}
                        pickerStartKey={'milestone_startdate'}
                        pickerEndKey={'milestone_duedate'}
                        completeKey={true}
                        dateModalClose={p.dateModalClose}
                        dateUpdate={p.mileStoneUpdate}
                        dateEmpty={p.mileStoneDateNull}
                      />
                    }
                  </div>
                </div>
            :
              p.milestone_startdate  
              ?
              <div className="date">
                <i class="far fa-clock"></i>
                {p.milestone_startdate} ~ {p.milestone_duedate}
              </div>
              : null
          }
          
          <div className="progressBar toolTipTopBox">
            <div className="toolTip" style={{marginLeft:'0px', left:'0%'}}>
              전체 업무 : {p.taskCnt}, 완료된 업무 : {p.completeTaskCnt}, 완료율 : {
                p.completeTaskCnt != 0 
                ?Math.round((p.completeTaskCnt/p.taskCnt)*100)
                :0
              }%
            </div>
            <div className="bar" style={{backgroundColor:p.color,width:
                p.completeTaskCnt != 0 
                ?Math.round((p.completeTaskCnt/p.taskCnt)*100)+'%'
                :0+'%'}}></div>
          </div>
        </div>      
      </div>
      : null
    }

    </>
    
    
  )
}


function transReducer(state){
  return {
    datePickerModal : state.datePickerModal,
    isMaster:state.isMaster,
    taskModal : state.taskModal
  }
}

export default connect(transReducer)(StoneList);