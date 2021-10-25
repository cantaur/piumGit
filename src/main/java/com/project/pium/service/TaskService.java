package com.project.pium.service;

import com.project.pium.domain.LabelDTO;
import com.project.pium.domain.TaskDTO;
import com.project.pium.domain.TaskmemberDTO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface TaskService {

    //마일스톤 페이지(지우면 안됨)
    int countTask(long mileSeq);
    int countClosedTask(long mileSeq);
    List<TaskDTO> taskListByMile(long mileSeq);
    LabelDTO findLabelTitle(long labelSeq);
    //해당 마일스톤에서 생성된 업무리스트 중 진행중 상태인거
    List<TaskDTO> openTaskListByMile(long mileSeq);
    //해당 마일스톤에서 생성된 업무리스트 중 마감된 상태인거
    List<TaskDTO> closedTaskListByMile(long mileSeq);

    //업무를 클릭하였을 때 업무 상세보기
    TaskDTO showTaskByTaskseq(long taskSeq);
    //title update
    void updateTitle(String teskTitle, long taskSeq);
    //content update
    void updateContent(String teskContent, long taskSeq);
    //마일스톤 변경하기
    void updateMilestone(long mileSeq, long taskSeq);
    //날짜 비우기
    void setTaskDateEmpty(long taskSeq);
    //날짜 업데이트
    void updateDate(TaskDTO task);
    //task_member에 추가하기
    void updateTaskMember(long taskSeq, long projmemberSeq);
    //업무 중요도 셋팅하기
    void updatePriority(String priorityCode, long taskSeq);
    //라벨 셋팅
    String chkLabel(String labelTitle);
    Long findLabelSeq(String labelTitle);
    void updateLabel(long labelSeq, long taskSeq);
    String insertLabel(LabelDTO labelDTO, long taskSeq);
    //업무상태 마감으로 변경
    void updateStatusFinish(long taskSeq);
    //업무상태 다시 활성화 시키기
    void updateStatusDefault(long taskSeq);
    //업무상태 종료로 변경
    void updateIsdelete(long taskSeq);










    //새 업무 생성하기
    void createTask(TaskDTO task);
    //task_member에 추가하기
    void insertTaskMember(long projmemberSeq);

    //해당 프로젝트에서 생성된 업무 리스트
    List<TaskDTO> taskList(long projSeq);


    void deleteTaskmem(long task_seq, long projmember_seq);









}
