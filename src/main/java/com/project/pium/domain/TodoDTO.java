package com.project.pium.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TodoDTO {
    private long todo_seq;
    private String todo_name;
    private String todo_content;
    private Date todo_date;
    private String todo_status;
    private long task_seq;
    private String task_title;
    private long projmember_seq;
}
