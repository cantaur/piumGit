package com.project.pium.service;

import com.project.pium.domain.TaskDTO;
import com.project.pium.domain.TodoDTO;

import java.util.List;

public interface TodoService {

    /*조회*/
    List<TodoDTO>todoBySeqS(long seq);
    List<TodoDTO>progressBySeqS(long seq);
    List<TodoDTO>doneBySeqS(long seq);

    /*드롭박스*/
    List<TaskDTO> showTaskByProjSeqS(long seq);

    void insertNoteS(TodoDTO todoDTO); // 메모 생성
    void updateNoteS(TodoDTO todoDTO); // 메모 수정
    void updateNoteStatusS(TodoDTO todoDTO); // 메모 상태이동
    void deleteNoteS(long todo_seq); // 메모 삭제


}
