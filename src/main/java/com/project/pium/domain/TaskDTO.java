package com.project.pium.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private long task_seq;
    private String task_title;
    private String task_content;
    private String task_status;
    private String task_isdelete;
    private Timestamp task_startdate;
    private Timestamp task_duedate;
    private Timestamp task_enddate;
    private Timestamp task_date;
    private long projmember_seq;
    private Long milestone_seq;
    private long project_seq;
    private String priority_code;
    private long label_seq;
    private String label_title;

}
