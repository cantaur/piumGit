package com.project.pium.service;

import com.project.pium.domain.MemberDTO;
import com.project.pium.mapper.MemberMapper;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import java.util.List;

@Log
@AllArgsConstructor
@Service
public class MemberServiceImpl implements MemberService {

    private MemberMapper memberMapper;

    @Override
    public List<MemberDTO> selectAllByEmail(String mEmail) {
        return memberMapper.selectAllByEmail(mEmail);
    }

    @Override
    public String findUserEmail(String mEmail) {
        return memberMapper.findUserEmail(mEmail);
    }

    @Override
    public long findUserNo(String mEmail) {
        return memberMapper.findUserNo(mEmail);
    }

    @Override
    public String chkUser(String mEmail) {
        String flag= memberMapper.chkUser(mEmail);
        return flag;
    }




}
