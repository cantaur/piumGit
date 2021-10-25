package com.project.pium.controller;


import com.project.pium.domain.ProjectmemberDTO;
import com.project.pium.service.*;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 프로젝트 멤버 추가 및 관리(완료)
 */


@Log
@RestController
@AllArgsConstructor
public class ProjectmemberController {
    private MemberService memberService;
    private ProjectmemberService projectmemberService;


    //현재 로그인한 유저의 세션값 얻어오는 로직 모듈화
    public String currentUserName(Principal principal){
        if(principal ==null){
            return "false";
        }else{
            String sessionEmail = principal.getName();
            return sessionEmail;
        }
    }

    //프로젝트멤버 프로필 변경
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/ajax/updateProfile")
    public String updateProfile(@RequestParam(value="project_seq") Integer projSeq,
                                @RequestParam(value="projmember_image", required = false) MultipartFile file,
                                @RequestParam(value="projmember_name") String name,
                                Principal principal) throws Exception {
        log.info("들어오는것ㅎ ㅘㄱ인러ㅏㅇ러ㅣ : "+file+", "+name);
        //1. 접속한 유저 이메일로 memberSeq 찾음
        String email= currentUserName(principal);
        long sessionSeq = memberService.findUserNo(email);

        //3. projectSeq와 memberSeq로 project_member seq 찾음
        long projMemberSeq = projectmemberService.findProjMemberSeq(projSeq,sessionSeq);
        ProjectmemberDTO projectmemberDTO = new ProjectmemberDTO();

        //4. 집어넣음?
        if(file !=null && name !=null){
            projectmemberDTO = new ProjectmemberDTO(projMemberSeq, null,name,
                    file.getOriginalFilename(),
                    file.getContentType(),
                    file.getBytes(),-1,-1,null);
            projectmemberService.updateProfileS(projectmemberDTO);
        }else if(file !=null){
            projectmemberDTO = new ProjectmemberDTO(projMemberSeq, null,null,
                    file.getOriginalFilename(),
                    file.getContentType(),
                    file.getBytes(),-1,-1,null);
            projectmemberService.updatePicture(projectmemberDTO);
        }else if(name !=null){
            HashMap<String,Object> map = new HashMap<String,Object>();
            map.put("projmember_name", name);
            map.put("projmember_seq", projMemberSeq);
            projectmemberService.updateName(map);

        }

        //5. 일단 업데이트로 감?

        return "success";
    }


    //프로필 이미지 확인 성고오오오옹
    @GetMapping("/ajax/profile/{id}")
    public ResponseEntity<byte[]> findOne(@PathVariable long id) {
        ProjectmemberDTO projectmemberDTO = projectmemberService.showImage(id);
        log.info("마임타입이 뭐냐고"+projectmemberDTO.getProjmember_filetype());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", projectmemberDTO.getProjmember_filetype());
        headers.add("Content-Length", String.valueOf(projectmemberDTO.getProjmember_data().length));

        return new ResponseEntity<byte[]>(projectmemberDTO.getProjmember_data(), headers, HttpStatus.OK);
    }
    
    
//추가, 겹치지않게 백업해두셈


    //이 프로젝트에 참여한 모든 멤버의 정보
    //projmember_type, projmember_name, projmember_data, member_email
    @GetMapping("/ajax/allProjMembers/{project_seq}")
    public List<ProjectmemberDTO> projMembers(@PathVariable long project_seq){
        List<ProjectmemberDTO> memList = projectmemberService.allProjMembers(project_seq);
        return memList;
    }

    //관리자 권한 주기
    @PostMapping("/ajax/masterUpdate")
    public void masterget(@RequestBody Map<String, Integer> param){
        Long project_seq = Long.valueOf(param.get("project_seq"));
        Long projmember_seq = Long.valueOf(param.get("projmember_seq"));
        projectmemberService.mastergetS(projmember_seq, project_seq);
    }

    //관리자 권한 상실
    @PostMapping("/ajax/masterExclude")
    public void masterExclude(@RequestBody Map<String, Integer> param){
        Long project_seq = Long.valueOf(param.get("project_seq"));
        Long projmember_seq = Long.valueOf(param.get("projmember_seq"));
        projectmemberService.excludMaster(projmember_seq, project_seq);
    }


    //프로젝트 멤버 강퇴
    @PostMapping("/ajax/projectout")
    public void projectout(@RequestBody Map<String, Integer> param){
        Long project_seq = Long.valueOf(param.get("project_seq"));
        Long projmember_seq = Long.valueOf(param.get("projmember_seq"));
        projectmemberService.projectoutS(project_seq, projmember_seq);
    } //Postman으로 테스트 완료


    //프로젝트에 새 멤버 초대
    //이상한 이메일 들어오거나 멤버테이블에 없으면 클라이언트쪽에 fail 보내고
    //이메일 있으면 해당 프로젝트에 멤버로 추가되어 있는지 확인해서 있으면 duplicated 반환, 없으면 insert 진행
    @PostMapping("/ajax/inviteProject")
    public String inviteProject(@RequestBody Map<String,Object> param){
        String temp= (String)param.get("project_seq");
        long projSeq = Long.parseLong(temp);
        String email = String.valueOf(param.get("member_email"));
        log.info("projSeq : "+projSeq+", email : "+email);
        //이미 가입한 이메일이 있는지부터 확인
        String flag = memberService.chkUser(email);
        if(flag!=null){
            long memSeq = memberService.findUserNo(email);
            String msg= projectmemberService.insertMember(projSeq,memSeq);
            if(msg.equals("success")){
                return "success";
            }else{
                return "duplicated";
            }
        }else{
            return "fail";
        }
    }


















}
