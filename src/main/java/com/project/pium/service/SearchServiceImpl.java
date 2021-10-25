package com.project.pium.service;

import com.project.pium.domain.MilestoneDTO;
import com.project.pium.domain.TaskDTO;
import com.project.pium.mapper.SearchMapper;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Log
@Service
@AllArgsConstructor
public class SearchServiceImpl implements SearchService {
    private SearchMapper mapper;
    @Override
    public List<MilestoneDTO> searchMS(Map<String,String> param) {
        return mapper.searchM(param);
    }
    @Override
    public List<TaskDTO> searchTS(Map<String,String> param) {
        return mapper.searchT(param);
    }
}
