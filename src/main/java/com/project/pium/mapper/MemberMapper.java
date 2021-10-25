package com.project.pium.mapper;

import com.project.pium.domain.MemberDTO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface MemberMapper {

    //이메일로 유저 정보 검색
    List<MemberDTO> selectAllByEmail(String mEmail);
    //이메일로 유저 이메일 검색
    String findUserEmail(String mEmail);
    //이메일로 member_seq 검색
    long findUserNo(String mEmail);
    //해당 이메일을 갖고 있는 유저가 있는지 여부 체크
    String chkUser(String mEmail);


}
