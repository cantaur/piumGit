package com.project.pium.service;

import com.project.pium.domain.TaskmemberDTO;
import com.project.pium.mapper.TaskmemberMapper;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;

import java.util.List;
@Log
@AllArgsConstructor
@Service
public class TaskmemberServiceImpl implements TaskmemberService{
    private TaskmemberMapper mapper;

    //마일스톤 페이지(지우면 안됨) : 업무당 배정된 멤버
    @Override
    public List<TaskmemberDTO> selectByTaskSeq(long task_seq) {
        return mapper.selectByTaskSeq(task_seq);
    }


}
