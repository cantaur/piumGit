package com.project.pium.service;

import com.project.pium.domain.TaskmemberDTO;

import java.util.List;

public interface TaskmemberService {

    //마일스톤 페이지(지우면 안됨) : 업무당 배정된 멤버
    List<TaskmemberDTO> selectByTaskSeq(long task_seq); // 업무 번호로 조회




}
