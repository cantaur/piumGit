package com.project.pium.service;

import com.project.pium.domain.TaskDTO;
import com.project.pium.domain.TodoDTO;
import com.project.pium.mapper.TodoMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class TodoServiceImpl implements TodoService {
    private TodoMapper todoMapper;



    @Override
    public List<TodoDTO> todoBySeqS(long seq) {return todoMapper.todoBySeq(seq);}
    @Override
    public List<TodoDTO>progressBySeqS(long seq){
        return todoMapper.progressBySeq(seq);
    }
    @Override
    public List<TodoDTO>doneBySeqS(long seq){
        return todoMapper.doneBySeq(seq);
    }



    @Override
    public List<TaskDTO> showTaskByProjSeqS(long seq){return todoMapper.showTaskByProjSeq(seq);}


    @Override
    public void insertNoteS(TodoDTO todoDTO) {
        todoMapper.insertNote(todoDTO);
    }


    @Override
    public void updateNoteS(TodoDTO todoDTO) {
        todoMapper.updateNote(todoDTO);
    }

    @Override
    public void updateNoteStatusS(TodoDTO todoDTO) {
        todoMapper.updateNoteStatus(todoDTO);

    }

    @Override
    public void deleteNoteS(long todo_seq) {
        todoMapper.deleteNote(todo_seq);
    }

}
