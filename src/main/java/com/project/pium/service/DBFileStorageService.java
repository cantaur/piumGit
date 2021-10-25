package com.project.pium.service;

import com.project.pium.domain.FileDTO;
import com.project.pium.file.exception.FileStorageException;
import com.project.pium.file.exception.MyFileNotFoundException;
import com.project.pium.file.property.FileStorageProperties;
import com.project.pium.mapper.FileMapper;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;

@Log
@Service
public class DBFileStorageService {

    @Autowired
    private FileMapper fileMapper;

    private final Path fileStorageLocation;


    @Autowired
    public DBFileStorageService(FileStorageProperties fileStorageProperties) {
        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir())
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    //
    public String storeFile(MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            // Check if the file's name contains invalid characters
            if(fileName.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
            }
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }


    //단일 파일 저장하기
    public String saveFile(FileDTO fileDTO){
        log.info("#파일 생성중 : "+fileDTO);
        fileMapper.saveFile(fileDTO);
        return "succeess";
    }




    public FileDTO getFile(long fileId) {
        return fileMapper.findById(fileId);

    }

    public List<FileDTO> findFileByTaskseq(long taskSeq){
        return fileMapper.findFileByTaskseq(taskSeq);
    }

    public List<Map<String,Object>> findFileByProjseq(long projSeq){
        return fileMapper.findFileByProjseq(projSeq);
    }

}
