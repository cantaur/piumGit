import axios from "axios";
import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom";

const pub = {
  "img":process.env.PUBLIC_URL+"/img/",
  "css":process.env.PUBLIC_URL+"/css/"
}
const colors = [
  '#F34025',
  '#273F92',
  '#8F09A1',
  '#099EEF',
  '#038D7F',
  '#6ea043',
  '#e5a000',
  '#6C483C',
  '#596E80',
  '#f6751a',
]
const seqColorTrans = (seq) => {
  if(Number(seq) <= 9){
    return colors[seq]
  } else {
    return colors[seq % 10]
  }

}
const pages = [
  'calendar',
  'timeLine',
  'projectChart',
  'fileList',
  'todo',
  'mileStone',
  'mileStoneView',
  'task',
  'notice'
]

const host = 'http://ec2-3-22-170-165.us-east-2.compute.amazonaws.com:8000';



export {pub, colors, host, pages,seqColorTrans};
