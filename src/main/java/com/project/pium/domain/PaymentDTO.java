package com.project.pium.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private long payment_seq;
    private Date payment_date;
    private int payment_cost;
    private String payment_how;
    private String rate_code;
    private long project_seq;
    private long projmember_seq;

}
