package com.project.pium.service;

import com.project.pium.domain.MilestoneDTO;
import com.project.pium.domain.TaskDTO;
import com.project.pium.domain.TaskmemberDTO;
import com.project.pium.mapper.ChartMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@AllArgsConstructor
public class ChartServiceImpl implements ChartService {
    private ChartMapper chartMapper;

    @Override
    public long countMilestoneStatusZeroS(long project_seq) {
        return chartMapper.countMilestoneStatusZero(project_seq);
    }

    @Override
    public long countMilestoneStatusOneS(long project_seq) {
        return chartMapper.countMilestoneStatusOne(project_seq);
    }

    @Override
    public long countTaskAll(long project_seq) {
        return chartMapper.countTaskAll(project_seq);
    }

    @Override
    public long countTaskMine(long project_seq, long projectMember_seq, long memberSeq) {
        return chartMapper.countTaskMine(project_seq, projectMember_seq, memberSeq);
    }

    @Override
    public long countTaskStatusZero(long project_seq) {
        return chartMapper.countTaskStatusZero(project_seq);
    }

    @Override
    public long countTaskStatusOne(long project_seq) {
        return chartMapper.countTaskStatusOne(project_seq);
    }

    @Override
    public List<TaskmemberDTO> countMyAllTask(long project_seq) {
        return chartMapper.countMyAllTask(project_seq);
    }

    // timeline
    @Override
    public List<Map<String,Object>> timelineMile(long project_seq) {
        return chartMapper.timelineMile(project_seq);
    }
    @Override
    public List<Map<String,Object>> timelineTask(long milestone_seq) {
        return chartMapper.timelineTask(milestone_seq);
    }
}
