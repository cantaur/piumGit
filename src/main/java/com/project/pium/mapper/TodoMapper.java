package com.project.pium.mapper;

import com.project.pium.domain.TaskDTO;
import com.project.pium.domain.TodoDTO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Mapper
@Repository
public interface TodoMapper {

    /*조회*/
    List<TodoDTO>todoBySeq(long seq);
    List<TodoDTO>progressBySeq(long seq);
    List<TodoDTO>doneBySeq(long seq);

    /*드롭박스*/
    List<TaskDTO> showTaskByProjSeq(long seq);


    void insertNote(TodoDTO todoDTO); // 메모 생성
    void updateNote(TodoDTO todoDTO); // 메모 수정
    void updateNoteStatus(TodoDTO todoDTO); // 메모 상태이동
    void deleteNote(long todo_seq); // 메모 삭제


}
