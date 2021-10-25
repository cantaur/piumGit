package com.project.pium.controller;

import com.project.pium.domain.TaskDTO;
import com.project.pium.domain.TodoDTO;
import com.project.pium.service.TodoService;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 내 업무 > to do 페이지(완료)
 */


@Log
@RestController
@AllArgsConstructor
public class TodoController {
    private TodoService todoService;



    //to do 메모 생성
    @PostMapping("/ajax/createTodo")
    public String insertNote(@RequestBody TodoDTO todoDTO){
        todoService.insertNoteS(todoDTO);
        return "success";
    }

    //task 생성 시 드랍박스 안에 보여질 task 제목 등 정보 불러오기
    @GetMapping("/ajax/showTaskinTodo/{projectSeq}")
    public List<TaskDTO> showTaskinTodo(@PathVariable long projectSeq){
        List<TaskDTO> list = todoService.showTaskByProjSeqS(projectSeq);
        return list;
    }

    //내가 생성한 to do list. 상태값별로 나누어서
    @GetMapping("/ajax/mytodo/{projMemberSeq}")
    public ArrayList<Object> todoListProjmem(@PathVariable long projMemberSeq){
        ArrayList<Object> todolistInfo = new ArrayList<>();
        LinkedHashMap<String,Object> tempTodo = new LinkedHashMap<>();

        List<TodoDTO> todoList = todoService.todoBySeqS(projMemberSeq);
        List<TodoDTO> progressList = todoService.progressBySeqS(projMemberSeq);
        List<TodoDTO> doneList = todoService.doneBySeqS(projMemberSeq);

        tempTodo.put("todoList", todoList);
        tempTodo.put("progressList", progressList);
        tempTodo.put("doneList", doneList);

        todolistInfo.add(tempTodo);

        return todolistInfo;
    }



    //메모 삭제하기
    @PostMapping("/ajax/deleteTodo")
    public void deleteNote(@RequestBody Map<String, Integer> param){
        Long todoSeq = Long.valueOf(param.get("todo_seq"));
        todoService.deleteNoteS(todoSeq);
    }

    //메모 수정하기
    @PostMapping("/ajax/updateTodo")
    public void updateNote(@RequestBody TodoDTO todoDTO){
        log.info("#updateTodo: " + todoDTO);
        todoService.updateNoteS(todoDTO);
    }


    //메모의 상태 변경하기
    @PostMapping("/ajax/changeTodoStatus")
    public void changeTodoStatus(@RequestBody Map<String, Integer> param){
        String todo_status = String.valueOf(param.get("todo_status"));
        Long todo_seq = Long.valueOf(param.get("todo_seq"));
        log.info("메모상태변경하기 : "+todo_status+", "+todo_seq);
        TodoDTO todoDTO = new TodoDTO();
        todoDTO.setTodo_status(todo_status);
        todoDTO.setTodo_seq(todo_seq);
        todoService.updateNoteStatusS(todoDTO);


    }





















}
