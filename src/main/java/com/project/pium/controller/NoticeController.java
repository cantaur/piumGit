package com.project.pium.controller;


import com.project.pium.domain.NoticeDTO;
import com.project.pium.service.NoticeService;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Log
@RestController
@AllArgsConstructor
public class NoticeController {
    private NoticeService noticeService;

    @GetMapping("ajax/notice/{projmemberSeq}")
    public List<NoticeDTO> notice(@PathVariable long projmemberSeq){
        return noticeService.selectNoticeS(projmemberSeq);

    }

    //업무 모달>업무 삭제상태로 변경
    @PostMapping("ajax/noticeChk")
    public void checkNotice(@RequestBody Map<String,Integer> param){
        Long notice_seq = Long.valueOf(param.get("notice_seq"));
        noticeService.updateStatusS(notice_seq);
    }
    //공지 삭제
    @GetMapping("ajax/deleteNo/{Notice_seq}")
    public void delNotice(@PathVariable long Notice_seq){
        noticeService.deletenoticS(Notice_seq);
    }

}
