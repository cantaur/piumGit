package com.project.pium.controller;

import com.project.pium.domain.CalendarDTO;
import com.project.pium.domain.TaskDTO;
import com.project.pium.service.CalendarService;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 프로젝트>캘린더 페이지(완료)
 */

@Log
@RestController
@AllArgsConstructor
public class CalendarController {

    private CalendarService calendarService;



    //새 달력 MEMO 만들기

    @PostMapping("ajax/createCal")
    public void insertCalMemo (@RequestBody CalendarDTO calendarDTO) {
        calendarService.insertCalMemo(calendarDTO);
    }

    //이 프로젝트에서 생성한 모든 캘린더 리스트 조회, 이 프로젝트의 모든 업무 조회
    @GetMapping("ajax/calList/{projSeq}")
    public ArrayList<Object> calList(@PathVariable long projSeq){
        ArrayList<Object> calList = new ArrayList<>();
        LinkedHashMap<String,Object> tempCal = new LinkedHashMap<>();

        List<CalendarDTO> calListProj = calendarService.calListByProjSeq(projSeq); //캘린더 리스트
        List<TaskDTO> taskListProj = calendarService.taskListByProjSeq(projSeq); //업무 리스트 조회

        tempCal.put("calListProj", calListProj);
        tempCal.put("taskListProj", taskListProj);

        calList.add(tempCal);
        return calList;
    }

    //캘린더>메모 상세보기
    @GetMapping("ajax/calendar/{calSeq}")
    public CalendarDTO calDetail(@PathVariable long calSeq){
        CalendarDTO calendarDTO = calendarService.calListBySeq(calSeq);
        return calendarDTO;

    }

    //캘린더>메모 날짜 업데이트
    @PostMapping("ajax/updateDate")
    public void updateDate(@RequestBody CalendarDTO calendarDTO){
        calendarService.upCalDate(calendarDTO);
    }


    //캘린더>메모 내용 업데이트
    @PostMapping("ajax/updateCal")
    public void updateCal(@RequestBody CalendarDTO calendarDTO){
        calendarService.updateCal(calendarDTO);

    }

    //캘린더 메모 삭제
    @GetMapping("ajax/deleteCal/{calSeq}")
    public void delCal(@PathVariable long calSeq){
        calendarService.delCal(calSeq);
    }
}

