package com.project.pium.controller;

import com.project.pium.domain.LabelDTO;
import com.project.pium.domain.MilestoneDTO;
import com.project.pium.domain.TaskDTO;
import com.project.pium.domain.TaskmemberDTO;
import com.project.pium.service.*;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

/**
 * 마일스톤 관리 페이지 (완료)
 */



@Log
@RestController
@AllArgsConstructor
public class MilestoneController {

    private MilestoneService milestoneService;
    private MemberService memberService;
    private ProjectmemberService projectmemberService;
    private TaskService taskService;
    private TaskmemberService taskmemberService;

    //현재 로그인한 유저의 세션값 얻어오는 로직 모듈화
    public String currentUserName(Principal principal){
        if(principal ==null){
            return "false";
        }else{
            String sessionEmail = principal.getName();
            return sessionEmail;
        }
    }

    //마일스톤 생성하기
    @PostMapping("/ajax/createMileStone")
    public String createMile(@RequestBody MilestoneDTO milestoneDTO, Principal principal){

        long projSeq= milestoneDTO.getProject_seq();

        //1. 접속한 유저 이메일로 memberSeq 찾음
        String email= currentUserName(principal);
        long sessionSeq = memberService.findUserNo(email);

        //2. projectSeq와 memberSeq로 project_member seq 찾음
        long projMemberSeq = projectmemberService.findProjMemberSeq(projSeq,sessionSeq);
        milestoneDTO.setProjmember_seq(projMemberSeq);
        milestoneService.createMile(milestoneDTO);
        return "success";
    }
    

    //해당 프로젝트에서 생성된 전체 마일스톤 리스트 보여주기
    @GetMapping("/ajax/{projSeq}/milestonelist")
    public ArrayList<Object> msList(@PathVariable long projSeq){
        
        List<MilestoneDTO> milestoneList = milestoneService.msListBySeq(projSeq);
        
        // MilestoneDTO 말고도 (종료된 업무갯수/생성된 업무갯수) 도 보내줘야 하기 때문에 
        // for문을 돌려서 담은 Map 배열을 ArrayList에 넣어 반환한다
        
        MilestoneDTO milestoneDTO = null; //get메소드로 dto에 담긴 값을 받아오기 위해 초기화
        ArrayList<Object> mileInfo = new ArrayList<>();

        for (MilestoneDTO dto : milestoneList) {
            LinkedHashMap<String, Object> tempMile = new LinkedHashMap<>(); //
            milestoneDTO = dto;
            long mileSeq = milestoneDTO.getMilestone_seq();
            int countTask = taskService.countTask(mileSeq); //해당 마일스톤에서 생성된 업무의 갯수
            int closedTask = taskService.countClosedTask(mileSeq); //종료된 업무의 갯수
            tempMile.put("countTask", countTask);
            tempMile.put("closedTask", closedTask);
            tempMile.put("milestone_seq", mileSeq);
            tempMile.put("milestone_title", milestoneDTO.getMilestone_title());
            tempMile.put("milestone_content", milestoneDTO.getMilestone_content());
            tempMile.put("milestone_status", milestoneDTO.getMilestone_status());
            tempMile.put("milestone_isdelete", milestoneDTO.getMilestone_isdelete());
            tempMile.put("milestone_startdate", milestoneDTO.getMilestone_startdate());
            tempMile.put("milestone_duedate", milestoneDTO.getMilestone_duedate());
            //tempMile.put("milestone_enddate", milestoneDTO.getMilestone_enddate());
            tempMile.put("projmember_seq", milestoneDTO.getProjmember_seq());
            //tempMile.put("project_seq", milestoneDTO.getProject_seq());
            mileInfo.add(tempMile);
        }

        return mileInfo;

    }

    //마일스톤 눌러서 들어갔을 때 나오는 마일스톤 상세정보 보여주기
    @GetMapping("/ajax/milestone/{mileSeq}")
    public LinkedHashMap<String, Object> msListDesc(@PathVariable long mileSeq){
        LinkedHashMap<String, Object> mileDetail = new LinkedHashMap<>();
        MilestoneDTO milestoneDTO = milestoneService.findMilestoneByMileSeq(mileSeq);

        int countTask = taskService.countTask(mileSeq);
        int closedTask = taskService.countClosedTask(mileSeq);
        mileDetail.put("countTask",countTask);
        mileDetail.put("closedTask",closedTask);
        mileDetail.put("milestone_seq",milestoneDTO.getMilestone_seq());
        mileDetail.put("milestone_title",milestoneDTO.getMilestone_title());
        mileDetail.put("milestone_content",milestoneDTO.getMilestone_content());
        mileDetail.put("milestone_status",milestoneDTO.getMilestone_status());
        mileDetail.put("milestone_startdate",milestoneDTO.getMilestone_startdate());
        mileDetail.put("milestone_duedate",milestoneDTO.getMilestone_duedate());
        mileDetail.put("milestone_enddate",milestoneDTO.getMilestone_enddate());
        mileDetail.put("projmember_seq",milestoneDTO.getProjmember_seq());

        return mileDetail;
    }

    //마일스톤 상세페이지>업무 리스트
    @GetMapping("/ajax/milestone/{mileSeq}/tasks")
    public ArrayList<Object> taskInMilestone(@PathVariable long mileSeq){

        //해당 마일스톤에서 생성된 업무 조회
        List<TaskDTO> tasks = taskService.taskListByMile(mileSeq);
        ArrayList<Object> mileInfo = new ArrayList<>();

        for(TaskDTO taskDTO1 : tasks){
            LinkedHashMap<String,Object> tempTask = new LinkedHashMap<>();

            //결과로 나온 업무리스트의 label_seq를 뽑아서 업무에 있는 label_title을 뽑는다
            //LabelDTO labelDTO = taskService.findLabelTitle(taskDTO1.getLabel_seq());

            //결과로 나온 업무리스트에서 task_seq를 뽑아서 업무당 배정된 멤버를 뽑아와서 새 배열에 넣는다.
            List<TaskmemberDTO> taskmemberDTOS= taskmemberService.selectByTaskSeq(taskDTO1.getTask_seq());

            tempTask.put("task",taskDTO1);
            tempTask.put("taskMembers",taskmemberDTOS);
            //tempTask.put("label", labelDTO);


            mileInfo.add(tempTask);
        }
        log.info("#mileInfo : "+mileInfo);
        return mileInfo;
    }


    //마일스톤 상세페이지>업무 리스트>진행중인 업무
    @GetMapping("/ajax/milestone/{mileSeq}/taskOpend")
    public ArrayList<Object> openTaskInMile(@PathVariable long mileSeq){

        //해당 마일스톤에서 생성된 업무 조회
        List<TaskDTO> tasks = taskService.openTaskListByMile(mileSeq);
        ArrayList<Object> mileInfo = new ArrayList<>();

        for(TaskDTO taskDTO1 : tasks){
            LinkedHashMap<String,Object> tempTask = new LinkedHashMap<>();

            //결과로 나온 업무리스트의 label_seq를 뽑아서 업무에 있는 label_title을 뽑는다
            //LabelDTO labelDTO = taskService.findLabelTitle(taskDTO1.getLabel_seq());

            //결과로 나온 업무리스트에서 task_seq를 뽑아서 업무당 배정된 멤버를 뽑아와서 새 배열에 넣는다.
            List<TaskmemberDTO> taskmemberDTOS= taskmemberService.selectByTaskSeq(taskDTO1.getTask_seq());

            tempTask.put("task",taskDTO1);
            tempTask.put("taskMembers",taskmemberDTOS);
            //tempTask.put("label", labelDTO);
            mileInfo.add(tempTask);
        }
        return mileInfo;
    }


    //마일스톤 상세페이지>업무 리스트>마감된 업무
    @GetMapping("/ajax/milestone/{mileSeq}/taskClosed")
    public ArrayList<Object> closedTaskInMile(@PathVariable long mileSeq){

        //해당 마일스톤에서 생성된 업무 조회
        List<TaskDTO> tasks = taskService.closedTaskListByMile(mileSeq);
        ArrayList<Object> mileInfo = new ArrayList<>();

        for(TaskDTO taskDTO1 : tasks){
            LinkedHashMap<String,Object> tempTask = new LinkedHashMap<>();

            //결과로 나온 업무리스트의 label_seq를 뽑아서 업무에 있는 label_title을 뽑는다
            //LabelDTO labelDTO = taskService.findLabelTitle(taskDTO1.getLabel_seq());

            //결과로 나온 업무리스트에서 task_seq를 뽑아서 업무당 배정된 멤버를 뽑아와서 새 배열에 넣는다.
            List<TaskmemberDTO> taskmemberDTOS= taskmemberService.selectByTaskSeq(taskDTO1.getTask_seq());

            tempTask.put("task",taskDTO1);
            tempTask.put("taskMembers",taskmemberDTOS);
            //tempTask.put("label", labelDTO);
            mileInfo.add(tempTask);
        }
        return mileInfo;
    }



    //마일스톤 수정(제목,설명,달력)
    @PostMapping("/ajax/updateMileStone")
    public void updateMileStone(@RequestBody MilestoneDTO milestoneDTO){
        milestoneService.updateMilestone(milestoneDTO);
    }

    //마일스톤 캘린더 비우기(get으로 milestone_seq 주면 date에 null 셋팅)
    @GetMapping("/ajax/setDateEmpty/{mileSeq}")
    public void setDateEmpty(@PathVariable long mileSeq){
        milestoneService.setDateEmpty(mileSeq);
    }


    // 마일스톤 완료상태로 전환
    @PostMapping("/ajax/closeMileStone")
    public void closeMileStone(@RequestBody Map<String,Integer> param){
        Long mileSeq= Long.valueOf(param.get("milestone_seq"));
        milestoneService.closeMilestone(mileSeq);
    }

    // 마일스톤 오픈상태로 전환
    @PostMapping("/ajax/openMileStone")
    public void openMileStone(@RequestBody Map<String,Integer> param){
        Long mileSeq= Long.valueOf(param.get("milestone_seq"));
        milestoneService.openMilestone(mileSeq);
    }


    // 마일스톤 삭제상태로 전환
    @PostMapping("/ajax/deleteMileStone")
    public void deleteMileStone(@RequestBody Map<String,Integer> param){
        Long mileSeq= Long.valueOf(param.get("milestone_seq"));
        milestoneService.delMilestone(mileSeq);
    }




}

