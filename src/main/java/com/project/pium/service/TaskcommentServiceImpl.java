package com.project.pium.service;

import com.project.pium.domain.NoticeDTO;
import com.project.pium.domain.TaskcommentDTO;
import com.project.pium.mapper.FileMapper;
import com.project.pium.mapper.NoticeMapper;
import com.project.pium.mapper.TaskMapper;
import com.project.pium.mapper.TaskcommentMapper;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Log
@Service
@AllArgsConstructor
public class TaskcommentServiceImpl implements TaskcommentService {

    private TaskcommentMapper taskcommentMapper;
    private FileMapper fileMapper;
    private NoticeMapper noticeMapper;
    private TaskMapper taskMapper;

    //해당 업무를 클릭했을때 오른쪽에서 튀어나오는 업무 상세창의 comment 탭을 눌렀을때 나오는 모든 코멘트를 조회
    @Override
    public List<TaskcommentDTO> selectBySeqS(long taskSeq) {return taskcommentMapper.selectBySeq(taskSeq);}

    //task insertComment
    @Override
    public void insertS(TaskcommentDTO task, String isFile) {
        if(isFile.equals("true")){
            Long fileSeq= fileMapper.lastFileSeq(task.getTask_seq());
            if(fileSeq !=null){
                task.setFile_seq(fileSeq);
            }
        }
        if(!task.getMembers().equals("none")){
            String members = task.getMembers();
            String[] membersArray = members.split(",");
            List<String> memberList = new ArrayList<>();
            NoticeDTO noticeDTO = new NoticeDTO();
            
            //task 제목 받아오기'
            String taskTitle = taskMapper.findTaskTitle(task.getTask_seq());


            for (String member : membersArray) {
                Long memberSeq = Long.parseLong(member);
                noticeDTO.setNotice_title(taskTitle);
                noticeDTO.setNotice_type("mention");
                noticeDTO.setNotice_sender(task.getProjmember_seq());
                noticeDTO.setTask_seq(task.getTask_seq());
                noticeDTO.setProjmember_seq(memberSeq);
                memberList.add(member);
                noticeMapper.mentionedMember(noticeDTO);
            }
            log.info("#memberList"+memberList);
        }else if(task.getMembers().equals("none")){
            task.setMembers(null);
        }
        taskcommentMapper.insert(task);
    }

    // task comment isdel 상태로 변경
    @Override
    public void deleteS(long seq) {taskcommentMapper.delete(seq);}

    // task comment 수정
    @Override
    public void updateS(TaskcommentDTO task) {taskcommentMapper.update(task);}
}
