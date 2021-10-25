package com.project.pium.service;

import com.project.pium.domain.MilestoneDTO;
import com.project.pium.domain.ProjectDTO;

import java.util.List;

public interface MilestoneService {
    void createMile(MilestoneDTO milestoneDTO);
    List<MilestoneDTO>msListBySeq(long proSeq);
    MilestoneDTO findMilestoneByMileSeq(long mileSeq);
    void updateMilestone(MilestoneDTO milestoneDTO);
    //마일스톤 date들 null로 셋팅
    void setDateEmpty(long mileSeq);
    //완료상태로 변경
    int closeMilestone(long mileSeq);
    //마감상태(재오픈) 변경
    int openMilestone(long mileSeq);
    //isdel
    int delMilestone(long mileSeq);









}

