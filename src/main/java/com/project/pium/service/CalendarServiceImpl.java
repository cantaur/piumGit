package com.project.pium.service;

import com.project.pium.domain.CalendarDTO;
import com.project.pium.domain.TaskDTO;
import com.project.pium.mapper.CalendarMapper;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;

import java.util.List;

@Log
@AllArgsConstructor
@Service
public class CalendarServiceImpl implements CalendarService {

    private CalendarMapper calendarMapper;


    @Override
    public void insertCalMemo(CalendarDTO calendarDTO) {
        calendarMapper.insertCalMemo(calendarDTO);
    }

    @Override
    public List<CalendarDTO> calListByProjSeq(long projSeq) {
        return calendarMapper.calListByProjSeq(projSeq);
    }

    @Override
    public List<TaskDTO> taskListByProjSeq(long projSeq) {
        return calendarMapper.taskListByProjSeq(projSeq);
    }
    @Override
    public void upCalDate(CalendarDTO calendarDTO) {
        calendarMapper.upCalDate(calendarDTO);
    }

    @Override
    public void updateCal(CalendarDTO calendarDTO) {
        calendarMapper.updateCal(calendarDTO);
    }

    @Override
    public CalendarDTO calListBySeq(long calSeq) {
        return calendarMapper.calListBySeq(calSeq);
    }


    @Override
    public void delCal(long calSeq) {
        calendarMapper.delCal(calSeq);
    }
}
