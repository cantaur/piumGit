package com.project.pium.mapper;

import com.project.pium.domain.LabelDTO;
import com.project.pium.domain.TaskDTO;
import com.project.pium.domain.TaskmemberDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Mapper
@Repository
public interface TaskMapper {

    //해당 마일스톤에서 생성된 업무 갯수
    int countTask(long mileSeq);
    //해당 마일스톤에서 완료된 업무의 갯수
    int countClosedTask(long mileSeq);
    //해당 마일스톤에서 생성된 전체 업무리스트
    List<TaskDTO> taskListByMile(long mileSeq);
    //해당 마일스톤에서 생성된 업무리스트 중 진행중 상태인거
    List<TaskDTO> openTaskListByMile(long mileSeq);
    //해당 마일스톤에서 생성된 업무리스트 중 마감된 상태인거
    List<TaskDTO> closedTaskListByMile(long mileSeq);


    //업무를 클릭하였을 때 업무 상세보기
    TaskDTO showTaskByTaskseq(long taskSeq);
    //title update
    void updateTitle(@Param("task_title") String teskTitle, @Param("task_seq") long taskSeq);
    //content update
    void updateContent(@Param("task_content") String teskContent, @Param("task_seq") long taskSeq);
    //마일스톤 변경하기
    void updateMilestone(@Param("milestone_seq") long mileSeq, @Param("task_seq") long taskSeq);
    //마일스톤 빼기
    void deleteMilestone(@Param("task_seq") long taskSeq);
    //날짜 업데이트
    void updateDate(TaskDTO task);
    //업무 date들 null로 셋팅
    void setTaskDateEmpty(long taskSeq);
    //task_member테이블에 projmember_seq, task_seq셋팅
    void updateTaskMember(@Param("task_seq") long taskSeq, @Param("projmember_seq") long projmemberSeq);
    //업무 중요도 셋팅하기
    void updatePriority(@Param("priority_code") String priorityCode, @Param("task_seq") long taskSeq);
    //업무 라벨 셋팅하기
    void updateLabel(@Param("label_seq") long labelSeq, @Param("task_seq") long taskSeq);
    //업무상태 마감으로 변경
    void updateStatusFinish(long taskSeq);
    //업무상태 다시 활성화 시키기
    void updateStatusDefault(long taskSeq);
    //업무상태 종료로 변경
    void updateIsdelete(long taskSeq);








    void createTask(TaskDTO task);
    List<TaskDTO> taskList(long projSeq);


    //업무에서 멤버 삭제
    void deleteTaskmem(long task_seq, long projmember_seq);

    //최신 task_seq
    long lasttaskSeq(long projSeq);
    
    //task제목 받아오기(comment 입력시 title에 쓸것임)
    String findTaskTitle(long task_seq);

}
