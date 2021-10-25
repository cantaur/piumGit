
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import {pub, host} from './Helper.js'
// import '../css/test.css';

function Test4(){
  useEffect(()=>{
    
  },[])

  const [files, filesCng] = useState();

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', files)
    formData.append('project_seq', 3)
    formData.append('task_seq', 10)
    formData.append('projmember_seq', 29)


    axios({
      method:'post',
      url:host+'/ajax/uploadFile',
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

  const handleUpload = e => {
    e.preventDefault();
    const file = e.target.files[0];
    filesCng(file)
  };

  return(
    <>

      <input type="file" onChange={handleUpload}/>
      <button onClick={handleSubmit}>파일 업로드</button>

    </>
  )
}
export default Test4;
