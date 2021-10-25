package com.project.pium.mapper;

import com.project.pium.domain.TaskcommentDTO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface TaskcommentMapper {

    //해당 업무를 클릭했을때 오른쪽에서 튀어나오는 업무 상세창의 comment 탭을 눌렀을때 나오는 모든 코멘트를 조회
    List<TaskcommentDTO> selectBySeq(long seq);
    //task insertComment
    void insert(TaskcommentDTO task);
    // task comment isdel 상태로 변경
    void delete(long seq);
    // task comment 수정
    void update(TaskcommentDTO task);
}
