package com.project.pium.controller;

import com.project.pium.domain.FileDTO;
import com.project.pium.domain.TaskcommentDTO;
import com.project.pium.service.DBFileStorageService;
import com.project.pium.service.TaskcommentService;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Log
@RestController
@AllArgsConstructor
public class TaskcommentController {
    private TaskcommentService taskcommentService;
    private DBFileStorageService fileStorageService;

    //코멘트 입력하기 :
    @PostMapping("ajax/taskComment")
    public void insertComment(@RequestBody Map<String,Object> param ) {

        String content = String.valueOf(param.get("comment_content"));
        String members = String.valueOf(param.get("members"));
        Long projmemberSeq = Long.valueOf(String.valueOf(param.get("projmember_seq")));
        Long taskSeq = Long.valueOf(String.valueOf(param.get("task_seq")));
        String isFile = String.valueOf(param.get("isFile"));
        TaskcommentDTO taskcommentDTO = new TaskcommentDTO();
        taskcommentDTO.setComment_content(content);
        taskcommentDTO.setMembers(members);
        taskcommentDTO.setProjmember_seq(projmemberSeq);
        taskcommentDTO.setTask_seq(taskSeq);
        log.info("#Comment insert()" + taskcommentDTO);
        taskcommentService.insertS(taskcommentDTO, isFile);

    }
    
    //해당 업무를 클릭했을때 오른쪽에서 튀어나오는 업무 상세창의 comment 탭을 눌렀을때 나오는 모든 코멘트를 조회
    @GetMapping("ajax/taskComment/{taskSeq}")//업무에 따라 분류
    public ArrayList<Object> selectBySeqS(@PathVariable long taskSeq) {
        ArrayList<Object> commentArray = new ArrayList<>();
        List<TaskcommentDTO> list = taskcommentService.selectBySeqS(taskSeq);
        //결과로 나온 comment 리스트의 file_seq를 뽑아서 comment에 있는 file을 뽑는다


        for(TaskcommentDTO taskcommentDTO : list){
            LinkedHashMap<String, Object> temp = new LinkedHashMap<>();
            FileDTO fileDTO = null;

            if(taskcommentDTO.getFile_seq() != null){
                fileDTO = fileStorageService.getFile(taskcommentDTO.getFile_seq());
                log.info("#fileDTO : "+fileDTO);
            }
            temp.put("comment", taskcommentDTO);
            temp.put("file", fileDTO);
            commentArray.add(temp);
        }
        //log.info("#commentArray : "+commentArray);
        return commentArray;
    }



    // task comment isDel 상태로 변경 _ 마일스톤 참고
    @PostMapping("ajax/taskCmtdelete")
    public void delete(@RequestBody Map<String, Integer> param) {
        Long seq = Long.valueOf(param.get("comment_seq"));
        taskcommentService.deleteS(seq);
    }

    // task comment 수정
    @PostMapping("ajax/taskCmtupdate")
    public void update(@RequestBody TaskcommentDTO taskcommentDTO) {
        log.info("taskcommentDTO" + taskcommentDTO);
        taskcommentService.updateS(taskcommentDTO);
    }
}

