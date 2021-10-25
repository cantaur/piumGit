package com.project.pium.service;

import com.project.pium.domain.TaskcommentDTO;

import java.util.List;

public interface TaskcommentService {

    //해당 업무를 클릭했을때 오른쪽에서 튀어나오는 업무 상세창의 comment 탭을 눌렀을때 나오는 모든 코멘트를 조회
    List<TaskcommentDTO> selectBySeqS(long taskComment_seq);
    //insertComment
    void insertS(TaskcommentDTO task, String isFile);
    //isDel
    void deleteS(long seq);
    //taskComment 수정
    void updateS(TaskcommentDTO task);
}
