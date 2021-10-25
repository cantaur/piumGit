
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import {pub, host} from './Helper.js'
// import '../css/test.css';

function Test3(){
  useEffect(()=>{
    console.log(profileData)    
  })

  const [profileData, profileDataCng] = useState({projmember_name:'', projmember_image:'', project_seq:''});


  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('projmember_name', profileData.projmember_name)
    formData.append('projmember_image', profileData.projmember_image)
    formData.append('project_seq', profileData.project_seq)

    axios({
      method:'post',
      url:host+'/ajax/updateProfile',
      data:formData,
      headers: {"Content-Type": "multipart/form-data"}
    })
    .then(r=>{
      console.log(r.data)
      console.log('업로드성공')
    })
    .catch(e=>{
      console.log(e)
      console.log('업로드실패')
    })
  }

  const handleFile = e => {
    e.preventDefault();
    const file = e.target.files[0];
    
    const upload = {...profileData}
    upload.projmember_image = file
    profileDataCng(upload)
  };
  const handleName = e => {
    e.preventDefault();
    const name = e.target.value;
    
    const upload = {...profileData}
    upload.projmember_name = name
    profileDataCng(upload)
  };

  const handleSeq = e => {
    e.preventDefault();
    const seq = e.target.value;
    
    const upload = {...profileData}
    upload.project_seq = Number(seq)
    profileDataCng(upload)
  };

  return(
    <>
      <input type="text" onChange={handleSeq} placeholder="seq" style={{display:'block'}}/>
      <input type="text" onChange={handleName} placeholder="이름" style={{display:'block'}}/>
      <input type="file" onChange={handleFile} accept=".jpg, .jpeg, .png, .svg" style={{display:'block',marginBottom:'1rem'}}/>
      <button onClick={handleSubmit}>정보수정하기</button>

    </>
  )
}
export default Test3;
