package com.project.pium.service;

import com.project.pium.domain.*;
import com.project.pium.mapper.*;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Log
@AllArgsConstructor
@Service
public class TaskServiceImpl implements TaskService {
    private TaskMapper taskMapper;
    private TaskmemberMapper taskmemberMapper;
    private WorklabelMapper worklabelMapper;
    private NoticeMapper noticeMapper;
    private ProjectmemberMapper projectmemberMapper;




    @Override
    public void createTask(TaskDTO taskDTO) {
        taskMapper.createTask(taskDTO);

        String no_title = taskDTO.getTask_title(); // no_title
        String no_type = "addtask"; //no_type
        long sender_seq = taskDTO.getProjmember_seq(); //no_sender
        Long milestone_seq = taskDTO.getMilestone_seq(); //no_mile_seq
        long task_seq = taskMapper.lasttaskSeq(taskDTO.getProject_seq()); //no_task_seq
        List<ProjectmemberDTO> projmember_seq = projectmemberMapper.allProMemberSeq(taskDTO.getProject_seq());
        NoticeDTO NoTaskDTO = new NoticeDTO();

        for(int i = 0; i < projmember_seq.size(); i++) {
            NoTaskDTO.setNotice_title(no_title);
            NoTaskDTO.setNotice_type(no_type);
            NoTaskDTO.setNotice_sender(sender_seq);
            NoTaskDTO.setTask_seq(task_seq);
            if(milestone_seq != null) {
                NoTaskDTO.setMilestone_seq(milestone_seq);
            }
            NoTaskDTO.setProjmember_seq(projmember_seq.get(i).getProjmember_seq());
            noticeMapper.taskNotice(NoTaskDTO);
        }



    }

    @Override
    public void insertTaskMember(long projmemberSeq){
        long taskSeq = taskmemberMapper.lastTaskSeq();
        taskMapper.updateTaskMember(taskSeq,projmemberSeq);
    }

    @Override
    public List<TaskDTO> taskList(long projSeq) {
        return taskMapper.taskList(projSeq);
    }




    //???????????? ??????????????? ???. ????????? ??????
    //?????? ?????????????????? ????????? ?????? ??????
    @Override
    public int countTask(long mileSeq) {
        return taskMapper.countTask(mileSeq);
    }
    //?????? ?????????????????? ????????? ????????? ??????
    @Override
    public int countClosedTask(long mileSeq) {
        return taskMapper.countClosedTask(mileSeq);
    }
    //???????????? ?????? ??????????????? milestone_seq=? ????????? ????????? ?????? ?????? ????????? ??????
    @Override
    public List<TaskDTO> taskListByMile(long mileSeq){
        List<TaskDTO> tasks= taskMapper.taskListByMile(mileSeq);
        return tasks;
    }
    //labelSeq??? ?????? ?????? ??????
    @Override
    public LabelDTO findLabelTitle(long labelSeq) {
        return worklabelMapper.findLabelTitle(labelSeq);
    }
    @Override
    public List<TaskDTO> openTaskListByMile(long mileSeq) {
        return taskMapper.openTaskListByMile(mileSeq);
    }

    @Override
    public List<TaskDTO> closedTaskListByMile(long mileSeq) {
        return taskMapper.closedTaskListByMile(mileSeq);
    }



    //?????? ??????(????????????)
    @Override
    public TaskDTO showTaskByTaskseq(long taskSeq){
        return taskMapper.showTaskByTaskseq(taskSeq);
    }
    @Override
    public void updateTitle(String teskTitle, long taskSeq){
        taskMapper.updateTitle(teskTitle,taskSeq);
    }

    @Override
    public void updateContent(String teskContent, long taskSeq){
        taskMapper.updateContent(teskContent,taskSeq);
    }

    @Override
    public void updateMilestone(long mileSeq, long taskSeq){
        if(mileSeq==0){
            taskMapper.deleteMilestone(taskSeq);
        }else{
            taskMapper.updateMilestone(mileSeq,taskSeq);
        }
    }

    @Override
    public void setTaskDateEmpty(long taskSeq) {
        taskMapper.setTaskDateEmpty(taskSeq);

    }
    @Override
    public void updateDate(TaskDTO task){
        taskMapper.updateDate(task);
    }

    @Override
    public void updateTaskMember(long taskSeq, long projmemberSeq){
        taskMapper.updateTaskMember(taskSeq,projmemberSeq);
    }

    @Override
    public void updatePriority(String priorityCode, long taskSeq){
        taskMapper.updatePriority(priorityCode,taskSeq);
    }

    //label_title ????????? ????????? ????????? ??????
    @Override
    public String chkLabel(String labelTitle) {
        String temp= worklabelMapper.chkLabel(labelTitle);
        log.info("?????? ????????? ????????? ?????? : "+temp);
        if(temp !=null){
            return "success";
        }else{
            return "fail";
        }
    }

    @Override
    public Long findLabelSeq(String labelTitle) {
        return worklabelMapper.findLabelSeq(labelTitle);
    }

    @Override
    public void updateLabel(long labelSeq, long taskSeq) {
        taskMapper.updateLabel(labelSeq,taskSeq);
    }


    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = {Exception.class})
    @Override
    public String insertLabel(LabelDTO labelDTO, long taskSeq) {
        log.info("labelDTO, taskseq : "+labelDTO+", "+taskSeq);
        worklabelMapper.insertLabel(labelDTO); //????????? ?????? insert
        long labelSeq= worklabelMapper.lastLabelSeq(); //?????? ??????seq ??????
        updateLabel(labelSeq,taskSeq);

        return "success";
    }

    @Override
    public void updateStatusFinish(long taskSeq){
        taskMapper.updateStatusFinish(taskSeq);
    }

    @Override
    public void updateStatusDefault(long taskSeq){
        taskMapper.updateStatusDefault(taskSeq);
    }

    @Override
    public void updateIsdelete(long taskSeq){
        taskMapper.updateIsdelete(taskSeq);
    }



    @Override
    public void deleteTaskmem(long task_seq, long projmember_seq) {
        taskMapper.deleteTaskmem(task_seq,projmember_seq);

    }




}
