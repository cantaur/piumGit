package com.project.pium.mapper;

import com.project.pium.domain.ProjectmemberDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Mapper
@Repository
public interface ProjectmemberMapper {
    //프로필 수정
    void updateProfile(ProjectmemberDTO projectmemberDTO);
    //프로필 사진만 수정
    void updatePicture(ProjectmemberDTO projectmemberDTO);
    //프로필 이름만 수정
    void updateName(HashMap hashMap);
    //프로젝트seq와 멤버seq로 프로젝트멤버 seq 찾기
    long findProjMemberSeq(@Param("project_seq") long projSeq, @Param("member_seq")long memSeq);
    //프로젝트멤버 이미지 조회
    ProjectmemberDTO showImage(long projmember_seq);
    //해당 프로젝트의 멤버 리스트
    List<ProjectmemberDTO> allProjMembers(@Param("project_seq") long projSeq);

    //프로젝트 관리자 권한 주기
    void masterget(long projmember_seq, long project_seq);
    //프로젝트 관리자 권한 상실
    void excludMaster(long projmember_seq, long project_seq);
    //프로젝트 강퇴
    void projectout(long project_seq, long projmember_seq);
    //프로젝트 나가기
    void projectexit(long project_seq, long projmember_seq);

    //해당 프로젝트에 멤버 추가하기
    int insertMember(@Param("project_seq") long projSeq, @Param("member_seq")long memSeq);
    
    //memberSeq로 이 유저가 이 프로젝트에 포함되어 있는지를 찾는다
    List<ProjectmemberDTO> findProjMember(@Param("project_seq") long projSeq, @Param("member_seq")long memSeq);

    //플젝seq로 전체 플젝멤버 seq받기
    List<ProjectmemberDTO> allProMemberSeq(long project_seq);



}
