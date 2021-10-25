import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { Chart } from "react-google-charts";
import {pub, host} from './Helper.js'

function Test7(){//For 간트차트
    const [milestones, setMilestones] = useState([]);
    const [tasks,setTasks]=useState([]);
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
    // useEffect(()=>{
    //     for(var i=0;i<milestones.length;i++) {//데이터 arr에 마일스톤갯수만큼 반복을 돌려 입력
    //         axios.all([
    //             axios.get(host + '/ajax/task/' + milestones[i].milestone_seq)
    //         ])
    //             .then(
    //                 axios.spread((r2) => {
    //                     setTasks(r2.data);
    //                     // console.log("#task:" + JSON.stringify(tasks));
    //                 })
    //             )
    //     }
    // });
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
    // console.log(arr);
    // console.log(JSON.stringify(tasks));
    return(
        <>
            <div className="app">
                <Chart
                    width={'100%'}
                    height={'400px'}
                    chartType="Gantt"
                    loader={<div>Loading Chart</div>}
                    data={arr} //OK
                    options={{
                     gantt:{
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
                     },
                    }}
                     rootProps={{ 'data-testid': '3' }}
                />

            </div>
        </>
    );
}
export default Test7;