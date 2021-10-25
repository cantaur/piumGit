package com.project.pium.controller;

import com.project.pium.domain.ProjectDTO;
import com.project.pium.service.MemberService;
import com.project.pium.service.ProjectService;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 * 프로젝트 선택 페이지 (완료)
 * 프로젝트 생성, 수정 관리
 */

@Log
@RestController
@AllArgsConstructor
public class ProjectController {

    private ProjectService projectService;
    private MemberService memberService;


    //현재 로그인한 유저의 세션값 얻어오는 로직 모듈화
    public String currentUserName(Principal principal){
        if(principal ==null){
            return "false";
        }else{
            String sessionEmail = principal.getName();
            return sessionEmail;
        }
    }

    //새 프로젝트 만들기
    @PostMapping("/ajax/createProject")
    public String createProject(@RequestBody ProjectDTO projectDTO, Principal principal){
        String email= currentUserName(principal);
        long sessionSeq = memberService.findUserNo(email);
        projectDTO.setMember_seq(sessionSeq);

        String msg= projectService.insertProject(projectDTO);
        if(msg.equals("success")){
            return "success";
        }else {
            return "fail";
        }
    }

    //프로젝트를 완료상태로 전환
    @PostMapping("/ajax/closeProject")
    public void closeProject(@RequestBody Map<String,Integer> param){
        Long projSeq= Long.valueOf(param.get("project_seq"));
        projectService.closeProject(projSeq);
    }

    //프로젝트를 진행상태로 전환
    @PostMapping("/ajax/openProject")
    public void openProject(@RequestBody Map<String,Integer> param){
        Long projSeq= Long.valueOf(param.get("project_seq"));
        projectService.openProject(projSeq);
    }

    //프로젝트를 삭제상태로 전환
    @PostMapping("/ajax/deleteProject")
    public void updateIsdelete(@RequestBody Map<String,Integer> param){
        Long projSeq= Long.valueOf(param.get("project_seq"));
        projectService.updateIsdelete(projSeq);
    }



    //로그인한 유저가 참여 중인 모든 프로젝트 리스트
    @GetMapping ("/ajax/myproject")
    public List<ProjectDTO> myProject(Principal principal){
        String email= currentUserName(principal);
        long sessionSeq = memberService.findUserNo(email);
        List<ProjectDTO> myProject = projectService.myProject(sessionSeq);
        return myProject;
    }

    //로그인한 유저가 참여 중인 모든 프로젝트 리스트
    @GetMapping ("/ajax/myprojectTest/{memberSeq}")
    public List<ProjectDTO> myProjectTest(@PathVariable long memberSeq){

        List<ProjectDTO> myProject = projectService.myProject(memberSeq);
        return myProject;
    }



    //프로젝트 수정 버튼 눌렀을 때 수행되는 메소드
    @PostMapping("/ajax/updateProject")
    public void updateProject(@RequestBody ProjectDTO projectDTO){
        projectService.updateProject(projectDTO);
    }


    





}
