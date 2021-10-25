package com.project.pium.service;

import com.project.pium.domain.ProjectmemberDTO;
import com.project.pium.email.EmailSenderService;
import com.project.pium.mapper.ProjectMapper;
import com.project.pium.mapper.ProjectmemberMapper;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
@Log
@AllArgsConstructor
@Service

public class ProjectmemberServiceImpl implements ProjectmemberService  {
    private ProjectmemberMapper projectmemberMapper;
    @Autowired
    private EmailSenderService emailSenderService;

    //프로필 수정
    @Override
    public void updateProfileS(ProjectmemberDTO projectmemberDTO){
        projectmemberMapper.updateProfile(projectmemberDTO);
    }

    @Override
    public void updatePicture(ProjectmemberDTO projectmemberDTO) {
        projectmemberMapper.updatePicture(projectmemberDTO);
    }

    @Override
    public void updateName(HashMap hashMap) {
        projectmemberMapper.updateName(hashMap);
    }

    //프로젝트seq와 멤버seq로 프로젝트멤버 seq 찾기
    @Override
    public long findProjMemberSeq(long projSeq, long memSeq) {
        return projectmemberMapper.findProjMemberSeq(projSeq,memSeq);
    }

    @Override
    public ProjectmemberDTO showImage(long projmember_seq) {
        return projectmemberMapper.showImage(projmember_seq);
    }

    //해당 프로젝트의 멤버 리스트
    @Override
    public List<ProjectmemberDTO> allProjMembers(long projSeq) {
        return projectmemberMapper.allProjMembers(projSeq);
    }

    //프로젝트 관리자 권한 주기
    @Override
    public void mastergetS(long projmember_seq, long project_seq) {
        projectmemberMapper.masterget(projmember_seq, project_seq);
    }

    //프로젝트 관리자 권한 상실
    @Override
    public void excludMaster(long projmember_seq, long project_seq) {
        projectmemberMapper.excludMaster(projmember_seq, project_seq);
    }

    //프로젝트 강퇴
    @Override
    public void projectoutS(long project_seq, long projmember_seq) {
        projectmemberMapper.projectout(project_seq, projmember_seq);
    }

    //프로젝트 나가기
    @Override
    public void projectexitS(long project_seq, long projmember_seq) {
        projectmemberMapper.projectexit(project_seq, projmember_seq);
    }

    //해당 프로젝트에 멤버 추가하기
    @Override
    public String insertMember(long projSeq, long memSeq) {
        List<ProjectmemberDTO> list = findProjMember(projSeq,memSeq);
        if(list.size()==0){ //프로젝트멤버 insert 진행
            int temp = projectmemberMapper.insertMember(projSeq,memSeq);
            return "success";
        }else{
            return "duplicated";
        }
    }

    //memberSeq로 이 유저가 이 프로젝트에 포함되어 있는지를 찾는다
    @Override
    public List<ProjectmemberDTO> findProjMember(long projSeq, long memSeq) {
        return projectmemberMapper.findProjMember(projSeq,memSeq);
    }


}
