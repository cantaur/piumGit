package com.project.pium.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {
    private long project_seq;
    private String project_title;
    private String project_content;
    private String project_status;
    private String project_isdelete;
    private Date project_startdate;
    private Date project_duedate;
    private Date project_enddate;
    private long member_seq;
    private String projmember_type;


}
