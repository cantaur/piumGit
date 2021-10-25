package com.project.pium.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskmemberDTO {
    private long taskmember_seq;
    private long task_seq;
    private long projmember_seq;
    //chart4 데이터용
    private long total;
    private long done;
    private long project_seq;

}
