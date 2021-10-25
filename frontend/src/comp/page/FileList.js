import axios from "axios";
import React, { useEffect, useState,useRef,useCallback } from "react"
import {pub, colors, pages, host, seqColorTrans} from '../Helper.js'
import DatePicker from '../DatePicker.js'
import {FloatingLabel, Form, Button, Dropdown, Alert, Modal} from 'react-bootstrap'
import { Link, useParams, withRouter, useHistory } from "react-router-dom";
import {connect} from 'react-redux';
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";


import { FileIcon, defaultStyles } from "react-file-icon";






function FileList(p){
    const history = useHistory();
    const [fileList, setFileList]=useState()

    const fileListGetFunc = ()=>{
        axios.get(host+"/ajax/FileList/"+p.prjSeq)
        .then(r=>{
            setFileList(r.data)
        })
        .catch(e=>{
            console.log(e)
        })
    }
    //멤버정보 가져오기
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

    //파일 용량 변환 함수
    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    //파일 확장자 뽑는 함수
    const fileGetTypeFunc = (name) =>{
        let _fileLen = name.length;
        let _lastDot = name.lastIndexOf('.');
        let _fileExt = name.substring(_lastDot, _fileLen).toLowerCase();


        return _fileExt.substr(1)
    }

    // useEffect(()=>{
    //     fileListGetFunc()
    // },[p.memberList])
    useEffect(()=>{
        fileListGetFunc()
    },[p.mileStoneList])

    return(
        <div className="fileListWrap pageContentWrap">
            <div className="pageBtnWrap">
                <p className="pageBtn" onClick={()=>{
                    p.dispatch({type:'pagePush', val:'calendar'})
                    history.push('/project/'+p.prjSeq+'/calendar')
                }}>캘린더</p>
                <p className="pageBtn" onClick={()=>{
                    p.dispatch({type:'pagePush', val:'timeLine'})
                    history.push('/project/'+p.prjSeq+'/timeLine')
                }}>타임라인</p>
                <p className="pageBtn" onClick={()=>{
                    p.dispatch({type:'pagePush', val:'projectChart'})
                    history.push('/project/'+p.prjSeq+'/projectChart')
                }}>프로젝트개요</p>
                <p className="pageBtn on" style={{color:p.prjColor,borderColor:p.prjColor}} onClick={()=>{
                    p.dispatch({type:'pagePush', val:'fileList'})
                    history.push('/project/'+p.prjSeq+'/fileList')
                }}>파일보관함</p>
            </div>
            <div className="fileListViewWrap">
                <div className="fileHeader">
                    <p className="w400">파일 이름</p>
                    <p className="file w200">파일 크기</p>
                    <p className="file w200">공유된 날짜</p>
                    <p className="file w200">공유한 사람</p>
                </div>

                <div className="fileList">
                    {
                        p.memberList && p.mileStoneList
                        ?
                            fileList
                            ?
                                fileList.length >0
                                ?
                                    fileList.map(r=>{
                                        let writer=memberInfoGetFunc(r.projmember_seq)
                                        let mileTitle = ''
                                        if(p.mileStoneList.filter(row=>row.milestone_seq==r.milestone_seq).length >0){
                                          mileTitle = p.mileStoneList.filter(row=>row.milestone_seq==r.milestone_seq)[0].milestone_title

                                        }
                                        return(
                                            <div className="fileRow">
                                                <p className="fileName">
                                                    <FileIcon extension={fileGetTypeFunc(r.file_savename)} {...defaultStyles[fileGetTypeFunc(r.file_savename)]} />
                                                    <div className="fileInfo">
                                                        <p onClick={()=>{
                                                            window.location.href = host+"/downloadFile/"+r.file_savename
                                                        }}>{r.file_savename}</p>
                                                        <div>{mileTitle == ''?'':mileTitle + ' > '}{r.task_title}</div>
                                                    </div>

                                                </p>

                                                {/* 파일크기 */}
                                                <p className="fileSize">{formatBytes(r.file_size)}</p>
                                                {/* 공유된 날짜 */}
                                                <p className="fileDate">{r.file_uploaddate.substring(0,10)}</p>
                                                {/* 작성자 */}
                                                <div className="uploader">
                                                    <div className="profileImg toolTipTopBox w200">
                                                        <p className="toolTip">{writer.name}</p>
                                                        <div>
                                                            <img src={writer.data}/>
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>
                                        )
                                    })
                                :<p className={"noFileMsg fileRow"}>업로드 된 파일이 없습니다.</p>
                            :<Box sx={{ width: '100%' }}><LinearProgress /></Box>
                        :<Box sx={{ width: '100%' }}><LinearProgress /></Box>
                    }
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
        mileStoneList : state.mileStoneList

    }
}

export default connect(transReducer)(FileList);
