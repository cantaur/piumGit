import axios from "axios";
import React, { useEffect, useState, useRef } from "react"
import {pub, colors, pages, host} from '../Helper.js'
import DatePicker from '../DatePicker.js'
import { Link, useParams, withRouter, useHistory } from "react-router-dom";
import {connect} from 'react-redux';
import {Badge, Button, FloatingLabel, Form, Modal, Nav} from 'react-bootstrap';
import {Menu, MenuItem} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';



function Todo(p){
  const history = useHistory();
  
  /*상태별 정렬*/
  const [list, listCng] =useState();
  const [todos, setTodos] = useState();
  const [progresses, setProgresses] = useState();
  const [dones, setDones] = useState();
  
  /*상태별 카운트*/
  const [cntTodo,setCntTodo] = useState();
  const [cntProg,setCntProg] = useState();
  const [cntDone,setCntDone] = useState();

  //상태별 작성폼 input
  const todoTitleInput = useRef(); 
  const progTitleInput = useRef(); 
  const doneTitleInput = useRef(); 

  //상태별 작성폼 show
  const [formShow, formShowCng] = useState({
    'todo':false,
    'prog':false,
    'done':false,
  });

  //업무 목록
  const [taskList, taskListCng] = useState();

  //할일 입력
  const [formData, formDataCng] = useState({
    title:'',
    content:'',
    task_title:'',
    task_seq:'',
  });

  //할일입력 핸들러
  const formDataCngFunc = e =>{
    formDataCng({
      ...formData,
      [e.target.name] : e.target.value
    })
  }

  //할일 등록
  const myTodoInsert = status => {
    if(formData.title == ''){
      const inputList = document.querySelectorAll('.createTitle')
      inputList.forEach(r=>{
        r.classList.add('on')
      })
      setTimeout(() => {
        inputList.forEach(r=>{
          r.classList.remove('on')
        })
      }, 2000);
    }else {
    
      const taskSeq = formData.task_seq==''?null:formData.task_seq;
      p.dispatch({type:'loadingOn'})
      axios.post(host+'/ajax/createTodo',{
        'todo_name':formData.title,
        'todo_content':formData.content,
        'todo_status':status,
        'task_seq':taskSeq,
        'task_title':formData.task_title,
        'projmember_seq':p.myMemberInfo.projmember_seq
      })
      .then(r=>{
        formDataCng({
          title:'',
          content:'',
          task_seq:'',
          task_title:'',
        })
        formShowCng({
          'todo':false,
          'prog':false,
          'done':false,
        })
        listCng(false)
        myTodoGet()
      })
      .catch(e=>{
        console.log(e)
        p.dispatch({type:'loadingOff'})
      })
    }
    
  }

  //할일 삭제 
  const myTodoDelete = (seq) =>{
    p.dispatch({type:'loadingOn'})
    axios.post(host+'/ajax/deleteTodo',{
      todo_seq:seq
    })
    .then(r=>{
      listCng(false)
      myTodoGet()
    })
    .catch(e=>{
      console.log(e)
      p.dispatch({type:'loadingOff'})
    })
  }

  //업데이트 데이터 
  const [todoUpdateInfo, todoUpdateInfoCng]=useState({
    todo_name:'',
    todo_content:'',
    todo_seq:'',
    todo_status:'',
    task_seq:'',
    task_title:'',
    projmember_seq:''
  });

  //업데이트
  const myTodoUpdate = () =>{
    if(todoUpdateInfo.title == ''){
      const inputList = document.querySelectorAll('.editTitle')
      inputList.forEach(r=>{
        r.classList.add('on')
      })
      setTimeout(() => {
        inputList.forEach(r=>{
          r.classList.remove('on')
        })
      }, 2000);
    }else {
      p.dispatch({type:'loadingOn'})
      axios.post(host+'/ajax/updateTodo', todoUpdateInfo)
      .then(r=>{
        todoUpdateInfoCng({
          todo_name:'',
          todo_content:'',
          todo_seq:'',
          todo_status:'',
          task_seq:'',
          task_title:'',
          projmember_seq:''
        })
        let wrap = document.querySelectorAll('.list-item')
        wrap.forEach(r=>{
          r.classList.remove('edit')
        })
        myTodoGet()
      })
      .catch(e=>{
        console.log(e)
        p.dispatch({type:'loadingOff'})
      })
    }
  }
  
  //전체리스트 불러오기
  const myTodoGet = () =>{
    
    axios.get(host+'/ajax/mytodo/'+p.myMemberInfo.projmember_seq)
    .then(r=>{
      setTodos(r.data[0].todoList)
      setProgresses(r.data[0].progressList)
      setDones(r.data[0].doneList)
      r.data[0].todoList?setCntTodo(r.data[0].todoList.length):setCntTodo(0);
      r.data[0].progressList?setCntProg(r.data[0].progressList.length):setCntProg(0);
      r.data[0].doneList?setCntDone(r.data[0].doneList.length):setCntDone(0);
      listCng(true);

      p.dispatch({type:'loadingOff'})
    })
    .catch(e=>{
      console.log(e)
      p.dispatch({type:'loadingOff'})
    })
  }

  //등록 입력폼 비움
  const insertFormEmpty = () =>{
    let node = document.querySelectorAll('.addListWrap')
    node.forEach(r=>{
      r.childNodes[0].options[0].selected = true;
      r.childNodes[1].value = ''
      r.childNodes[2].value = ''    
    })
  }



  useEffect(()=>{
    //이 프로젝트의 업무 리스트 받아옴
    if(p.projectInfo){
      axios.get(host+'/ajax/showTaskinTodo/'+p.projectInfo.project_seq)
      .then(r=>{
        taskListCng(r.data)
      })
      .catch(e=>{
        console.log(e)
      })
    }
  },[p.projectInfo])


  useEffect(()=>{
    if(p.myMemberInfo){
      myTodoGet()
    }
  },[p.myMemberInfo])

  useEffect(()=>{
    const list_items = document.querySelectorAll('.list-item');
    const lists = document.querySelectorAll('.list');

    let draggedItem = null;
    let itemSeq = null
    let itemStatus = null
    let boxStatus = null

    for(let i = 0; i<list_items.length; i++){
        const item= list_items[i];
        

        item.addEventListener('dragstart', function(){
            draggedItem = item;
            itemSeq = item.getAttribute('data-seq')
            itemStatus = item.getAttribute('data-status')

            setTimeout(function(){
                item.style.display ='none';
            }, 0)
        });
        //진입하고 업데이트
        item.addEventListener('dragend', function(e){
            if(itemStatus!=boxStatus){
              p.dispatch({type:'loadingOn'})
              axios.post(host+'/ajax/changeTodoStatus',{
                todo_seq:itemSeq,
                todo_status:boxStatus,
              })
              .then(r=>{
                listCng(false)
                myTodoGet();
                // p.dispatch({type:'loadingOff'})
                // window.location.href = '/project/'+p.projectInfo.project_seq+'/todo'
              })
              .catch(e=>{
                console.log(e)
                p.dispatch({type:'loadingOff'})
              })
            }

            setTimeout(function(){
                draggedItem.style.display = 'block';
                draggedItem = null;
            },0)
        });
        for(let j = 0; j<lists.length; j++){
            const list = lists[j];

            list.addEventListener('dragover', function(e){
                e.preventDefault();
            });
            list.addEventListener('dragenter', function(e){
                e.preventDefault();
                this.style.backgroundColor = '#888888';
            });
            list.addEventListener('dragleave', function(e){
                this.style.backgroundColor = '#ececec';
            });

            list.addEventListener('drop', function(e){
                // this.append(draggedItem);
                this.style.backgroundColor = '#ececec';
                boxStatus = this.getAttribute('data-status')


            })
        }
    }
  },[list])

  return(

    <div className="todoWrap pageContentWrap">
      <div className="pageBtnWrap">
        <p className="pageBtn on" style={{color:p.prjColor,borderColor:p.prjColor}} onClick={()=>{
          p.dispatch({type:'pagePush', val:'todo'})
          history.push('/project/'+p.prjSeq+'/todo')
        }}>To do List</p>
        <p className="pageBtn" onClick={()=>{
          p.dispatch({type:'pagePush', val:'notice'})

          history.push('/project/'+p.prjSeq+'/notice')
        }}>알림</p>
      </div>


      <div className="app">
        <div className="lists">
          {
            list?
            <>
              {/* todo */}
              <div className="listWrap">
                
                <div className="list-label">
                  <p className="title">
                    <b className="cnt" style={{backgroundColor:'#D72B3C'}}>{cntTodo}</b>
                    To do
                  </p>
                  <i class="fas fa-plus toolTipTopBox" onClick={()=>{
                    insertFormEmpty();
                    todoTitleInput.current.focus();
                    formShowCng({
                      todo:true,
                      prog:false,
                      done:false,
                    })
                    formDataCng({
                      title:'',
                      content:'',
                      task_seq:'',
                      task_title:'',
                    })
                  }}>
                    <div className="toolTip" style={{marginLeft:'-41.58px'}}>새 To do 만들기</div>
                  </i>
                  
                </div>

                <div className={"addListWrap "+(formShow.todo?'on':'')}>
                  {
                    taskList&&
                      <Form.Select size="sm" name="task" onChange={(e)=>{
                        formDataCng({
                          ...formData,
                          task_seq:e.target.value,
                          task_title:e.target[e.target.selectedIndex].getAttribute('data-title'),
                        })
                      }}>
                        <option value="" data-title="">업무를 선택하세요.</option>
                        {
                          taskList.map(r=>{
                            return(
                              <option value={r.task_seq} data-title={r.task_title}>{r.task_title}</option>
                            )
                          })
                        }
                      </Form.Select>
                  }
                  
                  <input type="text" placeholder="제목" className="createTitle" ref={todoTitleInput} name="title" onChange={formDataCngFunc}/>
                  <textarea placeholder="내용" name="content" onChange={formDataCngFunc}/>
                  <div className="btnWrap">
                    <p onClick={()=>{
                      formShowCng({
                        todo:false,
                        prog:false,
                        done:false,
                      })
                      formDataCng({
                        title:'',
                        content:'',
                        task_seq:'',
                        task_title:''
                      })

                    insertFormEmpty();
                    }}>취소</p>
                    <button style={{backgroundColor:p.prjColor, color:'#fff'}} onClick={()=>{
                      myTodoInsert('10')
                    }}>작성완료</button>
                  </div>
                </div>

                <div className="list" data-status="10">
                  <List
                    myTodoUpdate={myTodoUpdate} 
                    taskList={taskList}
                    myMemberInfo={p.myMemberInfo} 
                    todoUpdateInfoCng={todoUpdateInfoCng} 
                    todoUpdateInfo={todoUpdateInfo} 
                    myTodoDelete={myTodoDelete} 
                    list={todos} 
                    prjColor={p.prjColor}
                  />
                </div>

              </div>



              
              {/* in progress */}
              <div className="listWrap">
                <div className="list-label">
                  <p className="title">
                    <b className="cnt" style={{backgroundColor:'#187D4D'}}>{cntProg}</b>
                    In Progress
                  </p>

                  <i class="fas fa-plus toolTipTopBox" onClick={()=>{
                    progTitleInput.current.focus();
                    insertFormEmpty();
                    formShowCng({
                      todo:false,
                      prog:true,
                      done:false,
                    })
                    formDataCng({
                      title:'',
                      content:'',
                      task_seq:'',
                      task_title:''
                    })
                  }}>
                    <div className="toolTip" style={{marginLeft:'-49.775px'}}>새 Progress 만들기</div>
                  </i>
                </div>
                <div className={"addListWrap "+(formShow.prog?'on':'')}>
                  {
                    taskList&&
                      <Form.Select size="sm" name="task" onChange={e=>{
                        formDataCng({
                          ...formData,
                          task_seq:e.target.value,
                          task_title:e.target[e.target.selectedIndex].getAttribute('data-title')
                        })
                      }}>
                        <option value="" data-title=''>업무를 선택하세요.</option>
                        {
                          taskList.map(r=>{
                            return(
                              <option value={r.task_seq} data-title={r.task_title}>{r.task_title}</option>
                            )
                          })
                        }
                      </Form.Select>
                  }
                  <input type="text" placeholder="제목" className="createTitle" ref={progTitleInput} name="title" onChange={formDataCngFunc}/>
                  <textarea placeholder="내용" name="content" onChange={formDataCngFunc}/>
                  <div className="btnWrap">
                    <p onClick={()=>{
                      formShowCng({
                        todo:false,
                        prog:false,
                        done:false,
                      })
                      formDataCng({
                        title:'',
                        content:'',
                        task_seq:'',
                        task_title:''
                      })

                    insertFormEmpty();
                    }}>취소</p>
                    <button style={{backgroundColor:p.prjColor, color:'#fff'}} onClick={()=>{
                      myTodoInsert('20')
                    }}>작성완료</button>
                  </div>
                </div>

                <div className="list" data-status="20">
                  <List
                    myTodoUpdate={myTodoUpdate} 
                    taskList={taskList}
                    myMemberInfo={p.myMemberInfo} 
                    todoUpdateInfoCng={todoUpdateInfoCng} 
                    todoUpdateInfo={todoUpdateInfo} 
                    myTodoDelete={myTodoDelete} 
                    list={progresses} 
                    prjColor={p.prjColor}
                  />
                </div>

              </div>

              {/* done */}
              <div className="listWrap">
                <div className="list-label">
                  <p className="title">
                    <b className="cnt" style={{backgroundColor:'#135CF8'}}>{cntDone}</b>
                    Done
                  </p>
                  <i class="fas fa-plus toolTipTopBox" onClick={()=>{
                      doneTitleInput.current.focus();
                      insertFormEmpty();
                      formShowCng({
                        todo:false,
                        prog:false,
                        done:true,
                      })
                      formDataCng({
                        title:'',
                        content:'',
                        task_seq:'',
                        task_title:''
                      })
                    }}>
                    <div className="toolTip" style={{marginLeft:'-40.885px'}}>새 Done 만들기</div>
                  </i>
                </div>
                <div className={"addListWrap "+(formShow.done?'on':'')}>
                  {
                    taskList&&
                      <Form.Select size="sm" name="task" onChange={e=>{
                        formDataCng({
                          ...formData,
                          task_seq:e.target.value,
                          task_title:e.target[e.target.selectedIndex].getAttribute('data-title')
                        })
                      }}>
                        <option value="" data-title=''>업무를 선택하세요.</option>
                        {
                          taskList.map(r=>{
                            return(
                              <option value={r.task_seq} data-title={r.task_title}>{r.task_title}</option>
                            )
                          })
                        }
                      </Form.Select>
                  }
                  <input type="text" placeholder="제목" className="createTitle" ref={doneTitleInput} name="title" onChange={formDataCngFunc}/>
                  <textarea placeholder="내용" name="content" onChange={formDataCngFunc}/>
                  <div className="btnWrap">
                    <p onClick={()=>{
                      formShowCng({
                        todo:false,
                        prog:false,
                        done:false,
                      })
                      formDataCng({
                        title:'',
                        content:'',
                        task_seq:'',
                        task_title:''
                      })

                      insertFormEmpty();
                    }}>취소</p>
                    <button style={{backgroundColor:p.prjColor, color:'#fff'}} onClick={()=>{
                      myTodoInsert('30')
                    }}>작성완료</button>
                  </div>
                </div>

                <div className="list" data-status="30">
                  <List
                    myTodoUpdate={myTodoUpdate} 
                    taskList={taskList}
                    myMemberInfo={p.myMemberInfo} 
                    todoUpdateInfoCng={todoUpdateInfoCng} 
                    todoUpdateInfo={todoUpdateInfo} 
                    myTodoDelete={myTodoDelete} 
                    list={dones} 
                    prjColor={p.prjColor}
                  />
                </div>

              </div>
            </>
            :<Box sx={{ width: '100%' }}><LinearProgress /></Box>
          }
 
        </div>
      </div>

    </div>
  )
}

function List(p) {
  return (
      <div className="listConWrap">
        {
          p.list
          ?
            p.list.map(r=>{
              return(
                <div className="list-item" 
                    draggable="true" 
                    id={'todo'+r.todo_seq}
                    data-seq={r.todo_seq}
                    data-status={r.todo_status}
                >

                  <div className="editBtnWrap">
                    <i class="fas fa-trash-alt" onClick={()=>{
                      p.myTodoDelete(r.todo_seq)
                    }}/>
                    <i class="fas fa-pen" onClick={()=>{
                      let wrap = document.querySelectorAll('.list-item')
                      wrap.forEach(r=>{
                        r.classList.remove('edit')
                      })
                      let thisWrap = document.getElementById('todo'+r.todo_seq)
                      thisWrap.classList.add('edit')

                      p.todoUpdateInfoCng({
                        todo_name:r.todo_name,
                        todo_content:r.todo_content,
                        todo_seq:r.todo_seq,
                        todo_status:r.todo_status,
                        task_seq:r.task_seq,
                        task_title:r.task_title,
                        projmember_seq:p.myMemberInfo.projmember_seq
                      })

                    }}/>
                  </div>
                  <div className="editWrp">
                    {
                      p.taskList&&
                        <Form.Select size="sm" onChange={e=>{
                          p.todoUpdateInfoCng({
                            ...p.todoUpdateInfo,
                            task_seq:e.target.value==''?null:e.target.value,
                            task_title:e.target[e.target.selectedIndex].getAttribute('data-title'),
                          });
                        }}>
                          <option value="" data-title="" selected={p.todoUpdateInfo.task_seq == 0?true:false}>업무를 선택하세요.</option>
                          {
                            p.taskList.map(r=>{
                              return(
                                <>
                                  {
                                    p.todoUpdateInfo
                                    ?
                                      p.todoUpdateInfo.task_seq == r.task_seq
                                      ? <option value={r.task_seq} data-title={r.task_title} selected={true}>{r.task_title}</option>
                                      : <option value={r.task_seq} data-title={r.task_title}>{r.task_title}</option>
                                    :<option value={r.task_seq} data-title={r.task_title}>{r.task_title}</option>
                                  }
                                </>
                              )
                            })
                          }
                        </Form.Select>
                    }
                    <input type="text" placeholder="제목" className="editTitle" value={p.todoUpdateInfo.todo_name?p.todoUpdateInfo.todo_name:''}
                      onChange={e=>{
                        p.todoUpdateInfoCng({
                          ...p.todoUpdateInfo,
                          todo_name:e.target.value,
                        });
                      }}
                    />
                    <textarea placeholder="내용" value={p.todoUpdateInfo.todo_content?p.todoUpdateInfo.todo_content:''}
                      onChange={e=>{
                        p.todoUpdateInfoCng({
                          ...p.todoUpdateInfo,
                          todo_content:e.target.value,
                        });
                      }}
                    />
                    <div className="btnWrap">
                      <p onClick={()=>{
                        let thisWrap = document.getElementById('todo'+r.todo_seq)
                        thisWrap.classList.remove('edit')

                        p.todoUpdateInfoCng({
                          todo_name:'',
                          todo_content:'',
                          todo_seq:'',
                          todo_status:'',
                          task_seq:'',
                          task_title:'',
                          projmember_seq:''
                        });
                      }}>취소</p>
                      <button style={{backgroundColor:p.prjColor, color:'#fff'}} onClick={p.myTodoUpdate}>작성완료</button>
                    </div>
                  </div>
                  <div className="wrap">
                    <p className="title">{r.todo_name}</p>
                    <p className="content">{r.todo_content}</p>
                    <div className="dateTask">
                      <p className="date">{r.todo_date} 작성</p>
                      {
                        r.task_title &&
                          <p className="task" onClick={()=>{
                            console.log('이 업무 seq로 링크보내샘' + r.task_seq)
                          }}>업무 : {r.task_title}</p>
                      }
                    </div>
                    
                  </div>
                  
                </div>
              )
            })
          :null
        }
      </div>

      
  );
}

function transReducer(state){
  return {
    projectInfo:state.projectInfo,
    myMemberInfo:state.myMemberInfo,
    pageInfo:state.pageInfo,
  }
}

export default connect(transReducer)(Todo);