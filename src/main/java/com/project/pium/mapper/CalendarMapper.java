package com.project.pium.mapper;

import com.project.pium.domain.CalendarDTO;
import com.project.pium.domain.TaskDTO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface CalendarMapper {

    //달력 MeMo 입력
    void insertCalMemo(CalendarDTO calendarDTO);

    //달력 list byProSeq 조회
    List<CalendarDTO> calListByProjSeq(long projSeq);
    //해당 프로젝트에서 생성된 업무 리스트 조회(날짜 없는 데이터는 제외)
    List<TaskDTO> taskListByProjSeq(long projSeq);
    //달력 날짜 수정
    void upCalDate(CalendarDTO calendarDTO);
    //달력 내용 수정
    void updateCal(CalendarDTO calendarDTO);
    //달력 상세내용 조회
    CalendarDTO calListBySeq(long calSeq);
    //달력 seq 삭제
    void delCal(long calSeq);
    
}
