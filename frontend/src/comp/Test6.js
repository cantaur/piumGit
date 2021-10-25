import axios from 'axios';
import React, {useState, useEffect} from 'react';
// import '../css/test6.css';
import Chart from "react-google-charts";
import {host} from "./Helper";
import {connect} from "react-redux";
import { Link, useParams, withRouter, useHistory } from "react-router-dom";
import ChartHead from './page/comp/ChartHead.js'

function Test6(p) {

    const [milestones, setMilestones] = useState([]);

    const history = useHistory();
    useEffect(()=>{
        axios
            .all([
                axios.get(host+'/ajax/3/milestonelist')//마일스톤 전부조회.
            ])
            .then(
                axios.spread((r1)=>{
                    setMilestones(r1.data);
                    // console.log("#milestones:"+JSON.stringify(r1.data));
                })
            )
            .catch(e=>{
                console.log(e)
            });
    },[]);

    var arr=[[
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

    return(
        <div className="timeLineWrap pageContentWrap">
            <div className="pageBtnWrap">
                <p className="pageBtn" onClick={() => {
                    p.dispatch({type: 'pagePush', val: 'calendar'})
                    history.push('/project/' + p.prjSeq + '/calendar')
                }}>캘린더</p>
                {/* <p className="pageBtn" onClick={() => {
                    p.dispatch({type: 'pagePush', val: 'timeLine'})
                    history.push('/project/' + p.prjSeq + '/timeLine')
                }}>타임라인</p> */}
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
                <div className="viewOutWrap">
                    <div>
                        <div className="app">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Gantt"
                                loader={<div>로딩중...</div>}
                                data={arr}
                                options={{
                                    heigth: 275,
                                    gantt: {
                                        palette:[
                                            {
                                                "color": "#f48fb1",//리소스text, 죄측text 컬러
                                                "dark": "#880e4f",//보이는 바 색상
                                                "light": "#d8cfea" //눌린 후 밝아지는 다른 바 색상
                                            },
                                            {
                                                "color": "#dcd8d0",
                                                "dark": "#00838f",
                                                "light": "#b2ebf2"
                                            },
                                            {
                                                "color": "#f2a600",
                                                "dark": "#ee8100",
                                                "light": "#fce8b2"
                                            },
                                            {
                                                "color": "#0f9d58",
                                                "dark": "#0b8043",
                                                "light": "#b7e1cd"
                                            },
                                            {
                                                "color": "#ab47bc",
                                                "dark": "#6a1b9a",
                                                "light": "#e1bee7"
                                            },
                                            {
                                                "color": "#dcd8d0",
                                                "dark": "#00838f",
                                                "light": "#b2ebf2"
                                            },
                                            {
                                                "color": "#ff7043",
                                                "dark": "#e64a19",
                                                "light": "#ffccbc"
                                            },
                                            {
                                                "color": "#9e9d24",
                                                "dark": "#827717",
                                                "light": "#f0f4c3"
                                            },
                                            {
                                                "color": "#fee8f4",
                                                "dark": "#3949ab",
                                                "light": "#c5cae9"
                                            },
                                            {
                                                "color": "#c0d6e4",
                                                "dark": "#e91e63",
                                                "light": "#f8bbd0"
                                            },
                                            {
                                                "color": "#e4cfea",
                                                "dark": "#004d40",
                                                "light": "#b2dfdb"
                                            },
                                            {
                                                "color": "#d8cfea",
                                                "dark": "#880e4f",
                                                "light": "#f48fb1"
                                            },
                                        ],
                                    }
                                    //추가 옵션은 여기로!!
                                }}
                                rootProps={{ 'data-testid' : '1'}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
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

export default connect(transReducer)(Test6);