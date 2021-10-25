package com.project.pium.mapper;

import com.project.pium.domain.NoticeDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Mapper
@Repository
public interface NoticeMapper {
    void mentionedMember(NoticeDTO noticeDTO);
    List<NoticeDTO> selectNotice(@Param("projmember_seq") long projmemberSeq);
    void mileNotice(NoticeDTO noticeDTO);
    void taskNotice(NoticeDTO noticeDTO);
    void deletenotic(long notice_seq);
    void updateStatus(long notice_seq);

}
