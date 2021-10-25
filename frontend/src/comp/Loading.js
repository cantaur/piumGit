import axios from "axios";
import React, { useEffect, useState } from "react"
import CircularProgress from '@mui/material/CircularProgress';
import {connect} from 'react-redux';



function Loading(p){
  return(
    <>
      <>
            {p.loading === false ? "" :
                <>
                    <div className={"globalLoadingIcon"} style={{
                      width:'100vw',
                      height:'100vh',
                      position:'fixed',
                      top:'0px',
                      left:'0px',
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',
                      zIndex:'999999',
                      paddingBottom:'200px',
                      backgroundColor:'rgba(255,255,255,.3)'
                    }}>
                        <div className={"iconArea"}>
                            <CircularProgress />
                        </div>
                    </div>
                </>
            }
        </>
    </>
  )
}
function transReducer(state){
  return {
    loading : state.loading
  }
}

export default connect(transReducer)(Loading);