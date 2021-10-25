import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {pub, host} from './Helper.js'
import '../css/test.css';
import {Badge, Button, FloatingLabel, Form, Modal, Nav} from 'react-bootstrap';
import {Menu, MenuItem} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

function Test(){
    /*모달*/
    const [modalShow, setModalShow] = React.useState(false);
    /*상태별 정렬*/
    const [todos, setTodos] = useState([]);
    const [progresses, setProgresses] = useState([]);
    const [dones, setDones] = useState([]);
    /*상태별 카운트*/
    const [cntTodo,setCntTodo] = useState([]);
    const [cntProg,setCntProg] = useState([]);
    const [cntDone,setCntDone] = useState([]);

    useEffect(()=>{
        axios
            .all([
                axios.get(host+'/ajax/mytodo'),
                axios.get(host+'/ajax/myprogress'),
                axios.get(host+'/ajax/mydone'),
                axios.get(host+'/ajax/countTodo'),
                axios.get(host+'/ajax/countProgress'),
                axios.get(host+'/ajax/countDone')
            ])
            // .then(r=>{
            //     setTodos(r.data);
            // })
            .then(
                axios.spread((r1,r2,r3,r4,r5,r6)=>{
                    setTodos(r1.data);
                    setProgresses(r2.data);
                    setDones(r3.data);
                    setCntTodo(r4.data);
                    setCntProg(r5.data);
                    setCntDone(r6.data);
                })
            )
            .catch(e=>{
                console.log(e)
            });
    },[]);
    return(
        <>
            {/*<p>컴포넌트 경로 : src/comp/Test.js</p>*/}
            {/*<hr/>*/}
            {/*<p>모듈 추가시 꼭 --save를 붙혀주세요.</p>*/}
            {/*<p>예시: npm install react-redux --save (yarn 사용시 yarn add react-redux --save)</p>*/}
            {/*<p>페이지 추가시 App.js에서 Test 컴포넌트 있는 부분 보시고 추가하시면 됩니당 잘 안되면 문의</p>*/}
            <div className="app">
                <header>
                    <br/>
                    <br/>
                    {/*<p id='checked'>To Do List</p>&emsp;&emsp;&emsp;&emsp;<p>알림</p>*/}
                    <Nav className="justify-content-center" activeKey="">
                        <Nav.Item>
                            <Nav.Link eventKey="disabled" disabled>To Do List</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="">
                                알림
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <br/>
                </header>
                <div className="lists">
                    <div className="list">
                        <div className="list-label">To do&emsp;<Badge bg="danger"><CountTodo cntTodo={cntTodo}/></Badge></div>
                        <TodoList todos={todos}/>
                        <div className="list-add">
                            <i className="fas fa-plus toolTipBox" onClick={() => setModalShow(true)}>
                                <div className="toolTip" style={{'marginLeft': '-47.33px'}}>새 Todo 생성</div>
                            </i>
                            <MyVerticallyCenteredModal
                                setStatus='10'//상태값 전달인데 왜 30으로 들어가냐..
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                            />
                        </div>
                    </div>
                    <div className="list">
                        <div className="list-label">In Progress&emsp;<Badge bg="success"><CountProgress cntProg={cntProg}/></Badge></div>
                        <ProgressList progresses={progresses}/>
                        <div className="list-add">
                            <i className="fas fa-plus toolTipBox" onClick={() => setModalShow(true)}>
                                <div className="toolTip" style={{'marginLeft': '-47.33px'}}>새 In Progress 생성</div>
                            </i>
                            <MyVerticallyCenteredModal
                                setStatus='20'//상태값 전달
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                            />
                        </div>
                    </div>
                    <div className="list">
                        <div className="list-label">Done&emsp;<Badge bg="primary"><CountDone cntDone={cntDone}/></Badge></div>
                        <DoneList dones={dones}/>
                        <div className="list-add">
                            <i className="fas fa-plus toolTipBox" onClick={() => setModalShow(true)}>
                                <div className="toolTip" style={{'marginLeft': '-47.33px'}}>새 Done 생성</div>
                            </i>
                            <MyVerticallyCenteredModal
                                setStatus='30'//상태값 전달
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
function TodoList({ todos }) {
    const [modalShow, setModalShow] = React.useState(false);
    //console.log(todos);
    return (
        <div>
            {todos && todos.map(todos =>{
                return(
                    <div className="list-item" draggable="true">
                        <table key={todos.todo_seq}>
                            <tr><td>{todos.todo_name}</td>
                                <Menu menuButton={<i id="dots" className="fas fa-ellipsis-h"></i>}>
                                    <MenuItem onClick={() => setModalShow(true)}>수정</MenuItem>
                                    <MyVerticallyCenteredModal2
                                        msg={todos.todo_seq}
                                        show={modalShow}
                                        onHide={() => setModalShow(false)}
                                    />
                                    <MenuItem onClick={() => del(todos.todo_seq)}>삭제</MenuItem>
                                </Menu>
                            </tr>
                            <tr><td>{todos.todo_content}</td></tr>
                            <tr><td>{todos.todo_date}</td></tr>
                        </table>
                    </div>
                );
            })}
        </div>
    );
}
function ProgressList({ progresses }) {
    const [modalShow, setModalShow] = React.useState(false);
    console.log(progresses);
    return (
        <div>
            {progresses && progresses.map(progresses =>{
                return(
                    <div className="list-item" draggable="true">
                        <table key={progresses.todo_seq}>
                            <tr><td>{progresses.todo_name}</td>
                                <Menu menuButton={<i id="dots" className="fas fa-ellipsis-h"></i>}>
                                    <MenuItem onClick={() => setModalShow(true)}>수정</MenuItem>
                                    <MyVerticallyCenteredModal2
                                        msg={progresses.todo_seq}
                                        show={modalShow}
                                        onHide={() => setModalShow(false)}
                                    />
                                    <MenuItem onClick={() => del(progresses.todo_seq)}>삭제</MenuItem>
                                </Menu>
                            </tr>
                            <tr><td>{progresses.todo_content}</td></tr>
                            <tr><td>{progresses.todo_date}</td></tr>
                        </table>
                    </div>
                );
            })}
        </div>
    );
}
function del(param){
    const i= param;
    const url = '/ajax/deleteTodo'
    axios.post(host+url,{
        seq: i
    })
        .then(r=>{
            console.log(r)
        })
        .catch(e=>{
            console.log(e)
        })
        .finally(()=>{
            console.log("#화면갱신을 해야하는 곳")
        })
}
function DoneList({ dones }) {
    const [modalShow, setModalShow] = React.useState(false);
    console.log(dones);
    return (
        <div>
            {dones && dones.map(dones =>{
                return(
                    <div className="list-item" draggable="true">
                        <table key={dones.todo_seq}>
                            <tr ><td>{dones.todo_name}</td>
                                <Menu menuButton={<i id="dots" className="fas fa-ellipsis-h"></i>}>
                                    <MenuItem onClick={() => setModalShow(true)}>수정</MenuItem>
                                    <MyVerticallyCenteredModal2
                                        msg={dones.todo_seq}
                                        show={modalShow}
                                        onHide={() => setModalShow(false)}
                                    />
                                    <MenuItem onClick={() => del(dones.todo_seq)}>삭제</MenuItem>
                                </Menu>
                            </tr>
                            <tr><td>{dones.todo_content}</td></tr>
                            <tr><td>{dones.todo_date}</td></tr>
                        </table>
                    </div>
                );
            })}
        </div>
    );
}
function CountTodo({ cntTodo }){
    console.log(cntTodo);
    return(
        <div>{cntTodo}</div>
    );
}
function CountProgress({ cntProg }){
    console.log(cntProg);
    return(
        <div>{cntProg}</div>
    );
}
function CountDone({ cntDone }){
    console.log(cntDone);
    return(
        <div>{cntDone}</div>
    );
}
function MyVerticallyCenteredModal(props) {
    const [tasks, setTasks] = useState([]);
    const [todoInfo, setTodoInfo] = useState({
        task_seq:'1',//얘도 어케 받아오지..?
        todo_content:'',
        todo_name:'',
        todo_status:''
    });
    const status = props.setStatus;
    const list = tasks;
    const [Selected, setSelected] = useState("");

    const handleSelect =(e) =>{
        setSelected(e.target.value);
    };
    const handleOnChange = (e) => {//입력데이터관리핸들러
        setTodoInfo({
            todo_status:status,
            todo_name: Selected,
            todo_content : e.target.value,
            //task_seq : 'something'
        })
        console.log("#입력핸들러 동작중");
        console.log("#todoInfo status: "+todoInfo.todo_status);
        console.log("#todoInfo name: "+todoInfo.todo_name);
        console.log("#todoInfo content: "+todoInfo.todo_content);
        // console.log("#todoInfo task_seq: "+todoInfo.task_seq);
    };

    useEffect(()=>{
        axios
            .all([
                axios.get(host+'/ajax/showTask'), //task_name, task_seq도 받아와야함...
            ])
            .then(
                axios.spread((r1,r2)=>{
                    setTasks(r1.data);
                })
            )
            .catch(e=>{
                console.log(e)
            });
    },[]);
    return (
        <Modal
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="modalWrap"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    새 카드 생성
                </Modal.Title>
            </Modal.Header>
            {/*<ShowTask tasks={tasks} />*/}
            <Modal.Body>
                <select onChange={handleSelect} value={Selected}>
                    {list.map((item)=>(
                        <option value={item} key={item}>
                            {item}
                        </option>
                    ))}
                </select>
                <Form.Group className="mb-2 piumInput" controlId="floatingInput">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="제목"
                    >
                        <Form.Control type="text" name="todo_name" placeholder="제목" value={Selected} onChange={handleOnChange}/>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className=" piumInput" controlId="floatingTextarea">
                    <FloatingLabel controlId="floatingTextarea" label="설명">
                        <Form.Control type="textarea" name="todo_content" placeholder="설명" onChange={handleOnChange}/>
                    </FloatingLabel>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer className="modalBtnWrap">
                <Button onClick={()=>{
                    setTodoInfo.todo_status="";
                    props.onHide();
                }} className="modalBtn danger">취소</Button>
                <Button onClick={()=>{
                    console.log("#Insert test:"+todoInfo.todo_content);
                    console.log("#Insert test:"+todoInfo.todo_name);
                    console.log("#Insert test:"+todoInfo.todo_status);
                    // axios.post(host+"/ajax/createTodo",todoInfo)
                    //     .then(r=>{
                    //         console.log(r)
                    //     })
                    //     .catch(e=>{
                    //         console.log(e)
                    //     })
                    //     .finally(()=>{
                    //         props.onHide();
                    //         console.log("#INSERT 화면갱신해야하는 곳")
                    //     })
                }} className="modalBtn">생성하기</Button>

            </Modal.Footer>
        </Modal>
    );
}
/*수정*/
function MyVerticallyCenteredModal2(props) {
    const [readCard, setReadCard] = useState({
        todo_seq: '',
        todo_name: '',
        todo_content: '',
        todo_date: '',
        todo_status: '',
        task_seq: '',
        projmember_seq: ''
    });
    const cardSeq = props.msg;

    const [inputs, setInputs] = useState({
        todo_content:'',
        todo_seq:''
    });
    const handleSelect =(e) => {
        setInputs({
            todo_content: e.target.value,
            todo_seq: readCard.todo_seq
        })
        console.log("setInput:"+inputs.todo_content);
        console.log("setInput:"+inputs.todo_seq);
    };

    useEffect(()=>{
        axios
            .all([
                axios.get('/ajax/todoData', {
                    params: {
                        seq: cardSeq
                    }
                })
            ])
            .then(
                axios.spread((r1)=>{
                    setReadCard(r1.data);
                    console.log(r1);
                })
            )
            .catch(e=>{
                console.log(e)
            });
    },[]);
    return (
        <Modal
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="modalWrap"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    카드 수정
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-2 piumInput" controlId="floatingInput">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="제목"
                    >
                        <Form.Control type="text" placeholder="제목" value={readCard.todo_name} readOnly/>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className=" piumInput" controlId="floatingTextarea">
                    <FloatingLabel controlId="floatingTextarea" label="설명">
                        <Form.Control type="textarea" name="todo_content" placeholder="설명" defaultValue={readCard.todo_content} spellCheck="false" onChange={handleSelect}/>
                    </FloatingLabel>
                </Form.Group>

            </Modal.Body>
            <Modal.Footer className="modalBtnWrap">
                <Button onClick={props.onHide} className="modalBtn danger">취소</Button>
                <Button onClick={()=>{
                    axios.post(host+"/ajax/updateTodo",inputs)
                        .then(r=>{
                            console.log(r)
                        })
                        .catch(e=>{
                            console.log(e)
                        })
                        .finally(()=>{
                            props.onHide();
                            console.log("#UPDATE 화면갱신을 해야하는 곳")
                        })
                }} className="modalBtn">수정하기</Button>
            </Modal.Footer>
        </Modal>
    );
}
export default Test;
