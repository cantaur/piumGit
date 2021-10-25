package com.project.pium.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MilestoneDTO {
    private Long milestone_seq;
    private String milestone_title;
    private String milestone_content;
    private String milestone_status;
    private String milestone_isdelete;
    private Date milestone_startdate;
    private Date milestone_duedate;
    private Date milestone_enddate;
    private long projmember_seq;
    private long project_seq;
}
