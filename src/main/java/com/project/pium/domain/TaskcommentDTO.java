package com.project.pium.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskcommentDTO {
    private long comment_seq;
    private String comment_content;
    private String comment_isdelete;
    private Date comment_date;
    private String members;
    private Long task_seq;
    private Long projmember_seq;
    private Long file_seq;

}
