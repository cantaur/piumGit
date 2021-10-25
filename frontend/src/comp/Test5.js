
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import {pub, host} from './Helper.js'
// import '../css/test.css';

function Test5(){

    useEffect(()=>{

        axios({
            method : 'post',
            url:host + '/ajax/Test5',
            data : {
                calendar_title : 'test',
                calendar_content : 'test content',
                calendar_date : '2021-09-03 22:10:42',
                calendar_startdate : '2021-09-01 22:10:42',
                calendar_enddate : '2021-09-04 22:10:42',
                project_member_seq : 1
            }

        })
            .then (
                r=>{console.log(r)}
            )
    },[])

  return(
      <>



      </>
  )
}
export default Test5;