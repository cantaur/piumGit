package com.project.pium.service;

import com.project.pium.domain.ProjectDTO;

import java.util.List;

public interface ProjectService {
    List<ProjectDTO> myProject(long memberSeq);
    String insertProject(ProjectDTO projectDTO);
    //프로젝트를 완료상태로 전환
    int closeProject(long projSeq);
    //프로젝트를 진행상태로 전환
    int openProject(long projSeq);
    //프로젝트 삭제상태 업데이트
    int updateIsdelete(long projSeq);
    //프로젝트 수정
    void updateProject(ProjectDTO projectDTO);

}
