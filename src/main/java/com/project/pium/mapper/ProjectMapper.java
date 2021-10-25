package com.project.pium.mapper;

import com.project.pium.domain.ProjectDTO;
import com.project.pium.domain.ProjectmemberDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface ProjectMapper {
    //유저가 참여중인 프로젝트
    List<ProjectDTO> myProject(long memberSeq);
    //유저가 참여중인 프로젝트 리스트+프로젝트 멤버 타입
    List<ProjectDTO> myProjectJoin(long memberSeq);
    //프로젝트 생성
    void insertProject(ProjectDTO projectDTO);
    //프로젝트 생성 시 프로젝트 멤버 테이블에 관리자 셋팅
    int insertManager(@Param("project_seq") long projSeq, @Param("member_seq") long memSeq);
    //프로젝트 seq 검색
    long findSeq();
    //프로젝트를 완료상태로 전환
    int closeProject(long projSeq);
    //프로젝트를 진행상태로 전환
    int openProject(long projSeq);
    //프로젝트 삭제상태 업데이트
    int updateIsdelete(long projSeq);
    //프로젝트 수정
    void updateProject(ProjectDTO projectDTO);



}
