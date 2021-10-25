package com.project.pium.mapper;

import com.project.pium.domain.TaskmemberDTO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface TaskmemberMapper {
    long lastTaskSeq();

    List<TaskmemberDTO> selectByTaskSeq(long task_seq); // 업무 번호로 조회


}
