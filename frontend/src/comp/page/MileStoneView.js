import axios from "axios";
import React, { useEffect, useState,useCallback } from "react"
import {pub, colors, pages, seqColorTrans, host} from '../Helper.js'
import DatePicker from '../DatePicker.js'
import StoneList from "./comp/StoneList.js";

import {FloatingLabel, Form, Button, Dropdown, Alert, Modal} from 'react-bootstrap'
import { Link, useParams, withRouter, useHistory } from "react-router-dom";
import {connect} from 'react-redux';
import NonePage from "../NonePage.js";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';





function MileStoneView(p){
  const params = useParams();
  const history = useHistory();
  const mileStoneSeq = params.pageSeq;

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

  //마일스톤 정보
  const [mileStoneInfo, mileStoneInfoCng] = useState();

  //마일스톤의 업무 리스트
  const [taskList, taskListCng] = useState();


  //업무 필터 상태
  const [taskFilter, taskFilterCng]=useState();


  //업무 필터 적용
  const taskFilterFunc = filter =>{
    p.dispatch({type:'loadingOn'})
    taskFilterCng(filter)

    if(filter == '전체'){
      axios.get(host+'/ajax/milestone/'+mileStoneSeq+'/tasks')
      .then(r=>{
        let list = r.data.filter((rr,i)=>rr.task.task_isdelete == '0');
        taskListCng(list)
        p.dispatch({type:'loadingOff'})
      })
      .catch(e=>{
        p.dispatch({type:'loadingOff'})
      })
    } else if(filter == '진행중'){

      axios.get(host+'/ajax/milestone/'+mileStoneSeq+'/taskOpend')
      .then(r=>{
        let list = r.data.filter((rr,i)=>rr.task.task_isdelete == '0');
        taskListCng(list)
        p.dispatch({type:'loadingOff'})
      })
      .catch(e=>{
        p.dispatch({type:'loadingOff'})
      })
    } else if(filter == '종료'){
      axios.get(host+'/ajax/milestone/'+mileStoneSeq+'/taskClosed')
      .then(r=>{
        let list = r.data.filter((rr,i)=>rr.task.task_isdelete == '0');
        taskListCng(list)
        p.dispatch({type:'loadingOff'})
      })
      .catch(e=>{
        p.dispatch({type:'loadingOff'})
      })
    }


  }

  let dateModalClose =useCallback((e)=>{
    if(!e.target.closest('.DayPicker_1') ){

      p.dispatch({type:'modalOff'})
      setTimeout(()=>{
        window.removeEventListener('click', dateModalClose)
      })
    }
  },[])

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


  const mileStoneUpdate = (info) =>{
    p.dispatch({type:'loadingOn'})

    axios.post(host+'/ajax/updateMileStone', info)
    .then(r=>{
      axios.get(host+'/ajax/milestone/'+mileStoneSeq)
      .then(r=>{
        mileStoneInfoCng(r.data)

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
  }

  const mileStoneDateNull = () =>{
    p.dispatch({type:'loadingOn'})

    axios.get(host+'/ajax/setDateEmpty/'+mileStoneSeq)
    .then(r=>{
      axios.get(host+'/ajax/milestone/'+mileStoneSeq)
      .then(r=>{
        mileStoneInfoCng(r.data)
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
  }

  useEffect(()=>{

    //마일스톤 정보
    p.dispatch({type:'loadingOn'})
    axios.get(host+'/ajax/milestone/'+mileStoneSeq)
    .then(r=>{
      mileStoneInfoCng(r.data)
      p.dispatch({type:'loadingOff'})

    })
    .catch(e=>{
      console.log(e)
      history.push('/404')
      p.dispatch({type:'loadingOff'})
    })

    // 마일스톤 하위 업무 리스트
    axios.get(host+'/ajax/milestone/'+mileStoneSeq+'/tasks')
    .then(r=>{
      let list = r.data.filter((rr,i)=>rr.task.task_isdelete == '0');
      
      taskListCng(list)
      p.dispatch({type:'loadingOff'})
    })
    .catch(e=>{
      console.log(e)
      p.dispatch({type:'loadingOff'})
    })
    taskFilterCng('전체')
  },[])

  useEffect(()=>{
    // 마일스톤 하위 업무 리스트
    axios.get(host+'/ajax/milestone/'+mileStoneSeq+'/tasks')
    .then(r=>{
      let list = r.data.filter((rr,i)=>rr.task.task_isdelete == '0');
      taskListCng(list)
      p.dispatch({type:'loadingOff'})
    })
    .catch(e=>{
      console.log(e)
      p.dispatch({type:'loadingOff'})
    })
    taskFilterCng('전체')

  },[p.refresh])

  return(
    <div className="pageContentWrap mileStoneWrap">


      <div className="stoneListWrap">
        {
          mileStoneInfo &&
          <>
            <StoneList
              prjSeq={p.prjSeq}
              milestone_seq={1}
              milestone_title={mileStoneInfo.milestone_title}
              milestone_content={mileStoneInfo.milestone_content}
              color={seqColorTrans(mileStoneInfo.milestone_seq)}

              completeTaskCnt={mileStoneInfo.closedTask}
              taskCnt={mileStoneInfo.countTask}
              milestone_startdate={mileStoneInfo.milestone_startdate}
              milestone_duedate={mileStoneInfo.milestone_duedate}
              isView={true}
              dateModalClose={dateModalClose}
              mileStoneInfoCng={mileStoneInfoCng}
              mileStoneInfo={mileStoneInfo}
              mileStoneUpdate={mileStoneUpdate}
              mileStoneDateNull={mileStoneDateNull}
            />
            <div className="mileStoneTaskWrap">
              <div className="taskHeader">
                <div className="filter">
                  <p style={
                    taskFilter == '전체'?
                    {backgroundColor:p.prjColor,color:'#fff'}
                    :{color:p.prjColor}
                    } onClick={()=>{
                      taskFilterFunc('전체')

                    }}>전체</p>
                  <p style={
                    taskFilter == '진행중'?
                    {backgroundColor:p.prjColor,color:'#fff'}
                    :{color:p.prjColor}
                  } onClick={()=>{
                    taskFilterFunc('진행중')
                  }}>진행중</p>
                  <p style={
                    taskFilter == '종료'?
                    {backgroundColor:p.prjColor,color:'#fff'}
                    :{color:p.prjColor}
                  } onClick={()=>{
                    taskFilterFunc('종료')
                  }}>종료</p>
                </div>
                <div className="sort">
                  <p className="sortBtn w120">담당자</p>
                  <p className="sortBtn w80">중요도</p>
                  <p className="sortBtn w120">라벨</p>
                  <p className="sortBtn w80">작성자</p>
                </div>
              </div>
            {
              taskList
              ?
                taskList.length != 0
                ?
                  taskList.map((r,i)=>{
                    const typeArr = {
                      '10':'긴급',
                      '20':'높음',
                      '30':'보통',
                      '40':'낮음',
                      '50':'무시',
                    }
                    let writerInfo = memberInfoGetFunc(r.task.projmember_seq)

                    return(
                      r.task.task_isdelete != 1
                      ?
                        <div className="taskList">
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
                                    r.taskMembers.map(r=>{
                                      let chargeInfo = memberInfoGetFunc(r.projmember_seq)
                                      return(
                                        <div className="profileImg toolTipTopBox">
                                          <p className="toolTip">{chargeInfo.name}</p>
                                          <div>
                                            <img src={chargeInfo.data}/>
                                          </div>
                                        </div>
                                      )
                                    })
                                  :<p className="noMember">없음</p>
                                :<p className="noMember">없음</p>
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
                      </div>
                      :null
                    )
                  })
                : <p className="noTaskMsg">업무가 없습니다.</p>
              : <Box sx={{ width: '100%' }}><LinearProgress /></Box>
            }
            </div>
          </>
        }







      </div>

    </div>
  )
}


function transReducer(state){
  return {
    datePickerModal : state.datePickerModal,
    memberList:state.memberList,
    refresh:state.refresh
  }
}

export default connect(transReducer)(MileStoneView);

