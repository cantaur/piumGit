import axios from "axios";
import React, { useEffect, useState } from "react"
import {pub, colors, pages, host} from '../Helper.js'
import DatePicker from '../DatePicker.js'
import { Link, useParams, withRouter, useHistory } from "react-router-dom";
import {connect} from 'react-redux';
import {Badge, Button, FloatingLabel, Form, Modal, Nav} from 'react-bootstrap';
import {Menu, MenuItem} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import ChartHead from "./comp/ChartHead";
import Chart from "react-google-charts";
import LinearProgress from "@mui/material/LinearProgress";


function TimeLine(p){
    const [milestones, setMilestones] = useState([]);

    const history = useHistory();

    useEffect(()=>{
      setMilestones(p.mileStoneList)



    },[p.mileStoneList]);

    var arr=[
      [
        { type: 'string', label: 'Task ID' },
        { type: 'string', label: 'Task Name' },//title(왼쪽에 들어갈 이름)
        { type: 'string', label: 'resource' },
        { type: 'date', label: 'Start Date' },//startdate
        { type: 'date', label: 'End Date' }, //duedate
        { type: 'number', label: 'Duration' },
        { type: 'number', label: 'Percent Complete' },
        { type: 'string', label: 'Dependencies' },
      ]
    ];
    for(var i=0;i<milestones.length;i++) {
        arr.push([
            'Mile'+milestones[i].milestone_seq,
            milestones[i].milestone_title,
            'milestone',
            new Date(milestones[i].milestone_startdate),
            new Date(milestones[i].milestone_duedate),
            100,
            100,
            null
        ])
        for(var j=0;j<2;j++){//test
            arr.push([
                'Task'+milestones[i].milestone_seq+j,
                'test',
                'task',
                new Date(milestones[i].milestone_startdate),
                new Date(milestones[i].milestone_duedate),
                100,
                100,
                null
            ])
        }
    }

    const [chartData, setChartData] = useState(
      [
        [
          { type: 'string', label: 'Task ID' },
          { type: 'string', label: 'Task Name' },
          { type: 'string', label: 'Resource' },
          { type: 'date', label: 'Start Date' },
          { type: 'date', label: 'End Date' },
          { type: 'number', label: 'Duration' },
          { type: 'number', label: 'Percent Complete' },
          { type: 'string', label: 'Dependencies' },
        ],
      ]
    );

    useEffect(()=>{
      if(p.projectInfo){
        axios.get(host+'/ajax/timeline/'+p.projectInfo.project_seq)
        .then(r=>{
          let chartDataDummy = [...chartData]

          r.data.mile.map(m=>{
            if(m.milestone_startdate && m.milestone_duedate){
              let rowData = [
                'mileNumber'+m.milestone_seq,
                '마일스톤 : '+m.milestone_title,
                null,
                new Date(m.milestone_startdate),
                new Date(m.milestone_duedate),
                null,
                100,
                null
              ]
              chartDataDummy.push(rowData)
            }

          })
          r.data.task.map(t=>{
            if(t.task_startdate && t.task_duedate){
              let done = t.task_status == '0'?0:100;
              let rowData = [
                'task'+t.task_seq,
                '업무 : '+t.task_title,
                t.task_content,
                new Date(t.task_startdate),
                new Date(t.task_duedate),
                null,
                done,
                'mileNumber'+t.milestone_seq
              ]

              chartDataDummy.push(rowData)
            }

          })

          console.log(chartDataDummy)
          setChartData(chartDataDummy);
        })
        .catch(e=>{
          console.log(e);
        })
      }
    },[p.projectInfo])


    return(
        <div className="projectChartWrap pageContentWrap">
            <div className="pageBtnWrap">
                <p className="pageBtn" onClick={()=>{
                    p.dispatch({type:'pagePush', val:'calendar'})
                    history.push('/project/'+p.prjSeq+'/calendar')
                }}>캘린더</p>
                <p className="pageBtn on" style={{color:p.prjColor,borderColor:p.prjColor}} onClick={()=>{
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

            <ChartHead progressHide={true}/>
            <div className="timeLineWrap" style={{marginTop:'30px'}}>
              {
                chartData
                ?
                  chartData.length > 0
                  ?
                    <Chart
                        width = '100%'
                        height = {'1700px'}
                      chartType="Gantt"
                      loader={<LinearProgress/>}
                      data={chartData}
                      options={{
                          // percentEnabled : false,
                          // criticalPathEnabled : false
                      }}
                      rootProps={{ 'data-testid': '3' }}
                    />
                  :<p>데이터가 없습니다.</p>
                :<LinearProgress/>
              }
            </div>
          </div>
    );
}



function transReducer(state){
    return {
        datePickerModal : state.datePickerModal,
        loading : state.loading,
        projectInfo : state.projectInfo,
        pageInfo : state.pageInfo,
        myMemberInfo : state.myMemberInfo,
        memberList : state.memberList,
        mileStoneList:state.mileStoneList,
    }
}

export default connect(transReducer)(TimeLine)
