package com.project.pium.mapper;

import com.project.pium.domain.MemberDTO;
import com.project.pium.domain.MilestoneDTO;
import com.project.pium.domain.ProjectDTO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface MilestoneMapper {
    //마일스톤 생성
    void createMile(MilestoneDTO milestoneDTO);
    //해당 프로젝트에서 생성된 전체 마일스톤 리스트
    List<MilestoneDTO> msListBySeq(long proSeq);
    //마일스톤 상세페이지
    MilestoneDTO findMilestoneByMileSeq(long mileSeq);
    //마일스톤 전체 수정
    void updateMilestone(MilestoneDTO milestoneDTO);
    //마일스톤 date들 null로 셋팅
    void setDateEmpty(long mileSeq);
    //마감상태(완료) 변경
    int closeMilestone(long mileSeq);
    //마감상태(재오픈) 변경
    int openMilestone(long mileSeq);
    //isdel
    int delMilestone(long mileSeq);

    //최신 마일스톤seq
    long lastMileSeq(long project_seq);






}