package com.project.pium.service;

import com.project.pium.domain.MemberDTO;
import java.util.List;

public interface MemberService {
    List<MemberDTO> selectAllByEmail(String mEmail);
    String findUserEmail(String mEmail);
    long findUserNo(String mEmail);
    String chkUser(String mEmail);
}
