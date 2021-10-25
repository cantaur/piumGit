package com.project.pium.mapper;


import com.project.pium.domain.MilestoneDTO;
import com.project.pium.domain.TaskDTO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@Mapper
public interface SearchMapper {
    List<MilestoneDTO> searchM(Map<String,String>param);
    List<TaskDTO> searchT(Map<String,String>param);
}
