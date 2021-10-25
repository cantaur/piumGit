package com.project.pium.controller;


import com.project.pium.domain.MilestoneDTO;
import com.project.pium.domain.ProjectmemberDTO;
import com.project.pium.domain.TaskDTO;
import com.project.pium.domain.TaskmemberDTO;
import com.project.pium.service.ChartService;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Log
@RestController
@AllArgsConstructor
@ResponseBody
public class ChartController {
    private ChartService chartService;

    //  chart 1
    @GetMapping("ajax/milestoneOneChart/{prjSeq}")
    public List<Long> countMilestone(@PathVariable long prjSeq) {
        log.info("Pathvariable : "+ prjSeq);
        long a = chartService.countMilestoneStatusZeroS(prjSeq);
        long b = chartService.countMilestoneStatusOneS(prjSeq);
        List<Long> list = new ArrayList<>();
        list.add(a);
        list.add(b);
        return list;
    }
    //  chart 2
    @GetMapping("ajax/taskChart/{prjSeq}/{prjMSeq}/{MSeq}")
    public List<Long> taskChart(@PathVariable long prjSeq, @PathVariable long prjMSeq, @PathVariable long MSeq) {
        log.info("chart2_prjSeq : "+prjSeq);
        log.info("chart2_prjMSeq : "+prjMSeq);
        log.info("chart2_MSeq : "+MSeq);
        long all = chartService.countTaskAll(prjSeq);
        long mine = chartService.countTaskMine(prjSeq, prjMSeq, MSeq);
        List<Long> list = new ArrayList<>();
        list.add(all);
        list.add(mine);
        return list;
    }
    //  chart 3
    @GetMapping("ajax/countTaskStatus/{prj_seq}")
    public List<Long> countTask(@PathVariable long prj_seq){
        long progress = chartService.countTaskStatusZero(prj_seq);
        long completion = chartService.countTaskStatusOne(prj_seq);
        List<Long> list = new ArrayList<>();
        list.add(progress);
        list.add(completion);
        return list;
    }
    //  chart 4
    @GetMapping("ajax/countAllMyTask/{prj_seq}")
    public List<TaskmemberDTO> countMyTask(@PathVariable long prj_seq){
        List<TaskmemberDTO> all = chartService.countMyAllTask(prj_seq);
        return all;
    }
    // timeline
    @GetMapping("ajax/timeline/{prj_seq}")
    public Map<String, Object> timeline(@PathVariable long prj_seq){
        List<Map<String, Object>> mileList = chartService.timelineMile(prj_seq);
        List<Map<String, Object>> taskList = chartService.timelineTask(prj_seq);
        Map<String, Object> result = new HashMap<String, Object>() {{
            put("task", taskList);
            put("mile", mileList);
        }};

                

        return result;
    }

}
