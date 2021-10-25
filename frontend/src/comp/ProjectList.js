import axios from "axios";
import React, { useEffect, useState, useCallback ,useRef} from "react"
import {pub, colors,host,seqColorTrans} from './Helper.js'
import DatePicker from './DatePicker.js'
import {FloatingLabel, Form, Button, Dropdown, Alert, Modal, InputGroup} from 'react-bootstrap'
import { Link, useParams, withRouter, useHistory } from "react-router-dom";
import {CSSTransition} from 'react-transition-group';
import {connect} from 'react-redux';
import moment from "moment";
import "moment/locale/ko";






//카드의 컬러 index는 seq / 10의 나머지값으로 함
function ProjectList(p){
  const history = useHistory();

  //프로젝트 생성, 수정_모달 상태
  let [modalShow, setModalShow] = useState(false);
  //프로젝트 만들기 제목 인풋
  const titleInput = useRef();

  //프로젝트 생성, 수정_정보
  const [prjInfo, prjInfoCng] = useState({
    seq:'',
    project_title:'',
    project_content:'',
    project_startdate:'',
    project_duedate:''
  });
  const { project_title, project_content, project_startdate, project_duedate } = prjInfo;

  //프로젝트 생성, 수정시 상태 업데이트
  const prjInfoChange = e =>{
    const {value, name} = e.target;
    prjInfoCng({
      ...prjInfo,
      [name]: value
    })
  }

  //프로젝트 생성, 수정 날짜선택 이중모달 컨트롤
  let dateModalClose =useCallback((e)=>{
    if(!e.target.closest('.DayPicker_1') ){
      p.dispatch({type:'modalOff'})
      setTimeout(()=>{
        window.removeEventListener('click', dateModalClose)
      })
    }
  },[])

  //프로젝트 생성,수정_제목 알림 상태
  let [alert, alertCng] = useState(false);



  //프로젝트 목록
  let [list, listCng] = useState();

  //마감일이 지났는지 확인
  const prjStatusFn = (dueDate) => {
    let nowDate = moment();
    if(moment().isAfter(dueDate)){
      return '마감일 지남'
    } else {
      return '진행중'
    }
  }

  //수정일때 모달 조작
  const prjUpdateFn = (type, title, content, startDate, dueDate, seq) => {
    if(type == 0){
      prjInfoCng({
        project_seq:seq,
        project_title:title,
        project_content:content,
        project_startdate:startDate,
        project_duedate:dueDate
      })
      setModalShow(true)
    }
  }

  // 완료된 프로젝트 카운트
  const completePrjCnt = (list) => {
    if(!list){
      return 0;
    }else {
      let i = 0;
      list.map(row=>{
        if(row.project_isdelete==0 && row.project_status==1){
          i++;
        }
      })
      return i;
    }
  }
  //확인용 문구 팝업
  const [alertModal, alertModalCng] = useState(false)
  const alertClose =()=> alertModalCng(false);
  const alertOpen =()=> alertModalCng(true);

  //삭제확인용 seq state
  const [deleteSeq, deleteSeqCng] = useState();

  useEffect(()=>{
    
    p.dispatch({type:'loadingOn'})
    axios.get(host+'/ajax/myproject')
    .then(r=>{
      listCng(r.data);
      p.dispatch({type:'loadingOff'})

    })
    .catch(e=>{
      console.log(e)
      p.dispatch({type:'loadingOff'})
    })
    // listCng(listSample)

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
    
  },[])

  return(
    <>
      <Modal show={alertModal} onHide={alertClose} className="modalWrap">
        <Modal.Header style={{borderBottom:0}}>
          <Modal.Title className="modalTitle" >정말 프로젝트를 삭제할까요? &#x1f625;</Modal.Title>
        </Modal.Header>
        <Modal.Footer style={{borderTop:0}}>
          <Button variant="secondary" onClick={alertClose} style={{fontSize:'.8rem'}}>
            취소
          </Button>
          <Button variant="danger" onClick={()=>{
            p.dispatch({type:'loadingOn'})
            axios.post(host+'/ajax/deleteProject',{
              project_seq:deleteSeq
            })
            .then(r=>{
              console.log(r.data)
              axios.get(host+'/ajax/myproject')
              .then(r=>{
                console.log(r.data)
                listCng(r.data);
                p.dispatch({type:'loadingOff'})
              })
              .catch(e=>{
                console.log(e)
                p.dispatch({type:'loadingOff'})
              })
              alertModalCng(false)
            })
            .catch(e=>{
              console.log(e)
              p.dispatch({type:'loadingOff'})
              alertModalCng(false)
            })
          }} style={{fontSize:'.8rem'}}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="pListTop outerWrap">
        <div className="innerWrap">
          <img src={pub.img+'logo.svg'}/>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" size="sm" id="dropdown-basic">
              {p.loginUser.email != ''?p.loginUser.email:'유저 정보 없음'}
            </Dropdown.Toggle>

            <Dropdown.Menu style={{'minWidth':'unset','width':'100%'}}>
              
              <Dropdown.Item onClick={()=>{
                setModalShow(true)
                setTimeout(()=>{
                  titleInput.current.focus();
                })
              }}style={{'fontSize':'.8rem'}}>프로젝트 만들기</Dropdown.Item>
              <Dropdown.Item href="sign/login" style={{'fontSize':'.8rem'}} onClick={()=>{
                window.location.href = host+'/logout'
              }}>로그아웃</Dropdown.Item>
            
            </Dropdown.Menu>
          </Dropdown>
        </div>
        
      </div>

      <div className="outerWrap">
        <div className="innerWrap pListWrap">
          <h4 className="active">진행중인 프로젝트 &#x1F680;</h4>
          <div className="cardWrap">
            {
              list &&
              list.map((row, i)=>{
                if(row.project_status==0 && row.project_isdelete == 0){
                  return(
                    <ProjectCard 
                      color={seqColorTrans(row.project_seq)}
                      seq={row.project_seq}
                      managerSeq={row.member_seq}
                      title={row.project_title}
                      content={row.project_content}
                      startDate={row.project_startdate}
                      dueDate={row.project_duedate}
                      status={prjStatusFn(row.project_duedate)}
                      type={row.projmember_type}
                      loginUser={p.loginUser}
                      prjUpdateFn={prjUpdateFn}
                      dispatch={p.dispatch}
                      deleteSeqCng={deleteSeqCng}
                      listCng={listCng}
                      pjStatus={0}
                      key={i}
                    />
                  )
                }
              })
            }
            <AddProject show={()=>{
              setModalShow(true)
              setTimeout(()=>{
                titleInput.current.focus();
              })
            }}/>
          </div>
          <h4 className="inActive">완료된 프로젝트 &#x1F648;</h4>
          <div className="cardWrap">
            {
              completePrjCnt(list) != 0
              ?
              list.map((row, i)=>{
                if(row.project_status==1 && row.project_isdelete == 0){
                  return(
                    <ProjectCard 
                      color={seqColorTrans(row.project_seq)}
                      seq={row.project_seq}
                      managerSeq={row.member_seq}
                      title={row.project_title}
                      content={row.project_content}
                      startDate={row.project_startdate}
                      dueDate={row.project_duedate}
                      status={prjStatusFn(row.project_duedate)}
                      type={row.projmember_type}
                      loginUser={p.loginUser}
                      pjStatus={1}
                      prjUpdateFn={prjUpdateFn}
                      dispatch={p.dispatch}
                      alertOpen={alertOpen}
                      alertModalCng={alertModalCng}
                      listCng={listCng}
                      deleteSeqCng={deleteSeqCng}
                      key={i}
                    />
                  )
                }
              })
              :<NoProject title="완료된 프로젝트"/>
            }
            
                
            
          </div>
        </div>
      </div>
      

      <ProjectCreateModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          p.dispatch({type:'modalOff'})
          window.removeEventListener('click', dateModalClose)
          prjInfoCng({
            project_seq:'',
            project_title:'',
            project_content:'',
            project_startdate:'',
            project_duedate:''
          });
          alertCng(false)
        }}
        project_title={project_title}
        project_content={project_content}
        project_startdate={project_startdate}
        project_duedate={project_duedate}
        dateModalClose={dateModalClose}
        datePickerModalControll={p.dispatch}
        prjInfoCng={prjInfoCng}
        prjInfo={prjInfo}
        prjInfoChange={prjInfoChange}
        dispatch={p.dispatch}
        alert={alert}
        alertCng={alertCng}
        listCng={listCng}
        titleInput={titleInput}
      />
      
    </>
  )
}

function ProjectCard(p){  
  const history = useHistory();
  return(
    <div className="projectCard">
      {
        p.type==0
        ?
          p.pjStatus==0
          ?
          <>
            <div className="editBtn editBtn2 toolTipBox" onClick={()=>{
              p.dispatch({type:'loadingOn'})
              axios.post('/ajax/closeProject',{
                project_seq:p.seq
              })
              .then(r=>{
                //목록 새로고침
                axios.get(host+'/ajax/myproject')
                .then(r=>{
                  console.log(r.data)
                  p.listCng(r.data);
                  p.dispatch({type:'loadingOff'})
                })
                .catch(e=>{
                  console.log(e)
                  p.dispatch({type:'loadingOff'})
                })                
                console.log(r.data)
              })
              .catch(e=>{
                console.log(e)
                p.dispatch({type:'loadingOff'})
              })
            }}>
              <i class="fas fa-check"></i>
              <div className="toolTip" style={{'marginLeft':'-64px',lineHeight:'12px'}}>완료된 프로젝트로 이동</div>
            </div>
            <div className="editBtn editBtn3 toolTipBox" onClick={()=>{
              p.prjUpdateFn(p.type, p.title, p.content, p.startDate, p.dueDate, p.seq)
            }}>
              
              <i class="fas fa-pen"></i>
              <div className="toolTip" style={{'marginLeft':'-41px',lineHeight:'12px'}}>프로젝트 수정</div>
            </div>
          </>
          :
          <>
            <div className="editBtn editBtn2 toolTipBox" onClick={()=>{
              p.deleteSeqCng(p.seq)
              p.alertModalCng(true)
            }}>
              <i class="far fa-trash-alt"></i>
              <div className="toolTip" style={{'marginLeft':'-41px',lineHeight:'12px'}}>프로젝트 삭제</div>
            </div>
            <div className="editBtn editBtn3 toolTipBox" onClick={()=>{
              p.dispatch({type:'loadingOn'})
              axios.post('/ajax/openProject',{
                project_seq:p.seq
              })
              .then(r=>{
                console.log(r.data)
                //목록 새로고침
                axios.get(host+'/ajax/myproject')
                .then(r=>{
                  console.log(r.data)
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
                p.dispatch({type:'loadingOff'})
              })
            }}>
              <i class="fas fa-undo-alt"></i>
              <div className="toolTip" style={{'marginLeft':'-64px',lineHeight:'12px'}}>진행중인 프로젝트로 복원</div>
            </div>
          </>
        :null
      }
      
      <div className="typeWrap">
        {
          p.type==0
          ?<p className="admin">관리자</p>
          : null
        }
        {
          p.pjStatus == 0 
          ?
            p.status == '진행중'
            ?<p className="go">진행중</p>
            :<p className="end">마감일 지남</p>
          : null
            
        }
      </div>
      <p className="title" onClick={()=>{
        history.push('/project/'+p.seq+'/todo')
      }}>{p.title}</p>
      <p className="sub">{p.content?p.content:'프로젝트 설명이 없습니다.'}</p>
      {
        p.startDate
        ?<div className="date"><i class="far fa-clock"></i> {p.startDate} ~ {p.dueDate}</div>
        :null
      }
      <div className={'icon '} style={{backgroundColor:p.color}}>{p.title.trim().substring(0,1)}</div>
    </div>
  )
}
function NoProject(p){
  return(
    <div className="noProjectMsg">
      <p>&#x1F605;</p>
      {p.title}가 없습니다.
    </div>
  )
}
function AddProject(p){
  
  return(
    <div className="addProjectBtn">
      <i class="fas fa-plus toolTipBox" onClick={p.show}>
        <div className="toolTip" style={{'marginLeft':'-47.33px'}}>새 프로젝트 만들기</div>
      </i>
    </div>
  )
}



function ProjectCreateModal(p) {

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
          {
            p.prjInfo.project_seq
            ?'프로젝트 수정'
            :'새 프로젝트 만들기'
          }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          p.alert
          ?
          <Alert variant={'danger'} style={{fontSize:'.8rem',marginBottom:'.4rem'}}>프로젝트 제목을 입력해주세요. &#x1F602;</Alert>
          : null
        }
        
        <Form.Group className="mb-2 piumInput" controlId="floatingInput">
          <FloatingLabel
            controlId="floatingInput"
            label="프로젝트 제목"
          >
            <Form.Control type="text" placeholder="프로젝트 제목" name="project_title" value={p.project_title} spellCheck="false" onChange={p.prjInfoChange} ref={p.titleInput}/>
          </FloatingLabel>
        </Form.Group>
        

        <Form.Group className=" piumInput" controlId="floatingTextarea">
          <FloatingLabel controlId="floatingTextarea" label="설명">
            <Form.Control type="textarea" placeholder="설명" name="project_content" value={p.project_content} spellCheck="false" onChange={p.prjInfoChange}/>
          </FloatingLabel>
        </Form.Group>

        <div className="datePickerWrap">
          <DatePicker
            pickerStartDate={p.project_startdate}
            pickerEndDate={p.project_duedate}
            pickerDateCng={p.prjInfoCng}
            pickerDate={p.prjInfo}
            pickerStartKey={'project_startdate'}
            pickerEndKey={'project_duedate'}
            dateModalClose={p.dateModalClose}
          />
          <p className="dateBtn" onClick={
            ()=>{
              p.datePickerModalControll({type:'modalOn'})
              setTimeout(()=>{
                window.addEventListener('click', p.dateModalClose)
              })
            }
          }>
            <i class="far fa-calendar-check"></i> 일정선택
          </p>
          <p className="dateInfo">
            {p.project_startdate?(p.project_startdate + " ~ "):''}
            
            {p.project_duedate?p.project_duedate:''}

          </p>
        </div>
        
      </Modal.Body>
      <Modal.Footer className="modalBtnWrap">
        <Button className="modalBtn" onClick={()=>{
          p.dispatch({type:'loadingOn'})
          if(p.prjInfo.project_title != ''){
            if(p.prjInfo.project_seq) {
              axios.post(host+'/ajax/updateProject',p.prjInfo)
              .then(r=>{
                console.log(r.data)
                p.onHide();
                //목록 새로고침
                axios.get(host+'/ajax/myproject')
                .then(r=>{
                  console.log(r.data)
                  p.listCng(r.data);
                  p.dispatch({type:'loadingOff'})
                })
                .catch(e=>{
                  console.log(e)
                  p.dispatch({type:'loadingOff'})
                })
              })
              .catch(e=>{
                p.dispatch({type:'loadingOff'})
                console.log(e)
              })
            }else {
              axios.post(host+'/ajax/createProject',p.prjInfo)
              .then(r=>{
                console.log(r.data)
                //생성하고 한번더 리스트 새로고침함
                axios.get(host+'/ajax/myproject')
                .then(r=>{
                  console.log(r.data)
                  p.listCng(r.data);
                  p.onHide()
                  p.dispatch({type:'loadingOff'})

                })
                .catch(e=>{
                  console.log(e)
                  p.dispatch({type:'loadingOff'})

                })
              })
              .catch(e=>{
                p.dispatch({type:'loadingOff'})

                console.log(e)
              })
            }
            

          }else {
            p.alertCng(true)
            p.dispatch({type:'loadingOff'})

          }
          
        }}>{p.prjInfo.project_seq?'수정하기':'만들기'}</Button>

        

      </Modal.Footer>
    </Modal>
  );
}



function transReducer(state){
  return {
    datePickerModal : state.datePickerModal,
    loginUser : state.loginUser,
    loading:state.loading
  }
}

export default connect(transReducer)(ProjectList);
