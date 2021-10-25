package com.project.pium.service;

import com.project.pium.domain.MilestoneDTO;
import com.project.pium.domain.TaskDTO;

import java.util.List;
import java.util.Map;

public interface SearchService {
    List<MilestoneDTO> searchMS(Map<String,String>param);
    List<TaskDTO> searchTS(Map<String,String>param);
}
