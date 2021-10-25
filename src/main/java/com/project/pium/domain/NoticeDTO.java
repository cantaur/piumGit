package com.project.pium.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoticeDTO {
    private long notice_seq;
    private String notice_title;
    private String notice_type;
    private Date notice_date;
    private String notice_status;
    private Long notice_sender;
    private Long task_seq;
    private Long milestone_seq;
    private Long projmember_seq;

}
