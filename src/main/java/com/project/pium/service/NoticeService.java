package com.project.pium.service;

import com.project.pium.domain.NoticeDTO;

import java.util.List;

public interface NoticeService {
    List<NoticeDTO> selectNoticeS(long projmemberSeq);

    void deletenoticS(long notice_seq);
    void updateStatusS(long notice_seq);

}
