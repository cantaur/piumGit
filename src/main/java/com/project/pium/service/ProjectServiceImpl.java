package com.project.pium.service;

import com.project.pium.domain.ProjectDTO;
import com.project.pium.mapper.ProjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Log
@AllArgsConstructor
@Service
public class ProjectServiceImpl implements ProjectService {

    private ProjectMapper projectMapper;

    //로그인한 유저가 참여 중인 모든 프로젝트 리스트
    @Override
    public List<ProjectDTO> myProject(long memberSeq) {
        return projectMapper.myProjectJoin(memberSeq);
    }

    //프로젝트 테이블과 프로젝트멤버 테이블에 동시에 인서트 되지 않으면 테이블에 추가되지 않도록 트랜젝션 처리
    @Override
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = {Exception.class})
    public String insertProject(ProjectDTO projectDTO){
        log.info("#프로젝트생성중: "+projectDTO);
        projectMapper.insertProject(projectDTO);
        long memSeq = projectDTO.getMember_seq();
        log.info("memSeq"+memSeq);
        long lastProjSeq = projectMapper.findSeq();
        log.info("#last: "+lastProjSeq);
        int flag= projectMapper.insertManager(lastProjSeq,memSeq);
        if(flag ==1){
            return "success";
        }else{
            return "fail";
        }
    }

    //프로젝트 수정
    @Override
    public void updateProject(ProjectDTO projectDTO) {
        projectMapper.updateProject(projectDTO);
    }

    //프로젝트를 완료상태로 전환
    @Override
    public int closeProject(long projseq) {
        int flag= projectMapper.closeProject(projseq);
        return flag;
    }
    //프로젝트를 진행상태로 전환
    @Override
    public int openProject(long projSeq) {
        int flag = projectMapper.openProject(projSeq);
        return flag;
    }

    //프로젝트를 삭제상태로 전환
    @Override
    public int updateIsdelete(long projSeq) {
        int flag = projectMapper.updateIsdelete(projSeq);
        log.info("삭제했나"+flag);
        return flag;
    }














}
