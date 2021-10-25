package com.project.pium.mapper;


import com.project.pium.domain.SignDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
@Mapper
public interface SignMapper {
    //회원가입
    int signup(SignDTO signDTO);
    //유저 권한 저장
    int userRoleSave(@Param("member_seq") int userNo, @Param("authorities_no") int roleNo);
    //유저 인증키 저장
    void authkeySave(@Param("authKey") String setAuthKey, @Param("member_email") String email);
    //유저 정보
    ArrayList<SignDTO> findByUserId(String id);
    //유저 FK번호 알아내기
    int findUserNo(String id);
    //권한 FK번호 알아내기
    int findRoleNo(String roleName);

}
