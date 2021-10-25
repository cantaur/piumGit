package com.project.pium.mapper;

import com.project.pium.domain.FileDTO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Mapper
@Repository
public interface FileMapper {
    //파일 저장
    void saveFile(FileDTO fileDTO);
    FileDTO findById(long fileId);
    List<FileDTO> findFileByTaskseq(long taskSeq);
    List<Map<String,Object>> findFileByProjseq(long projSeq);
    Long lastFileSeq(long taskSeq);

}
