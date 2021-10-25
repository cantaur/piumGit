package com.project.pium.service;

import com.project.pium.domain.ProjectmemberDTO;
import org.apache.ibatis.annotations.Param;
import org.springframework.web.bind.annotation.RequestParam;


import java.util.HashMap;
import java.util.List;

public interface ProjectmemberService {

    void updateProfileS(ProjectmemberDTO projectmemberDTO);
    //프로필 사진만 수정
    void updatePicture(ProjectmemberDTO projectmemberDTO);
    //프로필 이름만 수정
    void updateName(HashMap hashMap);
    long findProjMemberSeq(@RequestParam("project_seq")long projSeq, @RequestParam("member_seq")long memSeq);
    ProjectmemberDTO showImage(long projmember_seq);
    //해당 프로젝트의 멤버 리스트
    List<ProjectmemberDTO> allProjMembers(@Param("project_seq") long projSeq);

    void mastergetS(long projmember_seq, long project_seq);
    void excludMaster(long projmember_seq, long project_seq);
    void projectoutS(long project_seq, long projmember_seq);
    void projectexitS(long project_seq, long projmember_seq);
    //해당 프로젝트에 멤버 추가하기
    String insertMember(@Param("project_seq") long projSeq, @Param("member_seq")long memSeq);
    //memberSeq로 이 유저가 이 프로젝트에 포함되어 있는지를 찾는다
    List<ProjectmemberDTO> findProjMember(@Param("project_seq") long projSeq, @Param("member_seq")long memSeq);




}
