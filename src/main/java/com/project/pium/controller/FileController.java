package com.project.pium.controller;

import com.project.pium.domain.FileDTO;
import com.project.pium.service.DBFileStorageService;
import com.project.pium.service.FileStorageService;
import com.project.pium.file.payload.UploadFileResponse;
import lombok.extern.java.Log;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Log
@RestController
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private DBFileStorageService dbFileStorageService;



    //현재 로그인한 유저의 세션값 얻어오는 로직 모듈화
    public String currentUserName(Principal principal){
        if(principal ==null){
            return "false";
        }else{
            String sessionEmail = principal.getName();
            return sessionEmail;
        }
    }

    @PostMapping("ajax/uploadFile")
    public UploadFileResponse uploadFile(@RequestParam("file") MultipartFile file, FileDTO fileDTO) {
        String fileName = dbFileStorageService.storeFile(file);
        long projMemSeq= fileDTO.getProjmember_seq();
        long taskSeq = fileDTO.getTask_seq();
        long projectSeq = fileDTO.getProject_seq();
        fileDTO = new FileDTO(-1, fileName, fileName, null,file.getSize(), file.getContentType(),null,projMemSeq,taskSeq,projectSeq);
        dbFileStorageService.saveFile(fileDTO);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/downloadFile/")
                .path(fileName)
                .toUriString();
        log.info("#fileDownloadUri"+fileDownloadUri);

        return new UploadFileResponse(fileName, fileDownloadUri,
                file.getContentType(), file.getSize());
    }

    @PostMapping("ajax/uploadMulti")
    public List<UploadFileResponse> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files, FileDTO fileDTO) {
        return Arrays.asList(files)
                .stream()
                .map(file -> uploadFile(file, fileDTO))
                .collect(Collectors.toList());
    }

    @GetMapping("downloadFile/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        // Load file as Resource
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            logger.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("ajax/taskFileList/{taskSeq}")
    public List<FileDTO> taskFilelist(@PathVariable long taskSeq){
        log.info("####"+dbFileStorageService.findFileByTaskseq(taskSeq));
        return dbFileStorageService.findFileByTaskseq(taskSeq);
    }

    @GetMapping("ajax/FileList/{projSeq}")
    public List<Map<String,Object>> projectFilelist(@PathVariable long projSeq){
        log.info("####"+dbFileStorageService.findFileByProjseq(projSeq));
        return dbFileStorageService.findFileByProjseq(projSeq);
    }

}