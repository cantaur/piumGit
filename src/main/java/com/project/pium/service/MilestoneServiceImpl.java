package com.project.pium.service;

import com.project.pium.domain.MilestoneDTO;
import com.project.pium.domain.NoticeDTO;
import com.project.pium.domain.ProjectmemberDTO;
import com.project.pium.mapper.MilestoneMapper;
import com.project.pium.mapper.NoticeMapper;
import com.project.pium.mapper.ProjectmemberMapper;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Log
@AllArgsConstructor
@Service
public class MilestoneServiceImpl implements MilestoneService {

    private MilestoneMapper milestoneMapper;
    private NoticeMapper noticeMapper;
    private ProjectmemberMapper projectmemberMapper;

    @Override
    public void createMile(MilestoneDTO milestoneDTO) {
        milestoneMapper.createMile(milestoneDTO);

        String no_title = milestoneDTO.getMilestone_title(); //notice_title
        String no_type = "addmile";
        long sender_seq = milestoneDTO.getProjmember_seq(); //notice_sender
        long project_seq = milestoneDTO.getProject_seq();
        long mileSeq = milestoneMapper.lastMileSeq(project_seq);//최신 마일스톤 seq
        List<ProjectmemberDTO> projectmembers = projectmemberMapper.allProMemberSeq(project_seq); //projmember_seq
        NoticeDTO NoDTO = new NoticeDTO();
        log.info("#projectmembers : "+projectmembers);


        for(int i = 0; i < projectmembers.size(); i++){
            NoDTO.setNotice_title(no_title);
            NoDTO.setNotice_type(no_type);
            NoDTO.setNotice_sender(sender_seq);
            NoDTO.setMilestone_seq(mileSeq);
            NoDTO.setProjmember_seq(projectmembers.get(i).getProjmember_seq());
            log.info("#NoDTO : "+NoDTO);
            noticeMapper.mileNotice(NoDTO);
        }


    }
    @Override
    public List<MilestoneDTO> msListBySeq(long proSeq) {
        return milestoneMapper.msListBySeq(proSeq);
    }

    @Override
    public MilestoneDTO findMilestoneByMileSeq(long mileSeq){
        return milestoneMapper.findMilestoneByMileSeq(mileSeq);
    }

    @Override
    public void updateMilestone(MilestoneDTO milestoneDTO) {
        milestoneMapper.updateMilestone(milestoneDTO);
    }

    @Override
    public void setDateEmpty(long mileSeq) {
        milestoneMapper.setDateEmpty(mileSeq);
    }

    @Override
    public int closeMilestone(long mileSeq) {
        return milestoneMapper.closeMilestone(mileSeq);
    }

    @Override
    public int openMilestone(long mileSeq) {
        return milestoneMapper.openMilestone(mileSeq);
    }

    @Override
    public int delMilestone(long mileSeq) {
        return milestoneMapper.delMilestone(mileSeq);
    }


}
