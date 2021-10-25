package com.project.pium.mapper;

import com.project.pium.domain.MilestoneDTO;
import com.project.pium.domain.TaskDTO;
import com.project.pium.domain.TaskmemberDTO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


@Mapper
@Repository
public interface ChartMapper {

    //MileStone Chart
    long countMilestoneStatusZero(long project_seq);
    long countMilestoneStatusOne(long project_seq);
    long countTaskAll(long project_seq);
    long countTaskMine(long project_seq, long projmember_seq, long member_seq);
    long countTaskStatusZero(long project_seq);
    long countTaskStatusOne(long project_seq);
    List<TaskmemberDTO> countMyAllTask(long project_seq);

    //    TimeLine
    List<Map<String,Object>> timelineMile(long project_seq);
    List<Map<String,Object>> timelineTask(long milestone_seq);
}
