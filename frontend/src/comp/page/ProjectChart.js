import axios from "axios";
import React, { useEffect, useState,useRef,useCallback } from "react"
import {pub, colors, pages, host, seqColorTrans} from '../Helper.js'
import { Link, useParams, withRouter, useHistory } from "react-router-dom";
import {connect} from 'react-redux';
// import '../../css/test6.css';
import ChartHead from './comp/ChartHead.js'

import Chart from "react-google-charts";
import data from "bootstrap/js/src/dom/data";
import { InputGroup } from "react-bootstrap";
import CircularProgress from '@mui/material/CircularProgress';



function ProjectChart(p) {

    //첫번째 차트 데이터
    const [countMilestone, setCountMilestone] = useState([]);
    //두번째 차트 데이터
    const [countTaskChart, setCountTaskChart] = useState([]);
    //세번째 차트 데이터
    const [countTask, setCountTask] = useState([]);
    //네번째 차트 데이터
    const [countMyTask,setCountMyTask] = useState([]);

    const history = useHistory();

    const countAllMyTaskGetFunc = () =>{
      axios.get(host +'/ajax/countAllMyTask/'+p.projectInfo.project_seq)
      .then(r=>{
        let countMyTaskDummy = [['','배정된 업무','완료된 업무']];
        r.data.map(row=>{
          let name = '';
          p.memberList.map(member=>{
            if(row.projmember_seq == member.projmember_seq){
              name = member.projmember_name?member.projmember_name:'User#'+member.projmember_seq;
            }
          })
          let done = Number(row.done);
          let total = Number(row.total);
          countMyTaskDummy.push([name, total, done])
        })
        setCountMyTask(countMyTaskDummy)
      })
      .catch(e=>{
        console.log(e)
      })
    }

    const mileStoneOneChartGetFunc = () =>{
      axios.get(host + '/ajax/milestoneOneChart/' + p.projectInfo.project_seq)
      .then(r=>{
        setCountMilestone(r.data)
      })
      .catch(e=>{
        console.log(e)
      })
    }
    const taskChartGetFunc = () =>{
      axios.get(host + '/ajax/taskChart/' + p.projectInfo.project_seq + '/' + p.myMemberInfo.projmember_seq + '/' + p.projectInfo.member_seq)
      .then(r=>{
        setCountTaskChart(r.data);
      })
      .catch(e=>{
        console.log(e)
      })
    }

    const countTaskStatusGetFunc = () =>{
      axios.get(host + '/ajax/countTaskStatus/' + p.projectInfo.project_seq)
      .then(r=>{
        setCountTask(r.data);
      })
      .catch(e=>{
        console.log(e)
      })
    }

    useEffect(()=>{
      countAllMyTaskGetFunc();
      mileStoneOneChartGetFunc();
      taskChartGetFunc();
      countTaskStatusGetFunc();
    },[p.memberList])


    return (
        <div className="projectChartWrap pageContentWrap">
            <div className="pageBtnWrap">
                <p className="pageBtn" onClick={() => {
                    p.dispatch({type: 'pagePush', val: 'calendar'})
                    history.push('/project/' + p.prjSeq + '/calendar')
                }}>캘린더</p>
                <p className="pageBtn" onClick={() => {
                    p.dispatch({type: 'pagePush', val: 'timeLine'})
                    history.push('/project/' + p.prjSeq + '/timeLine')
                }}>타임라인</p>
                <p className="pageBtn on" style={{color: p.prjColor, borderColor: p.prjColor}} onClick={() => {
                    p.dispatch({type: 'pagePush', val: 'projectChart'})
                    history.push('/project/' + p.prjSeq + '/projectChart')
                }}>프로젝트개요</p>
                <p className="pageBtn" onClick={() => {
                    p.dispatch({type: 'pagePush', val: 'fileList'})
                    history.push('/project/' + p.prjSeq + '/fileList')
                }}>파일보관함</p>
            </div>
            <ChartHead/>
            <div>
                {/*첫번째 차트*/}
                <div className={'chartLine'}>
                    <div className={'chartArea chartA chartLine-child-1'}>
                        {
                            p.memberList
                            ?
                                countMilestone.length > 0
                                ?
                                    <Chart
                                        width={'100%'}
                                        height={'100%'}
                                        chartType="PieChart"
                                        data={countMilestone[0] !== 0 && countMilestone[1] !== 0
                                            ?
                                            [
                                                ['Task', 'Hours per Day'],
                                                ['진행중인 마일스톤', countMilestone[0]],
                                                ['완료된 마일스톤', countMilestone[1]],
                                            ]
                                            : [
                                                ['Task', 'Hours per Day'],
                                                ['업무가 없습니다.', 1],
                                            ]}
                                        options={{
                                            title: '마일스톤 진행도',
                                            width: '100%',
                                            chartArea: {
                                                width: '100%',
                                            },

                                            titleTextStyle: {
                                              fontSize: 15,
                                              bold: true,
                                            }
                                        }}
                                        rootProps={{'data-testid': '1'}}
                                    />
                                :<CircularProgress />
                            :<CircularProgress />
                        }
                    </div>
                    {/*세번째 차트*/}
                    <div className={'chartArea chartA chartLine-child-3'}>{
                    p.memberList
                    ?
                        countTask.length > 0
                        ?
                            <Chart
                                width={'100%'}
                                height={'100%'}
                                chartType="PieChart"
                                data={countTask[0] !== 0 && countTask[1] !== 0
                                    ?
                                    [
                                        ['Task', 'Hours per Day'],
                                        ['진행중인 업무', countTask[0]],
                                        ['완료된 업무', countTask[1]],
                                    ]
                                    :
                                    [
                                        ['Task', 'Hours per Day'],
                                        ['업무가 없습니다.', 1],
                                    ]
                                }
                                options={{
                                    title: '현재 업무 진행도',
                                    pieHole: 0.4,
                                    width: '100%',
                                    chartArea: {
                                        width: '100%',
                                    },
                                    titleTextStyle: {
                                        fontSize: 15,
                                        bold: true
                                    }
  
                                }}
                                rootProps={{'data-testid': '1'}}
                            />
                            :<CircularProgress />
                        :<CircularProgress />
                    }
                    </div>
                    {/*두번째 차트*/}
                    <div className={'chartArea chartA chartLine-child-2'}>
                        {
                            p.memberList
                            ?
                                countTaskChart.length > 0
                                ?
                                <Chart
                                    width={'100%'}
                                    height={'100%'}
                                    chartType="PieChart"
                                    loader={<div>로딩중...</div>}
                                    data={countTaskChart[0] !== 0 && countTaskChart[1] !== 0
                                        ?
                                        [
                                            ['Task', 'Hours per Day'],
                                            ['전체 프로젝트 업무', countTaskChart[0]],
                                            ['나의 업무', countTaskChart[1]],
                                        ]
                                        : [
                                            ['Task', 'Hours per Day'],
                                            ['업무가 없습니다.', 1],
                                        ]
                                    }
                                    options={{
                                        title: '나에게 할당된 업무',
                                        width: '100%',
                                        chartArea: {
                                            width: '100%',
                                        },
                                        titleTextStyle: {
                                          fontSize: 15,
                                          bold: true
                                        }

                                    }}
                                    rootProps={{'data-testid': '1'}}
                                />
                                :<CircularProgress />
                            :<CircularProgress />
                        }
                    </div>
                    
                    {/*네번째 차트*/}
                    <div className={'chartArea chartB chartLine-child-4'} style={{width:'100%'}}>
                      {
                        p.memberList
                        ?
                          countMyTask.length > 0
                          ?
                            <Chart
                                width={'100%'}
                                height={'100%'}
                                chartType="ColumnChart"
                                data={countMyTask}
                                options={{
                                  title:'업무 기여도',
                                  titleTextStyle: {
                                    fontSize: 15,
                                    bold: true
                                  },
                                  chartArea:{
                                    left:20,
                                    width: '880',
                                  }
                                }}
                                rootProps={{'data-testid':'3'}}
                            />
                          :<CircularProgress />
                        :<CircularProgress />
                      }

                    </div>
                </div>
            </div>
        </div>
    )
}

function transReducer(state){
    return {
        loading : state.loading,
        datePickerModal : state.datePickerModal,
        projectInfo : state.projectInfo,
        pageInfo : state.pageInfo,
        myMemberInfo : state.myMemberInfo,
        memberList : state.memberList,
    }
}

export default connect(transReducer)(ProjectChart);
