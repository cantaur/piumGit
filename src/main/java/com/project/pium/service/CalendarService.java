package com.project.pium.service;

import com.project.pium.domain.CalendarDTO;
import com.project.pium.domain.TaskDTO;

import java.util.List;

public interface CalendarService {


    // MEMO 삽입
    void insertCalMemo(CalendarDTO calendarDTO);
    List<CalendarDTO> calListByProjSeq(long projSeq);
    //해당 프로젝트에서 생성된 업무 리스트 조회(날짜 없는 데이터는 제외)
    List<TaskDTO> taskListByProjSeq(long projSeq);
    //달력 날짜 수정
    void upCalDate(CalendarDTO calendarDTO);
    //달력 내용 수정
    void updateCal(CalendarDTO calendarDTO);
    //달력 상세내용 조회
    CalendarDTO calListBySeq(long calSeq);




    void delCal(long calSeq);
}
