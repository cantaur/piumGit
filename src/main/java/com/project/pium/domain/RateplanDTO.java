package com.project.pium.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RateplanDTO {
    private String rate_code;
    private String rate_name;
    private int rate_cost;
}
