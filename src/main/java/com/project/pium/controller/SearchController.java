package com.project.pium.controller;


import com.project.pium.domain.MilestoneDTO;
import com.project.pium.domain.TaskDTO;
import com.project.pium.service.SearchService;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Log
@RestController
@AllArgsConstructor
public class SearchController {
    private SearchService service;

    // 마일 + 업무 = 무능한 이건희
    @PostMapping("/ajax/searchPMT")
    public ArrayList<Object> searchPMT(@RequestBody Map<String,String> param){
        ArrayList<Object> mileAndTask = new ArrayList<>();
        List<MilestoneDTO> searchM = service.searchMS(param);
        List<TaskDTO> searchT = service.searchTS(param);
        LinkedHashMap<String, Object> mTAll = new LinkedHashMap<>();
        mTAll.put("milestone", searchM);
        mTAll.put("task", searchT );
        mileAndTask.add(mTAll);
        log.info("searchM: "+searchM);
        log.info("searchT: "+searchT);
        log.info("mile + task: "+mileAndTask);
        log.info("param: "+param);
        return mileAndTask;
    }
    // 마일스톤 검색
    @PostMapping("/ajax/searchM")
    public List<MilestoneDTO> searchM(@RequestBody Map<String,String> param){
        List<MilestoneDTO> searchM = service.searchMS(param);
        log.info("searchM: "+searchM);
        log.info("param: "+param);
        return searchM;
    }
    // 업무 검색
    @PostMapping("/ajax/searchT")
    public List<TaskDTO> searchT(@RequestBody Map<String,String> param){
        List<TaskDTO> searchT = service.searchTS(param);
        log.info("searchT: "+searchT);
        log.info("param: "+param);
        return searchT;
    }
}
